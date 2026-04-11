import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";

async function main() {
  // --- Prisma: delete all match/player data ---
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Deleting match data...");
  await prisma.schiacciaSette_Participant.deleteMany();
  await prisma.schiacciaSette.deleteMany();
  await prisma.pingPongSingles.deleteMany();
  await prisma.pingPongDoubles.deleteMany();
  await prisma.player.deleteMany();
  console.log("✓ All players and matches deleted");

  await prisma.$disconnect();
  await pool.end();

  // --- Supabase: delete all auth users ---
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  console.log("Fetching auth users...");
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;

  for (const user of data.users) {
    const { error: delErr } = await supabase.auth.admin.deleteUser(user.id);
    if (delErr) console.error(`Failed to delete user ${user.email}:`, delErr.message);
    else console.log(`✓ Deleted auth user: ${user.email}`);
  }

  console.log("Done. DB is empty.");
}

main().catch((e) => { console.error(e); process.exit(1); });
