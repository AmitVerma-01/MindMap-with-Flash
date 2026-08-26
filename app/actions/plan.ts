"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { initializeUserPlan, PLAN_LIMITS } from "@/lib/credits";
import { isPlanSelectable } from "@/lib/plans-db";
import { isPlanSlug, type PlanSlug } from "@/lib/plans";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/actions/types";

export async function selectPlan(
  plan: string
): Promise<ActionResult<{ message: string; credits: number }>> {
  const { userId } = await auth();
  if (!userId) return actionError("Unauthorized");

  if (!isPlanSlug(plan)) {
    return actionError("Invalid plan. Must be 'free' or 'pro'");
  }

  const selectable = await isPlanSelectable(plan);
  if (!selectable) {
    return actionError("This plan is not available yet");
  }

  try {
    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@temp.com`;

    await initializeUserPlan(userId, email, plan as PlanSlug);

    revalidatePath("/pages/flashcards");
    revalidatePath("/pricing");

    return actionSuccess({
      message: `Successfully activated ${PLAN_LIMITS[plan].name} plan with ${PLAN_LIMITS[plan].monthlyCredits} credits/month`,
      credits: PLAN_LIMITS[plan].monthlyCredits,
    });
  } catch (error) {
    console.error("selectPlan:", error);
    return actionError("Failed to select plan");
  }
}
