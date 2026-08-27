'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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

function parsePlanParam(value: string | null): PlanSlug | null {
  if (value === "free" || value === "pro") return value;
  return null;
}

export default function PricingClient({ initialPlans }: PricingClientProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const autoActivatedRef = useRef(false);
  const plans = initialPlans;

  const planFromUrl = useMemo(
    () => parsePlanParam(searchParams.get("plan")),
    [searchParams]
  );

  const handleSelectPlan = async (plan: PlanSlug) => {
    const planDef = plans.find((p) => p.slug === plan);
    if (planDef && !planDef.selectable) {
      toast.warning("Pro plan is coming soon! Stay tuned.");
      return;
    }

    if (!user) {
      toast.info("Create a free account to activate your plan, then you'll return here.");
      const returnUrl = encodeURIComponent(`/pricing?plan=${plan}`);
      router.push(`/sign-up?redirect_url=${returnUrl}`);
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

  useEffect(() => {
    if (!isLoaded || !user || !planFromUrl || autoActivatedRef.current) return;

    const planDef = plans.find((p) => p.slug === planFromUrl);
    if (!planDef?.selectable) return;

    autoActivatedRef.current = true;

    void (async () => {
      setLoading(planFromUrl);
      try {
        const result = await selectPlan(planFromUrl);
        if (result.success) {
          toast.success(result.data.message || "Plan activated successfully!");
          router.push("/pages/flashcards");
        } else {
          toast.error(result.error);
          autoActivatedRef.current = false;
        }
      } catch (error) {
        console.error("Error selecting plan:", error);
        toast.error("Failed to select plan. Please try again.");
        autoActivatedRef.current = false;
      } finally {
        setLoading(null);
      }
    })();
  }, [isLoaded, user, planFromUrl, plans, router, toast]);

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

        {!user && isLoaded && (
          <Card className="max-w-2xl mx-auto mb-8 p-4 text-center">
            <p className="text-foreground font-medium text-sm md:text-base">
              Select a plan below, then create your free account to get started.
              You&apos;ll return here to activate your plan automatically.
            </p>
          </Card>
        )}

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
                  !plan.selectable ? "border-2 border-primary/30 relative" : ""
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
              <h3 className="text-base font-bold text-foreground mb-1.5">Do I need a credit card to start?</h3>
              <p className="text-muted text-sm">
                No. The Starter plan is completely free. Select it, create an account, and start generating flashcards right away.
              </p>
            </Card>
            <Card>
              <h3 className="text-base font-bold text-foreground mb-1.5">When will Professional be available?</h3>
              <p className="text-muted text-sm">
                Professional is coming soon with more credits and advanced features. The free Starter plan includes everything you need to try the platform today.
              </p>
            </Card>
            <Card>
              <h3 className="text-base font-bold text-foreground mb-1.5">What happens after I sign up?</h3>
              <p className="text-muted text-sm">
                After creating your account, you&apos;ll activate your chosen plan and be taken to the flashcard generator to create your first set.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
