import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const matchSchema = z.object({
  winnerIds: z.array(z.string().cuid()).length(2, "Devono esserci esattamente 2 vincitori"),
  participantIds: z.array(z.string().cuid()).min(2),
});

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const matches = await prisma.schiacciaSette.findMany({
    include: { participants: { include: { player: true } } },
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

  const { winnerIds, participantIds } = result.data;

  for (const winnerId of winnerIds) {
    if (!participantIds.includes(winnerId)) {
      return NextResponse.json({ error: "I vincitori devono essere tra i partecipanti" }, { status: 400 });
    }
  }

  const match = await prisma.schiacciaSette.create({
    data: {
      participants: {
        create: participantIds.map((playerId) => ({
          playerId,
          isWinner: winnerIds.includes(playerId),
        })),
      },
    },
    include: { participants: { include: { player: true } } },
  });

  return NextResponse.json(match, { status: 201 });
}
