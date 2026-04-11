import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // DIRECT_URL = Session Pooler (porta 5432) — usato per le migration
    url: process.env.DIRECT_URL ?? "",
  },
});
