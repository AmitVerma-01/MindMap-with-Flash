import { prisma } from "@/lib/prisma";
import { isMastered } from "@/lib/srs/sm2";
import type { SetStudyStats, StudyCard } from "@/types/study";

const NEW_CARDS_PER_SESSION = 10;

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } });
}

export async function getDueCards(
  userId: string,
  setId?: string
): Promise<StudyCard[]> {
  const now = new Date();

  const dueCards = await prisma.flashcard.findMany({
    where: {
      flashcardSet: {
        userId,
        ...(setId ? { id: setId } : {}),
      },
      reviewStates: {
        some: {
          userId,
          nextReviewAt: { lte: now },
        },
      },
    },
    include: {
      reviewStates: {
        where: { userId },
        take: 1,
      },
    },
  });

  const filtered = dueCards.sort((a, b) => {
    const aTime = a.reviewStates[0]?.nextReviewAt.getTime() ?? 0;
    const bTime = b.reviewStates[0]?.nextReviewAt.getTime() ?? 0;
    return aTime - bTime;
  });

  return filtered.map((card) => mapToStudyCard(card, "due"));
}

export async function getNewCards(
  userId: string,
  setId: string,
  limit: number = NEW_CARDS_PER_SESSION
): Promise<StudyCard[]> {
  const cards = await prisma.flashcard.findMany({
    where: {
      flashcardSetId: setId,
      flashcardSet: { userId },
      reviewStates: { none: { userId } },
    },
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  return cards.map((card) => mapToStudyCard({ ...card, reviewStates: [] }, "new"));
}

export async function getStudyQueue(
  userId: string,
  setId: string
): Promise<StudyCard[]> {
  const due = await getDueCards(userId, setId);
  const newCards = await getNewCards(
    userId,
    setId,
    Math.max(0, NEW_CARDS_PER_SESSION)
  );
  return [...due, ...newCards];
}

export async function getSetStudyStats(
  userId: string,
  setId: string
): Promise<SetStudyStats> {
  const now = new Date();

  const flashcards = await prisma.flashcard.findMany({
    where: {
      flashcardSetId: setId,
      flashcardSet: { userId },
    },
    include: {
      reviewStates: {
        where: { userId },
        take: 1,
      },
    },
  });

  let due = 0;
  let newCount = 0;
  let mastered = 0;

  for (const card of flashcards) {
    const state = card.reviewStates[0];
    if (!state) {
      newCount += 1;
    } else if (state.nextReviewAt <= now) {
      due += 1;
    } else if (isMastered(state.intervalDays, state.repetitions)) {
      mastered += 1;
    }
  }

  return {
    setId,
    due,
    new: newCount,
    mastered,
    total: flashcards.length,
  };
}

export async function getAllSetStudyStats(
  userId: string
): Promise<SetStudyStats[]> {
  const sets = await prisma.flashcardSet.findMany({
    where: { userId },
    select: { id: true },
  });

  return Promise.all(sets.map((set) => getSetStudyStats(userId, set.id)));
}

function mapToStudyCard(
  card: {
    id: string;
    front: string;
    back: string;
    hint: string | null;
    mnemonic: string | null;
    category: string | null;
    difficulty: string | null;
    flashcardSetId: string;
    reviewStates: Array<{
      id: string;
      userId: string;
      flashcardId: string;
      easeFactor: number;
      intervalDays: number;
      repetitions: number;
      nextReviewAt: Date;
      lastReviewedAt: Date | null;
    }>;
  },
  status: "due" | "new"
): StudyCard {
  const state = card.reviewStates[0];
  return {
    id: card.id,
    front: card.front,
    back: card.back,
    hint: card.hint,
    mnemonic: card.mnemonic,
    category: card.category,
    difficulty: card.difficulty,
    flashcardSetId: card.flashcardSetId,
    status,
    reviewState: state
      ? {
          id: state.id,
          userId: state.userId,
          flashcardId: state.flashcardId,
          easeFactor: state.easeFactor,
          intervalDays: state.intervalDays,
          repetitions: state.repetitions,
          nextReviewAt: state.nextReviewAt.toISOString(),
          lastReviewedAt: state.lastReviewedAt?.toISOString() ?? null,
        }
      : null,
  };
}

export { NEW_CARDS_PER_SESSION };
