import { NextResponse } from "next/server";
import { getActivePlans } from "@/lib/plans-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plans = await getActivePlans();

    return NextResponse.json({
      plans: plans.map((p) => ({
        slug: p.slug,
        name: p.name,
        monthlyCredits: p.monthlyCredits,
        price: p.priceCents / 100,
        priceCents: p.priceCents,
        description: p.description,
        selectable: p.selectable,
      })),
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
