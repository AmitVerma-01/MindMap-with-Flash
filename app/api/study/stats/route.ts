import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllSetStudyStats, getUserByClerkId } from "@/lib/srs/queue";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ stats: [], totalDue: 0, totalNew: 0 }, { status: 200 });
    }

    const stats = await getAllSetStudyStats(user.id);
    const totalDue = stats.reduce((sum, s) => sum + s.due, 0);
    const totalNew = stats.reduce((sum, s) => sum + s.new, 0);

    return NextResponse.json({ stats, totalDue, totalNew }, { status: 200 });
  } catch (error) {
    console.error("Error fetching study stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch study stats" },
      { status: 500 }
    );
  }
}
