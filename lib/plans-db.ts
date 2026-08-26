import { prisma } from "@/lib/prisma";
import {
  PLAN_DEFINITIONS,
  PLAN_LIMITS,
  type PlanSlug,
  isPlanSlug,
} from "@/lib/plans";

export async function getPlanMonthlyCredits(slug: string): Promise<number> {
  if (!isPlanSlug(slug)) {
    return 0;
  }

  try {
    const plan = await prisma.plan.findUnique({
      where: { slug },
      select: { monthlyCredits: true, active: true },
    });

    if (plan?.active) {
      return plan.monthlyCredits;
    }
  } catch {
    // Plan table may not exist yet — fall back to constants
  }

  return PLAN_LIMITS[slug].monthlyCredits;
}

export async function getActivePlans() {
  try {
    const plans = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });

    if (plans.length > 0) {
      return plans;
    }
  } catch {
    // fall through
  }

  return PLAN_DEFINITIONS.map((p) => ({
    id: p.slug,
    slug: p.slug,
    name: p.name,
    monthlyCredits: p.monthlyCredits,
    priceCents: p.priceCents,
    description: p.description,
    active: p.active,
    selectable: p.selectable,
    sortOrder: p.sortOrder,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function isPlanSelectable(slug: PlanSlug): Promise<boolean> {
  try {
    const plan = await prisma.plan.findUnique({
      where: { slug },
      select: { selectable: true, active: true },
    });
    if (plan) {
      return plan.active && plan.selectable;
    }
  } catch {
    // fall through
  }

  const def = PLAN_DEFINITIONS.find((p) => p.slug === slug);
  return def?.selectable ?? false;
}
