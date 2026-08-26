export type PlanSlug = "free" | "pro";

export interface PlanDefinition {
  slug: PlanSlug;
  name: string;
  monthlyCredits: number;
  priceCents: number;
  description: string;
  active: boolean;
  /** Whether users can select this plan in the UI */
  selectable: boolean;
  sortOrder: number;
}

/** Canonical plan definitions — used by prisma seed and as runtime fallback */
export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    slug: "free",
    name: "Starter",
    monthlyCredits: 50,
    priceCents: 0,
    description: "Perfect for trying out the platform",
    active: true,
    selectable: true,
    sortOrder: 1,
  },
  {
    slug: "pro",
    name: "Professional",
    monthlyCredits: 300,
    priceCents: 500,
    description: "For serious learners and power users",
    active: true,
    selectable: false,
    sortOrder: 2,
  },
];

export const PLAN_LIMITS = Object.fromEntries(
  PLAN_DEFINITIONS.map((p) => [
    p.slug,
    {
      name: p.name,
      monthlyCredits: p.monthlyCredits,
      price: p.priceCents / 100,
    },
  ])
) as Record<
  PlanSlug,
  { name: string; monthlyCredits: number; price: number }
>;

export function isPlanSlug(value: string): value is PlanSlug {
  return value === "free" || value === "pro";
}
