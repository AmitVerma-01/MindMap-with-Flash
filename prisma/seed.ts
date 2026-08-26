import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { createPgAdapter } from "../lib/pg-adapter";
import { PLAN_DEFINITIONS } from "../lib/plans";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({ adapter: createPgAdapter(connectionString) });

async function main() {
  console.log("Seeding plans...");

  for (const plan of PLAN_DEFINITIONS) {
    const record = await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        monthlyCredits: plan.monthlyCredits,
        priceCents: plan.priceCents,
        description: plan.description,
        active: plan.active,
        selectable: plan.selectable,
        sortOrder: plan.sortOrder,
      },
      create: {
        slug: plan.slug,
        name: plan.name,
        monthlyCredits: plan.monthlyCredits,
        priceCents: plan.priceCents,
        description: plan.description,
        active: plan.active,
        selectable: plan.selectable,
        sortOrder: plan.sortOrder,
      },
    });

    console.log(
      `  ✓ ${record.slug} — ${record.name} (${record.monthlyCredits} credits/mo, $${record.priceCents / 100})`
    );
  }

  console.log("\nPlan seed complete.");
}

main()
  .catch((e) => {
    console.error("Plan seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
