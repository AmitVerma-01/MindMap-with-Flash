'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageBackground from "@/components/layout/PageBackground";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import PriceCard from "@/components/PriceCard";
import { useToast } from "@/hooks/useToast";
import { selectPlan } from "@/app/actions/plan";
import type { PlanSlug } from "@/lib/plans";

interface PlanFromApi {
  slug: PlanSlug;
  name: string;
  monthlyCredits: number;
  price: number;
  description: string | null;
  selectable: boolean;
}

interface PricingClientProps {
  initialPlans: PlanFromApi[];
}

export default function PricingClient({ initialPlans }: PricingClientProps) {
  const { user } = useUser();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const plans = initialPlans;

  const handleSelectPlan = async (plan: PlanSlug) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const planDef = plans.find((p) => p.slug === plan);
    if (planDef && !planDef.selectable) {
      toast.warning("Pro plan is coming soon! Stay tuned.");
      return;
    }

    setLoading(plan);
    try {
      const result = await selectPlan(plan);

      if (result.success) {
        toast.success(result.data.message || "Plan selected successfully!");
        router.push("/pages/flashcards");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast.error("Failed to select plan. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      <toast.ToastContainer />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <PageHeader
          badge="PRICING PLANS"
          title="Choose Your Learning Path"
          subtitle="Start free and upgrade anytime. All plans include AI-powered flashcard generation."
        />

        {plans.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-12 mb-16">
            <p className="text-muted">No plans available.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.slug}
                hover={plan.selectable}
                className={`flex flex-col ${
                  !plan.selectable ? "border-2 border-primary/30 opacity-60 relative" : ""
                }`}
              >
                {!plan.selectable && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-muted/80 px-4 py-1.5 rounded-full text-xs font-bold text-foreground">
                      COMING SOON
                    </span>
                  </div>
                )}
                <PriceCard
                  name={plan.name}
                  description={plan.description ?? ""}
                  price={plan.price}
                  monthlyCredits={plan.monthlyCredits}
                  popular={plan.slug === "pro"}
                  selectable={plan.selectable}
                  disabled={!plan.selectable}
                  onSelect={() => handleSelectPlan(plan.slug)}
                  loading={loading === plan.slug}
                />
              </Card>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <Card>
              <h3 className="text-base font-bold text-foreground mb-1.5">Can I cancel anytime?</h3>
              <p className="text-muted text-sm">
                Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </Card>
            <Card>
              <h3 className="text-base font-bold text-foreground mb-1.5">What payment methods do you accept?</h3>
              <p className="text-muted text-sm">
                We accept all major credit cards, PayPal, and other popular payment methods through our secure payment processor.
              </p>
            </Card>
            <Card>
              <h3 className="text-base font-bold text-foreground mb-1.5">Is there a free trial for Pro?</h3>
              <p className="text-muted text-sm">
                The free plan lets you try our core features. Upgrade to Pro anytime to unlock unlimited access and advanced features.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
