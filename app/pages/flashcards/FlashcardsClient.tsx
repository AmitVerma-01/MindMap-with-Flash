"use client";

import Flashcard from "@/components/flashcard";
import { PageLoading } from "@/components/LoadingLottie";
import { useEffect, useState } from "react";
import type {
  Flashcard as FlashcardType,
  FlashcardDifficulty,
} from "@/types/flashcard";
import {
  CARD_COUNT_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "@/types/flashcard";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";
import PageBackground from "@/components/layout/PageBackground";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { getModelDisplayName } from "@/lib/ai/models";
import { shuffleFlashcards } from "@/lib/flashcard-utils";
import {
  downloadTextFile,
  flashcardsToCsv,
} from "@/lib/export-utils";
import { saveFlashcardSet } from "@/app/actions/flashcard-sets";
import type { UsageStatsData } from "@/lib/data/credits";
import { ApiError, postJson } from "@/lib/api/fetch-json";

interface UsageStats {
  cardsThisWeek: number;
  limit: number;
  remaining: number;
  plan: string;
  isPro: boolean;
}

interface FlashcardsClientProps {
  initialUsageStats: UsageStatsData | null;
}

export default function FlashcardsClient({
  initialUsageStats,
}: FlashcardsClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([]);
  const [topic, setTopic] = useState("");
  const [extra, setExtra] = useState("");
  const [difficulty, setDifficulty] = useState<FlashcardDifficulty>("intermediate");
  const [cardCount, setCardCount] = useState<number>(8);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [setTitle, setSetTitle] = useState("");
  const [usageStats, setUsageStats] = useState<UsageStats | null>(() => {
    if (!initialUsageStats || initialUsageStats.needsPlanSelection) return null;
    return {
      cardsThisWeek: initialUsageStats.cardsThisWeek,
      limit: initialUsageStats.limit,
      remaining: initialUsageStats.remaining,
      plan: initialUsageStats.plan,
      isPro: initialUsageStats.isPro,
    };
  });
  const [lastModel, setLastModel] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(true);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialUsageStats?.needsPlanSelection) {
      toast.warning("Please select a plan to start generating flashcards");
      const timer = setTimeout(() => router.push("/pricing"), 1500);
      return () => clearTimeout(timer);
    }
  }, [initialUsageStats?.needsPlanSelection, router, toast]);

  const handleGenerate = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.warning("Please enter a topic or question");
      return;
    }

    if (usageStats && usageStats.remaining < cardCount && !usageStats.isPro) {
      toast.warning(`You need ${cardCount} credits but only have ${usageStats.remaining} remaining`);
      return;
    }

    setLoading(true);
    setLastModel(null);

    try {
      const data = await postJson<{
        flashcard: FlashcardType[];
        model?: string;
        error?: string;
        credits?: {
          remaining: number;
          limit: number;
          plan: string;
        };
      }>("/api/flashcard", {
        topic,
        level: difficulty,
        extra: extra.trim() || undefined,
        counts: cardCount,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      setFlashcards(data.flashcard);
      setFlippedIndex(null);
      setLastModel(data.model ?? null);

      if (data.credits) {
        setUsageStats({
          cardsThisWeek: data.credits.limit - data.credits.remaining,
          limit: data.credits.limit,
          remaining: data.credits.remaining,
          plan: data.credits.plan,
          isPro: data.credits.plan === "pro",
        });
      }

      const modelNote = data.model
        ? ` (via ${getModelDisplayName(data.model)})`
        : "";
      toast.success(`Generated ${data.flashcard.length} flashcards!${modelNote}`);
    } catch (error: unknown) {
      console.error("Error generating flashcards:", error);
      if (error instanceof ApiError) {
        if (error.status === 401) {
          toast.error("Please sign in to generate flashcards");
          router.push("/sign-in");
        } else if (error.status === 402) {
          toast.error(error.message || "Please select a plan to continue");
          setTimeout(() => router.push("/pricing"), 1500);
        } else if (error.status === 403) {
          toast.error(error.message || "Insufficient credits");
          const errorData = error.data as {
            remaining?: number;
            limit?: number;
            plan?: string;
          };
          if (
            errorData?.remaining !== undefined &&
            errorData?.limit !== undefined
          ) {
            setUsageStats({
              cardsThisWeek: errorData.limit - errorData.remaining,
              limit: errorData.limit,
              remaining: errorData.remaining,
              plan: errorData.plan || "free",
              isPro: false,
            });
          }
        } else {
          toast.error(error.message || "Failed to generate flashcards. Please try again.");
        }
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to generate flashcards. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!setTitle.trim()) {
      toast.warning("Please enter a title for your flashcard set");
      return;
    }

    setSaving(true);
    try {
      const result = await saveFlashcardSet({
        title: setTitle,
        topic,
        flashcards,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setShowSaveModal(false);
      setSetTitle("");
      toast.success("Flashcards saved successfully!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error) {
      console.error("Error saving flashcards:", error);
      toast.error("Failed to save flashcards. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleShuffle = () => {
    setFlashcards((prev) => shuffleFlashcards(prev));
    setFlippedIndex(null);
    toast.info("Cards shuffled");
  };

  const handleExportCsv = () => {
    const slug = topic.trim().replace(/\s+/g, "-").toLowerCase() || "flashcards";
    downloadTextFile(flashcardsToCsv(flashcards), `${slug}.csv`, "text/csv;charset=utf-8");
    toast.success("Downloaded CSV file");
  };

  const handleRegenerateCard = async (index: number) => {
    const card = flashcards[index];
    if (!topic.trim()) {
      toast.warning("Topic is required to regenerate a card");
      return;
    }

    if (usageStats && usageStats.remaining < 1 && !usageStats.isPro) {
      toast.warning("You need 1 credit to regenerate a card");
      return;
    }

    setRegeneratingIndex(index);

    try {
      const data = await postJson<{
        flashcard?: FlashcardType[];
        error?: string;
        credits?: {
          remaining: number;
          limit: number;
          plan: string;
        };
      }>("/api/flashcard", {
        topic,
        level: difficulty,
        extra: extra.trim() || undefined,
        ques: `Create a different flashcard about "${topic}" at ${difficulty} level. Do NOT repeat or closely paraphrase this existing question: "${card.front}"`,
      });

      if (data.error) {
        throw new Error(data.error);
      }

      const newCard = data.flashcard?.[0];
      if (!newCard) {
        throw new Error("No card returned from AI");
      }

      setFlashcards((prev) =>
        prev.map((c, i) => (i === index ? newCard : c))
      );
      setFlippedIndex(null);

      if (data.credits) {
        setUsageStats({
          cardsThisWeek: data.credits.limit - data.credits.remaining,
          limit: data.credits.limit,
          remaining: data.credits.remaining,
          plan: data.credits.plan,
          isPro: data.credits.plan === "pro",
        });
      }

      toast.success("Card regenerated");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to regenerate card"
      );
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleExport = async () => {
    const payload = JSON.stringify({ topic, difficulty, flashcards }, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      toast.success("Copied deck to clipboard as JSON");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const handleDeleteCard = (index: number) => {
    setFlashcards((prev) => prev.filter((_, i) => i !== index));
    setFlippedIndex(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">
        <PageHeader
          badge="AI-POWERED LEARNING"
          title="Generate Flashcards"
          subtitle="Multi-model AI with smart fallbacks — richer cards with hints, categories, and mnemonics"
        />

        {usageStats && (
          <div className="w-full flex justify-center mb-6">
            <Card className="w-full max-w-3xl">
              {usageStats.isPro ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-bold text-sm">
                      Pro Plan Active
                    </p>
                    <p className="text-muted text-xs">
                      {usageStats.cardsThisWeek} cards generated this month
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-gradient text-xs font-bold text-white">
                    UNLIMITED
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-foreground font-bold text-sm">
                        Free Plan
                      </p>
                      <p className="text-muted text-xs">
                        {usageStats.remaining} of {usageStats.limit} credits
                        remaining this month
                      </p>
                    </div>
                    <Link href="/pricing">
                      <Button size="sm">Upgrade to Pro</Button>
                    </Link>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-primary-gradient transition-all duration-500"
                      style={{
                        width: `${(usageStats.remaining / usageStats.limit) * 100}%`,
                      }}
                    />
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        <div className="w-full flex justify-center mb-8 md:mb-12">
          <form className="w-full max-w-3xl" onSubmit={(e) => e.preventDefault()}>
            <Card padding="lg" className="space-y-4">
              <Input
                label="Topic"
                type="text"
                placeholder="e.g. React Hooks, World War II, Organic Chemistry"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
                required
              />

              <div>
                <label
                  htmlFor="extra-context"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Focus areas (optional)
                </label>
                <textarea
                  id="extra-context"
                  placeholder="e.g. Focus on useEffect and useMemo, exam-style questions..."
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  disabled={loading}
                  rows={2}
                  className="w-full p-3 rounded-xl text-sm bg-surface text-foreground placeholder:text-muted border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={loading}
                        onClick={() => setDifficulty(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus-ring ${
                          difficulty === opt.value
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface border-border text-muted hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number of cards
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CARD_COUNT_OPTIONS.map((count) => (
                      <button
                        key={count}
                        type="button"
                        disabled={loading}
                        onClick={() => setCardCount(count)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors focus-ring ${
                          cardCount === count
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface border-border text-muted hover:border-primary/40"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                onClick={(e) => handleGenerate(e)}
                disabled={loading}
                fullWidth
                size="lg"
              >
                {loading ? "Generating..." : `Generate ${cardCount} Flashcards`}
              </Button>

              <p className="text-muted text-xs text-center">
                Uses primary model with automatic fallback to Nemotron, Laguna, and GLM
              </p>
            </Card>
          </form>
        </div>

        {flashcards.length > 0 && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Card className="inline-block px-4 py-2">
                <p className="text-foreground font-semibold text-sm">
                  <span className="text-primary font-bold text-xl">
                    {flashcards.length}
                  </span>{" "}
                  cards ready
                  {lastModel && (
                    <span className="text-muted font-normal text-xs ml-2">
                      via {getModelDisplayName(lastModel)}
                    </span>
                  )}
                </p>
              </Card>

              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHints}
                  onChange={(e) => setShowHints(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                Show hints
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              {flashcards.map((card, i) => (
                <div
                  key={`${card.front}-${i}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <Flashcard
                    card={card}
                    index={i}
                    flippedIndex={flippedIndex}
                    setFlippedIndex={setFlippedIndex}
                    showHints={showHints}
                    onDelete={() => handleDeleteCard(i)}
                    onRegenerate={() => handleRegenerateCard(i)}
                    regenerating={regeneratingIndex === i}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 pb-12">
              <Button onClick={() => setShowSaveModal(true)}>
                Save Flashcards
              </Button>
              <Button variant="secondary" onClick={handleShuffle}>
                Shuffle
              </Button>
              <Button variant="secondary" onClick={handleExport}>
                Copy JSON
              </Button>
              <Button variant="secondary" onClick={handleExportCsv}>
                Export CSV
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setFlashcards([]);
                  setTopic("");
                  setExtra("");
                  setFlippedIndex(null);
                  setLastModel(null);
                }}
              >
                Clear All
              </Button>
            </div>
          </>
        )}

        {flashcards.length === 0 && !loading && (
          <div className="text-center py-12 md:py-20">
            <Card className="inline-block p-8 md:p-12 max-w-lg">
              <p className="text-5xl md:text-7xl mb-4">📚</p>
              <p className="text-foreground text-lg md:text-xl font-semibold mb-2">
                Ready to Learn?
              </p>
              <p className="text-muted text-sm">
                Pick a topic, difficulty, and card count. Our AI tries multiple
                free models automatically if one is unavailable.
              </p>
            </Card>
          </div>
        )}
      </div>

      <Modal
        open={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setSetTitle("");
        }}
        title="Save Your Flashcards"
        description="Give your set a memorable name"
        footer={
          <div className="flex gap-3 mt-4">
            <Button fullWidth onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowSaveModal(false);
                setSetTitle("");
              }}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        }
      >
        <Input
          label="Set title"
          type="text"
          placeholder="e.g. JavaScript Fundamentals"
          value={setTitle}
          onChange={(e) => setSetTitle(e.target.value)}
          autoFocus
        />
      </Modal>

      <toast.ToastContainer />
      {loading && (
        <PageLoading
          overlay
          variant="generating"
          message="Generating flashcards with AI..."
        />
      )}
    </div>
  );
}
