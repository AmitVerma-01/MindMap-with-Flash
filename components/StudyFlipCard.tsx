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
import {
  GRADE_LABELS,
  type ReviewGrade,
} from "@/types/study";
import type { FlashcardDifficulty } from "@/types/flashcard";

const difficultyTone: Record<FlashcardDifficulty, string> = {
  beginner: "study-card-tag--beginner",
  intermediate: "study-card-tag--intermediate",
  advanced: "study-card-tag--advanced",
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
const GRADES: ReviewGrade[] = ["again", "hard", "good", "easy"];

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

    if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
      handleFlip();
    }
  };

  const difficulty = card.difficulty as FlashcardDifficulty | undefined;
  const difficultyClass =
    difficulty && difficultyTone[difficulty]
      ? difficultyTone[difficulty]
      : "study-card-tag--neutral";

  return (
    <div className={cn("study-card-root", className)}>
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
          "study-card-scene focus-ring",
          heightClass,
          reducedMotion && "study-card-scene--reduced",
          isFlipped && reducedMotion && "study-card-scene--flipped"
        )}
      >
        <div
          key={cardKey}
          className={cn(
            "study-card-inner",
            heightClass,
            !reducedMotion && isFlipped && "study-card-inner--flipped"
          )}
        >
          <article className="study-card-face study-card-face--front">
            <div className="study-card-face__glow study-card-face__glow--front" aria-hidden />
            <header className="study-card-face__header">
              <span className="study-card-side-label study-card-side-label--front">
                Question
              </span>
              <div className="study-card-meta">
                {card.category && (
                  <span className="study-card-tag study-card-tag--neutral">
                    {card.category}
                  </span>
                )}
                {difficulty && (
                  <span className={cn("study-card-tag", difficultyClass)}>
                    {difficulty}
                  </span>
                )}
              </div>
            </header>

            <div className="study-card-body">
              <p className="study-card-text study-card-text--question">{card.front}</p>
            </div>

            {showHints && card.hint && (
              <aside className="study-card-hint">
                <span className="study-card-hint__label">Hint</span>
                <span className="study-card-hint__text">{card.hint}</span>
              </aside>
            )}

            <footer className="study-card-face__footer">
              <span className="study-card-reveal-prompt">
                Tap, swipe, or press Space to reveal
              </span>
            </footer>
          </article>

          <article className="study-card-face study-card-face--back">
            <div className="study-card-face__glow study-card-face__glow--back" aria-hidden />
            <header className="study-card-face__header">
              <span className="study-card-side-label study-card-side-label--back">
                Answer
              </span>
            </header>

            <div className="study-card-body">
              <p className="study-card-text study-card-text--answer">{card.back}</p>
            </div>

            {card.mnemonic && (
              <aside className="study-card-mnemonic">
                <span className="study-card-mnemonic__icon" aria-hidden>
                  ✦
                </span>
                <span className="study-card-mnemonic__text">{card.mnemonic}</span>
              </aside>
            )}

            <footer className="study-card-face__footer">
              <span className="study-card-reveal-prompt">
                {showGradeButtons
                  ? "Rate yourself below or press 1–4"
                  : "Tap or press Space to flip back"}
              </span>
            </footer>
          </article>
        </div>
      </div>

      {footerHint}

      {showGradeButtons && isFlipped && onGrade && (
        <div className="study-card-grades" role="group" aria-label="Rate recall">
          {GRADES.map((grade, i) => (
            <button
              key={grade}
              type="button"
              onClick={() => onGrade(grade)}
              className={cn("study-card-grade", `study-card-grade--${grade}`)}
            >
              <span className="study-card-grade__label">{GRADE_LABELS[grade]}</span>
              <span className="study-card-grade__key">{i + 1}</span>
            </button>
          ))}
        </div>
      )}

      {showKeyboardHints && (
        <div className="study-card-shortcuts" aria-hidden>
          <span>Space — flip</span>
          {showGradeButtons && <span>1–4 — rate</span>}
          {onPrevious && <span>← — previous</span>}
        </div>
      )}
    </div>
  );
}
