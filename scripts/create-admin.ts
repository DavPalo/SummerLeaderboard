/**
 * Script per creare l'utente Admin su Supabase.
 * Uso: npx tsx scripts/create-admin.ts
 */
import * as dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY nel .env");
  process.exit(1);
}

const EMAIL = process.argv[2] || "admin@summerleaderboard.it";
const PASSWORD = process.argv[3] || "Admin2025!";

async function createAdmin() {
  console.log(`\n🔧 Creazione utente admin: ${EMAIL}\n`);

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true, // conferma email automatica
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Errore:", data.message ?? JSON.stringify(data));
    process.exit(1);
  }

  console.log("✅ Utente admin creato con successo!");
  console.log(`   Email:    ${EMAIL}`);
  console.log(`   Password: ${PASSWORD}`);
  console.log(`   ID:       ${data.id}`);
  console.log("\n🚀 Puoi ora accedere su /login con queste credenziali.\n");
}

createAdmin();
