import { auth } from "@clerk/nextjs/server";
import { getUserCredits } from "@/lib/credits";

export interface UsageStatsData {
  cardsThisWeek: number;
  limit: number;
  remaining: number;
  plan: string;
  isPro: boolean;
  needsPlanSelection: boolean;
}

export async function getUsageStats(): Promise<UsageStatsData | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const credits = await getUserCredits(userId);
  if (credits.needsPlanSelection || !credits.plan) {
    return {
      cardsThisWeek: 0,
      limit: 0,
      remaining: 0,
      plan: "none",
      isPro: false,
      needsPlanSelection: true,
    };
  }

  return {
    cardsThisWeek: credits.creditsUsed,
    limit: credits.monthlyCredits,
    remaining: credits.remaining,
    plan: credits.plan,
    isPro: credits.plan === "pro",
    needsPlanSelection: false,
  };
}
