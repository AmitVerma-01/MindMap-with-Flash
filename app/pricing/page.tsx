import type { Metadata } from "next";
import { getActivePlans } from "@/lib/plans-db";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing - Choose Your Plan",
  description: "Start free with 50 credits per month. Upgrade to Pro for more AI-powered flashcard generation.",
};

export default async function PricingPage() {
  const plans = await getActivePlans();
  const serializedPlans = plans.map((p) => ({
    slug: p.slug as "free" | "pro",
    name: p.name,
    monthlyCredits: p.monthlyCredits,
    price: p.priceCents / 100,
    description: p.description,
    selectable: p.selectable,
  }));

  return <PricingClient initialPlans={serializedPlans} />;
}
