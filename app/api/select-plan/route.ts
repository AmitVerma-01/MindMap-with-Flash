import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { initializeUserPlan, PLAN_LIMITS } from "@/lib/credits";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { plan } = await req.json();

    if (!plan || (plan !== "free" && plan !== "pro")) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'free' or 'pro'" },
        { status: 400 }
      );
    }

    const selectedPlan = plan as "free" | "pro";

    // Get user email from Clerk
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@temp.com`;

    // Initialize user with selected plan
    await initializeUserPlan(userId, email, selectedPlan);

    return NextResponse.json({
      success: true,
      plan: selectedPlan,
      credits: PLAN_LIMITS[selectedPlan].monthlyCredits,
      message: `Successfully activated ${PLAN_LIMITS[selectedPlan].name} plan with ${PLAN_LIMITS[selectedPlan].monthlyCredits} credits/month`,
    }, { status: 200 });
  } catch (error) {
    console.error("Error selecting plan:", error);
    return NextResponse.json(
      { error: "Failed to select plan" },
      { status: 500 }
    );
  }
}
