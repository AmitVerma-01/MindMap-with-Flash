"use client";

import StudyFlipCard from "@/components/StudyFlipCard";
import type { Flashcard as FlashcardType } from "@/types/flashcard";

interface FlashcardProps {
  card: FlashcardType;
  index: number;
  flippedIndex: number | null;
  setFlippedIndex: (i: number | null) => void;
  showHints?: boolean;
  onDelete?: () => void;
  onRegenerate?: () => void;
  regenerating?: boolean;
}

export default function Flashcard({
  card,
  index,
  flippedIndex,
  setFlippedIndex,
  showHints = true,
  onDelete,
  onRegenerate,
  regenerating = false,
}: FlashcardProps) {
  const isFlipped = flippedIndex === index;

  return (
    <div className="relative group">
      <div className="absolute -top-2 -right-2 z-20 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {onRegenerate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate();
            }}
            disabled={regenerating}
            className="w-7 h-7 rounded-full bg-primary/90 text-white text-xs font-bold focus-ring disabled:opacity-50"
            aria-label={`Regenerate card ${index + 1}`}
            title="Regenerate card"
          >
            {regenerating ? "…" : "↻"}
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-7 h-7 rounded-full bg-danger/90 text-white text-xs font-bold focus-ring"
            aria-label={`Remove card ${index + 1}`}
          >
            ×
          </button>
        )}
      </div>

      <StudyFlipCard
        card={card}
        isFlipped={isFlipped}
        onFlip={(flipped) => setFlippedIndex(flipped ? index : null)}
        showHints={showHints}
        showKeyboardHints={false}
        cardKey={index}
      />
    </div>
  );
}
