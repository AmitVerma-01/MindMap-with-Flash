"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/actions/types";
import { ensureUser } from "@/lib/user";
import type { Flashcard } from "@/types/flashcard";
import type { SerializedFlashcardSet } from "@/lib/data/dashboard";

function serializeSet(
  set: Awaited<ReturnType<typeof prisma.flashcardSet.create>> & {
    flashcards: Array<{
      id: string;
      front: string;
      back: string;
      hint: string | null;
      mnemonic: string | null;
      category: string | null;
      difficulty: string | null;
    }>;
  }
): SerializedFlashcardSet {
  return {
    id: set.id,
    title: set.title,
    topic: set.topic,
    createdAt: set.createdAt.toISOString(),
    flashcards: set.flashcards.map((card) => ({
      id: card.id,
      front: card.front,
      back: card.back,
      hint: card.hint,
      mnemonic: card.mnemonic,
      category: card.category,
      difficulty: card.difficulty,
    })),
  };
}

export async function saveFlashcardSet(input: {
  title: string;
  topic: string;
  flashcards: Flashcard[];
}): Promise<ActionResult<SerializedFlashcardSet>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return actionError("Unauthorized");

  const { title, topic, flashcards } = input;
  if (!title?.trim() || !topic?.trim() || !flashcards?.length) {
    return actionError("Missing required fields");
  }

  try {
    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress || `${clerkId}@temp.com`;
    const user = await ensureUser(clerkId, email);

    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        title: title.trim(),
        topic: topic.trim(),
        userId: user.id,
        flashcards: {
          create: flashcards.map((card) => ({
            front: card.front,
            back: card.back,
            hint: card.hint ?? null,
            mnemonic: card.mnemonic ?? null,
            category: card.category ?? null,
            difficulty: card.difficulty ?? null,
          })),
        },
      },
      include: { flashcards: true },
    });

    revalidatePath("/dashboard");
    return actionSuccess(serializeSet(flashcardSet));
  } catch (error) {
    console.error("saveFlashcardSet:", error);
    return actionError("Failed to save flashcard set");
  }
}

export async function deleteFlashcardSet(
  setId: string
): Promise<ActionResult> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return actionError("Unauthorized");

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return actionError("User not found");

    const flashcardSet = await prisma.flashcardSet.findFirst({
      where: { id: setId, userId: user.id },
    });
    if (!flashcardSet) return actionError("Flashcard set not found");

    await prisma.flashcardSet.delete({ where: { id: setId } });
    revalidatePath("/dashboard");
    return actionSuccess(undefined);
  } catch (error) {
    console.error("deleteFlashcardSet:", error);
    return actionError("Failed to delete flashcard set");
  }
}

export async function duplicateFlashcardSet(
  setId: string
): Promise<ActionResult<SerializedFlashcardSet>> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return actionError("Unauthorized");

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return actionError("User not found");

    const original = await prisma.flashcardSet.findFirst({
      where: { id: setId, userId: user.id },
      include: { flashcards: true },
    });
    if (!original) return actionError("Flashcard set not found");

    const duplicate = await prisma.flashcardSet.create({
      data: {
        title: `${original.title} (Copy)`,
        topic: original.topic,
        userId: user.id,
        flashcards: {
          create: original.flashcards.map((card) => ({
            front: card.front,
            back: card.back,
            hint: card.hint,
            mnemonic: card.mnemonic,
            category: card.category,
            difficulty: card.difficulty,
          })),
        },
      },
      include: { flashcards: true },
    });

    revalidatePath("/dashboard");
    return actionSuccess(serializeSet(duplicate));
  } catch (error) {
    console.error("duplicateFlashcardSet:", error);
    return actionError("Failed to duplicate set");
  }
}
