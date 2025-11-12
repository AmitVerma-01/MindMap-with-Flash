import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans - Affordable AI Flashcard Learning",
  description: "Choose the perfect plan for your learning needs. Start free with 50 flashcards per week or upgrade to Pro for unlimited AI-powered flashcards at just $5/month.",
  openGraph: {
    title: "Pricing Plans - Affordable AI Flashcard Learning",
    description: "Start free or upgrade to Pro for unlimited AI-powered flashcards. Simple, transparent pricing.",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
