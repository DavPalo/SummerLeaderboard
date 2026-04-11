import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPlayerSchema = z.object({
  name: z.string().min(2).max(30),
  emoji: z.string().default("🏅"),
});

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const players = await prisma.player.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(players);
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json();
  const result = createPlayerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const player = await prisma.player.create({ data: result.data });
  return NextResponse.json(player, { status: 201 });
}
