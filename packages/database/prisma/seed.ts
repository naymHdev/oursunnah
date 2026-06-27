/**
 * Seed: Create default SUPER_ADMIN account.
 *
 * Run: pnpm --filter @our-sunnah/database seed
 *
 * Safe to run multiple times — uses upsert so it won't duplicate the admin.
 * Change credentials via env vars before running in production.
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@oursunnah.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Super Admin";

async function main() {
  console.log("🌱  Seeding database…\n");

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: "SUPER_ADMIN",
      password: hashedPassword,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      emailVerified: true,
    },
  });

  console.log("✅  SUPER_ADMIN seeded:");
  console.log(`    Name  : ${admin.name}`);
  console.log(`    Email : ${admin.email}`);
  console.log(`    Role  : ${admin.role}`);
  console.log(
    `\n⚠️   Default password is "${ADMIN_PASSWORD}". Change it after first login.`
  );
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
