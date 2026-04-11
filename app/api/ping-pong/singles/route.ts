import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const matchSchema = z.object({
  player1Id: z.string().cuid(),
  player2Id: z.string().cuid(),
  winnerId: z.string().cuid(),
  score1: z.number().int().min(0),
  score2: z.number().int().min(0),
});

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const matches = await prisma.pingPongSingles.findMany({
    include: { player1: true, player2: true, winner: true },
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

  const { player1Id, player2Id, winnerId, score1, score2 } = result.data;

  if (player1Id === player2Id) {
    return NextResponse.json({ error: "I giocatori devono essere diversi" }, { status: 400 });
  }
  if (![player1Id, player2Id].includes(winnerId)) {
    return NextResponse.json({ error: "Il vincitore deve essere uno dei giocatori" }, { status: 400 });
  }
  if (score1 === score2) {
    return NextResponse.json({ error: "Non ci possono essere pareggi" }, { status: 400 });
  }

  const match = await prisma.pingPongSingles.create({
    data: { player1Id, player2Id, winnerId, score1, score2 },
    include: { player1: true, player2: true, winner: true },
  });

  return NextResponse.json(match, { status: 201 });
}
