"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  GRADE_LABELS,
  type ReviewGrade,
} from "@/types/study";
import type { FlashcardDifficulty } from "@/types/flashcard";

const difficultyVariant = {
  beginner: "success" as const,
  intermediate: "warning" as const,
  advanced: "primary" as const,
};

export interface StudyFlipCardContent {
  front: string;
  back: string;
  hint?: string | null;
  mnemonic?: string | null;
  category?: string | null;
  difficulty?: FlashcardDifficulty | string | null;
}

interface StudyFlipCardProps {
  card: StudyFlipCardContent;
  isFlipped: boolean;
  onFlip: (flipped: boolean) => void;
  showHints?: boolean;
  showGradeButtons?: boolean;
  onGrade?: (grade: ReviewGrade) => void;
  onPrevious?: () => void;
  showKeyboardHints?: boolean;
  className?: string;
  heightClass?: string;
  footerHint?: ReactNode;
  cardKey?: string | number;
}

const SWIPE_THRESHOLD = 50;

export default function StudyFlipCard({
  card,
  isFlipped,
  onFlip,
  showHints = true,
  showGradeButtons = false,
  onGrade,
  onPrevious,
  showKeyboardHints = true,
  className,
  heightClass = "h-80",
  footerHint,
  cardKey,
}: StudyFlipCardProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleFlip = useCallback(() => {
    onFlip(!isFlipped);
  }, [isFlipped, onFlip]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isFlipped) {
        handleFlip();
      } else if (!showGradeButtons) {
        handleFlip();
      }
    }

    if (isFlipped && showGradeButtons && onGrade) {
      const gradeMap: Record<string, ReviewGrade> = {
        "1": "again",
        "2": "hard",
        "3": "good",
        "4": "easy",
      };
      if (gradeMap[e.key]) {
        e.preventDefault();
        onGrade(gradeMap[e.key]);
      }
    }

    if (e.key === "ArrowLeft" && onPrevious) {
      e.preventDefault();
      onPrevious();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (
      Math.abs(dx) > SWIPE_THRESHOLD ||
      Math.abs(dy) > SWIPE_THRESHOLD
    ) {
      handleFlip();
    }
  };

  const difficulty = card.difficulty as FlashcardDifficulty | undefined;

  return (
    <div className={cn("w-full", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={isFlipped ? `Answer: ${card.back}` : `Question: ${card.front}`}
        aria-pressed={isFlipped}
        className={cn(
          "w-full perspective-1000 cursor-pointer focus-ring rounded-2xl flip-pressable",
          heightClass,
          reducedMotion && "flip-reduced-motion",
          isFlipped && reducedMotion && "is-flipped"
        )}
      >
        <div
          key={cardKey}
          className={cn(
            "relative w-full preserve-3d flip-inner transition-transform duration-500 animate-fade-in",
            heightClass,
            !reducedMotion && isFlipped && "rotate-y-180"
          )}
        >
          {/* Question side */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden flip-front glass-card glass-card-hover p-5 md:p-6 rounded-2xl overflow-hidden flex flex-col",
              !isFlipped && !reducedMotion && "glow"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent-teal/10 to-background/30 opacity-80" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <CardLabel label="QUESTION" />
                {card.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-muted">
                    {card.category}
                  </span>
                )}
                {difficulty && difficultyVariant[difficulty] && (
                  <Badge variant={difficultyVariant[difficulty]} className="text-[10px]">
                    {difficulty}
                  </Badge>
                )}
              </div>
              <p className="text-foreground text-center font-semibold text-base md:text-xl leading-relaxed px-1 flex-1 flex items-center justify-center">
                {card.front}
              </p>
              {showHints && card.hint && (
                <p className="text-primary/80 text-xs text-center mt-2 italic">
                  Hint: {card.hint}
                </p>
              )}
              <p className="text-muted text-xs text-center mt-3">
                Click, swipe, or press Space to reveal
              </p>
            </div>
          </div>

          {/* Answer side */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden flip-back rotate-y-180 glass-card glass-card-hover p-5 md:p-6 rounded-2xl overflow-hidden flex flex-col",
              isFlipped && !reducedMotion && "glow-cyan"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/20 via-accent-cyan/10 to-background/30 opacity-80" />
            <div className="relative z-10 flex flex-col h-full">
              <CardLabel label="ANSWER" />
              <p className="text-foreground text-center font-medium text-base md:text-lg leading-relaxed overflow-y-auto flex-1 flex items-center justify-center px-1 mt-3">
                {card.back}
              </p>
              {card.mnemonic && (
                <p className="text-info text-xs text-center mt-2 bg-info/10 rounded-lg px-2 py-1">
                  💡 {card.mnemonic}
                </p>
              )}
              <p className="text-muted text-xs text-center mt-3">
                {showGradeButtons
                  ? "Rate yourself below or press 1–4"
                  : "Click or press Space to flip back"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {footerHint}

      {showGradeButtons && isFlipped && onGrade && (
        <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
          {(["again", "hard", "good", "easy"] as ReviewGrade[]).map((grade, i) => (
            <Button
              key={grade}
              variant={grade === "again" ? "danger" : grade === "easy" ? "primary" : "secondary"}
              size="sm"
              onClick={() => onGrade(grade)}
              className="flex-1 sm:flex-none"
            >
              {GRADE_LABELS[grade]} ({i + 1})
            </Button>
          ))}
        </div>
      )}

      {showKeyboardHints && (
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-[10px] text-muted">
          <span>Space — flip</span>
          {showGradeButtons && <span>1–4 — rate</span>}
          {onPrevious && <span>← — previous</span>}
        </div>
      )}
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
