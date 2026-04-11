import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const matchSchema = z.object({
  team1PlayerAId: z.string().cuid(),
  team1PlayerBId: z.string().cuid(),
  team2PlayerAId: z.string().cuid(),
  team2PlayerBId: z.string().cuid(),
  score1: z.number().int().min(0),
  score2: z.number().int().min(0),
  winnerTeam: z.literal(1).or(z.literal(2)),
});

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const matches = await prisma.pingPongDoubles.findMany({
    include: { team1PlayerA: true, team1PlayerB: true, team2PlayerA: true, team2PlayerB: true },
    orderBy: { playedAt: "desc" },
  });
  return NextResponse.json(matches);
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json();
  const result = matchSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const { team1PlayerAId, team1PlayerBId, team2PlayerAId, team2PlayerBId, score1, score2, winnerTeam } = result.data;

  const allIds = [team1PlayerAId, team1PlayerBId, team2PlayerAId, team2PlayerBId];
  if (new Set(allIds).size < 4) {
    return NextResponse.json({ error: "Tutti i giocatori devono essere diversi" }, { status: 400 });
  }
  if (score1 === score2) {
    return NextResponse.json({ error: "Non ci possono essere pareggi" }, { status: 400 });
  }

  const match = await prisma.pingPongDoubles.create({
    data: { team1PlayerAId, team1PlayerBId, team2PlayerAId, team2PlayerBId, score1, score2, winnerTeam },
  });

  return NextResponse.json(match, { status: 201 });
}
