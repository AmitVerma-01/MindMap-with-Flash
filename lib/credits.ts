import { prisma } from "@/lib/prisma";

// Plan configurations
export const PLAN_LIMITS = {
  free: {
    name: "Free",
    monthlyCredits: 50,
    price: 0,
  },
  pro: {
    name: "Pro",
    monthlyCredits: 300,
    price: 5,
  },
} as const;

// Get the start of the current month
export function getMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}

// Check if user needs to select a plan
export async function needsPlanSelection(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // If user doesn't exist or has no plan selected
  return !user || user.plan === null;
}

// Initialize user with selected plan
export async function initializeUserPlan(
  userId: string,
  email: string,
  plan: "free" | "pro"
): Promise<void> {
  const monthStart = getMonthStart();
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);

  const credits = PLAN_LIMITS[plan].monthlyCredits;

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      plan,
      currentPeriodStart: monthStart,
      currentPeriodEnd: monthEnd,
      monthlyCredits: credits,
      creditsUsed: 0,
    },
    create: {
      clerkId: userId,
      email,
      plan,
      currentPeriodStart: monthStart,
      currentPeriodEnd: monthEnd,
      monthlyCredits: credits,
      creditsUsed: 0,
    },
  });
}

// Check if user has enough credits
export async function checkCredits(
  userId: string,
  cardsToGenerate: number
): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  plan: string;
  needsPlanSelection: boolean;
  message?: string;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // User doesn't exist or hasn't selected a plan
    if (!user || user.plan === null) {
      return {
        allowed: false,
        remaining: 0,
        limit: 0,
        plan: "none",
        needsPlanSelection: true,
        message: "Please select a plan to start generating flashcards",
      };
    }

    const now = new Date();
    const monthStart = getMonthStart();

    // Check if we need to reset credits for new month
    if (
      !user.currentPeriodStart ||
      user.currentPeriodStart < monthStart
    ) {
      // Reset credits for new month
      const credits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS].monthlyCredits;
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          currentPeriodStart: monthStart,
          currentPeriodEnd: monthEnd,
          monthlyCredits: credits,
          creditsUsed: 0,
        },
      });

      // Return with reset credits
      return {
        allowed: cardsToGenerate <= credits,
        remaining: credits - cardsToGenerate,
        limit: credits,
        plan: user.plan,
        needsPlanSelection: false,
      };
    }

    // Check if user has enough credits
    const remaining = user.monthlyCredits - user.creditsUsed;

    if (remaining < cardsToGenerate) {
      return {
        allowed: false,
        remaining: Math.max(0, remaining),
        limit: user.monthlyCredits,
        plan: user.plan,
        needsPlanSelection: false,
        message: `You've used ${user.creditsUsed} of ${user.monthlyCredits} credits this month. ${
          user.plan === "free"
            ? "Upgrade to Pro for 300 credits/month!"
            : "You'll get more credits next month."
        }`,
      };
    }

    return {
      allowed: true,
      remaining: remaining - cardsToGenerate,
      limit: user.monthlyCredits,
      plan: user.plan,
      needsPlanSelection: false,
    };
  } catch (error) {
    console.error("Error checking credits:", error);
    return {
      allowed: false,
      remaining: 0,
      limit: 0,
      plan: "error",
      needsPlanSelection: false,
      message: "Error checking credits. Please try again.",
    };
  }
}

// Deduct credits after successful generation
export async function deductCredits(
  userId: string,
  cardsGenerated: number
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        creditsUsed: {
          increment: cardsGenerated,
        },
      },
    });
  } catch (error) {
    console.error("Error deducting credits:", error);
    throw error;
  }
}

// Get user credit stats
export async function getUserCredits(userId: string): Promise<{
  creditsUsed: number;
  monthlyCredits: number;
  remaining: number;
  plan: string | null;
  needsPlanSelection: boolean;
  currentPeriodEnd: Date | null;
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.plan === null) {
      return {
        creditsUsed: 0,
        monthlyCredits: 0,
        remaining: 0,
        plan: null,
        needsPlanSelection: true,
        currentPeriodEnd: null,
      };
    }

    // Check if we need to reset for new month
    const monthStart = getMonthStart();
    if (
      !user.currentPeriodStart ||
      user.currentPeriodStart < monthStart
    ) {
      const credits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS].monthlyCredits;
      return {
        creditsUsed: 0,
        monthlyCredits: credits,
        remaining: credits,
        plan: user.plan,
        needsPlanSelection: false,
        currentPeriodEnd: user.currentPeriodEnd,
      };
    }

    return {
      creditsUsed: user.creditsUsed,
      monthlyCredits: user.monthlyCredits,
      remaining: Math.max(0, user.monthlyCredits - user.creditsUsed),
      plan: user.plan,
      needsPlanSelection: false,
      currentPeriodEnd: user.currentPeriodEnd,
    };
  } catch (error) {
    console.error("Error getting user credits:", error);
    return {
      creditsUsed: 0,
      monthlyCredits: 0,
      remaining: 0,
      plan: null,
      needsPlanSelection: true,
      currentPeriodEnd: null,
    };
  }
}
