"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import PageBackground from "@/components/layout/PageBackground";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PageLoading } from "@/components/LoadingLottie";
import { MINDMAP_CREDIT_COST } from "@/types/mindmap";
import { ApiError, postJson } from "@/lib/api/fetch-json";

type Tab = "topic" | "deck";

interface FlashcardSetOption {
  id: string;
  title: string;
  topic: string;
}

interface MindMapClientProps {
  initialSets: FlashcardSetOption[];
}

export default function MindMapClient({ initialSets }: MindMapClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("topic");
  const [topic, setTopic] = useState("");
  const [extra, setExtra] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState("");

  const handleGenerateFromTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.warning("Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      const data = await postJson<{ mindMapSet: { id: string } }>("/api/mindmap", {
        topic: topic.trim(),
        extra: extra.trim() || undefined,
        title: title.trim() || undefined,
      });
      toast.success("Mind map generated!");
      router.push(`/pages/mindmap/${data.mindMapSet.id}`);
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to generate mind map"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSetId) {
      toast.warning("Please select a flashcard set");
      return;
    }

    setLoading(true);
    try {
      const data = await postJson<{ mindMapSet: { id: string } }>(
        "/api/mindmap/from-set",
        {
          flashcardSetId: selectedSetId,
          title: title.trim() || undefined,
        }
      );
      toast.success("Mind map generated from deck!");
      router.push(`/pages/mindmap/${data.mindMapSet.id}`);
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to generate mind map"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      <div className="relative z-10 max-w-3xl mx-auto p-4 md:p-6">
        <PageHeader
          badge="VISUAL LEARNING"
          title="Mind Map Generator"
          subtitle="Organize concepts visually — generate from a topic or existing deck"
          align="left"
        />

        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "topic" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setTab("topic")}
          >
            From Topic
          </Button>
          <Button
            variant={tab === "deck" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setTab("deck")}
          >
            From Deck
          </Button>
        </div>

        <Card className="mb-6">
          <p className="text-sm text-muted mb-4">
            Costs {MINDMAP_CREDIT_COST} credits per mind map generation.
          </p>

          {tab === "topic" ? (
            <form onSubmit={handleGenerateFromTopic} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Topic
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis, JavaScript Promises..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Title (optional)
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Custom title for saved mind map"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Extra context (optional)
                </label>
                <textarea
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  placeholder="Focus areas, exam scope, etc."
                  className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground text-sm focus-ring min-h-[80px]"
                />
              </div>
              <Button type="submit" disabled={loading} fullWidth>
                {loading ? "Generating..." : "Generate Mind Map"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleGenerateFromDeck} className="space-y-4">
              {initialSets.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted text-sm mb-4">
                    No flashcard sets found. Create one first.
                  </p>
                  <Link href="/pages/flashcards">
                    <Button variant="secondary">Create Flashcards</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Select flashcard set
                    </label>
                    <select
                      value={selectedSetId}
                      onChange={(e) => setSelectedSetId(e.target.value)}
                      className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-foreground text-sm focus-ring"
                      required
                    >
                      <option value="">Choose a set...</option>
                      {initialSets.map((set) => (
                        <option key={set.id} value={set.id}>
                          {set.title} — {set.topic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Title (optional)
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Custom title for saved mind map"
                    />
                  </div>
                  <Button type="submit" disabled={loading} fullWidth>
                    {loading ? "Generating..." : "Generate from Deck"}
                  </Button>
                </>
              )}
            </form>
          )}
        </Card>

        <div className="text-center">
          <Link href="/dashboard" className="text-sm text-muted hover:text-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
      <toast.ToastContainer />
      {loading && (
        <PageLoading
          overlay
          variant="generating"
          message="Generating your mind map..."
        />
      )}
    </div>
  );
}
