import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing - Choose Your Plan",
  description: "Start free with 50 credits per month. Upgrade to Pro for more AI-powered flashcard generation.",
};

export default function PricingPage() {
  return <PricingClient />;
}
