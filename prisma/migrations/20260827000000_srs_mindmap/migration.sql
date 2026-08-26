-- CreateTable
CREATE TABLE "CardReviewState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardReviewState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MindMapSet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tree" JSONB NOT NULL,
    "flashcardSetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MindMapSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CardReviewState_userId_nextReviewAt_idx" ON "CardReviewState"("userId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "CardReviewState_flashcardId_idx" ON "CardReviewState"("flashcardId");

-- CreateIndex
CREATE UNIQUE INDEX "CardReviewState_userId_flashcardId_key" ON "CardReviewState"("userId", "flashcardId");

-- CreateIndex
CREATE INDEX "MindMapSet_userId_idx" ON "MindMapSet"("userId");

-- AddForeignKey
ALTER TABLE "CardReviewState" ADD CONSTRAINT "CardReviewState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardReviewState" ADD CONSTRAINT "CardReviewState_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MindMapSet" ADD CONSTRAINT "MindMapSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MindMapSet" ADD CONSTRAINT "MindMapSet_flashcardSetId_fkey" FOREIGN KEY ("flashcardSetId") REFERENCES "FlashcardSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
