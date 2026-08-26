"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/actions/types";

export async function deleteMindMapSet(id: string): Promise<ActionResult> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return actionError("Unauthorized");

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return actionError("User not found");

    const mindMapSet = await prisma.mindMapSet.findFirst({
      where: { id, userId: user.id },
    });
    if (!mindMapSet) return actionError("Mind map not found");

    await prisma.mindMapSet.delete({ where: { id } });
    revalidatePath("/dashboard");
    return actionSuccess(undefined);
  } catch (error) {
    console.error("deleteMindMapSet:", error);
    return actionError("Failed to delete mind map");
  }
}
