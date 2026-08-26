"use client";

import type { KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { Flashcard as FlashcardType } from "@/types/flashcard";
import Badge from "@/components/ui/Badge";

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

const difficultyVariant = {
  beginner: "success" as const,
  intermediate: "warning" as const,
  advanced: "primary" as const,
};

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
  const { front, back, hint, difficulty, category, mnemonic } = card;

  const handleClick = () => {
    setFlippedIndex(isFlipped ? null : index);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -top-2 -right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
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

      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={isFlipped ? `Answer: ${back}` : `Question: ${front}`}
        aria-pressed={isFlipped}
        className="w-full h-80 perspective-1000 cursor-pointer focus-ring rounded-2xl"
      >
        <div
          className={cn(
            "relative w-full h-80 preserve-3d transition-transform duration-500",
            isFlipped && "rotate-y-180"
          )}
        >
          {/* Question side */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden glass-card glass-card-hover p-5 md:p-6 rounded-2xl overflow-hidden flex flex-col",
              !isFlipped && "glow"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent-teal/10 to-background/30 opacity-80" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <CardLabel label="QUESTION" />
                {category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-muted">
                    {category}
                  </span>
                )}
                {difficulty && (
                  <Badge variant={difficultyVariant[difficulty]} className="text-[10px]">
                    {difficulty}
                  </Badge>
                )}
              </div>
              <p className="text-foreground text-center font-semibold text-base leading-relaxed px-1 flex-1 flex items-center justify-center">
                {front}
              </p>
              {showHints && hint && !isFlipped && (
                <p className="text-primary/80 text-xs text-center mt-2 italic">
                  Hint: {hint}
                </p>
              )}
              <p className="text-muted text-xs text-center mt-3">
                Click or press Enter to reveal
              </p>
            </div>
          </div>

          {/* Answer side */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rotate-y-180 glass-card glass-card-hover p-5 md:p-6 rounded-2xl overflow-hidden flex flex-col",
              isFlipped && "glow-cyan"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/20 via-accent-cyan/10 to-background/30 opacity-80" />
            <div className="relative z-10 flex flex-col h-full">
              <CardLabel label="ANSWER" />
              <p className="text-foreground text-center font-medium leading-relaxed overflow-y-auto flex-1 flex items-center justify-center px-1 mt-3">
                {back}
              </p>
              {mnemonic && (
                <p className="text-info text-xs text-center mt-2 bg-info/10 rounded-lg px-2 py-1">
                  💡 {mnemonic}
                </p>
              )}
              <p className="text-muted text-xs text-center mt-3">
                Click or press Enter to flip back
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardLabel({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full bg-surface border border-border text-[10px] font-bold text-foreground/90 tracking-wider">
      {label}
    </span>
  );
}
