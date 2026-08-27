"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import PageBackground from "@/components/layout/PageBackground";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { deleteMindMapSet } from "@/app/actions/mindmap";
import { LoadingScreen, PageLoading } from "@/components/LoadingLottie";
import { ApiError, postJson } from "@/lib/api/fetch-json";
import type { MindMapSetData, MindMapTreeNode } from "@/types/mindmap";

const MindMapCanvas = dynamic(
  () => import("@/components/mindmap/MindMapCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[60vh] min-h-[400px] rounded-2xl border border-border bg-background/50 flex items-center justify-center">
        <LoadingScreen message="Loading canvas..." size={140} />
      </div>
    ),
  }
);

interface MindMapViewerClientProps {
  mindMap: MindMapSetData;
}

export default function MindMapViewerClient({
  mindMap,
}: MindMapViewerClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [selectedNode, setSelectedNode] = useState<MindMapTreeNode | null>(
    null
  );
  const [generatingCards, setGeneratingCards] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleGenerateFlashcards = async () => {
    if (!selectedNode || selectedNode.id === "root") {
      toast.warning("Select a branch node to generate flashcards");
      return;
    }

    setGeneratingCards(true);
    try {
      const data = await postJson<{
        flashcardSet: { flashcards: unknown[] };
      }>(`/api/mindmap-sets/${mindMap.id}`, {
        nodeLabel: selectedNode.label,
        cardCount: 5,
      });
      toast.success(
        `Created flashcard set with ${data.flashcardSet.flashcards.length} cards!`
      );
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to generate flashcards"
      );
    } finally {
      setGeneratingCards(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteMindMapSet(mindMap.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Mind map deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete mind map");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-muted hover:text-primary mb-2 inline-block"
            >
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-foreground">{mindMap.title}</h1>
            <p className="text-muted text-sm">{mindMap.topic}</p>
          </div>
          <div className="flex gap-2">
            {mindMap.flashcardSetId && (
              <Button asChild variant="secondary" size="sm">
                <Link href="/dashboard">Linked Deck</Link>
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            >
              Delete
            </Button>
          </div>
        </div>

        <MindMapCanvas
          mindMapId={mindMap.id}
          tree={mindMap.tree}
          onNodeSelect={setSelectedNode}
          onSaveError={(message) => toast.error(message)}
        />

        {selectedNode && (
          <Card className="mt-6">
            <h2 className="text-lg font-bold text-foreground mb-2">
              {selectedNode.label}
            </h2>
            <p className="text-muted text-sm mb-4">
              {selectedNode.id === "root"
                ? "This is the central topic. Click a branch to generate flashcards."
                : "Generate flashcards for this sub-topic (5 cards, uses credits)."}
            </p>
            {selectedNode.id !== "root" && (
              <Button
                onClick={handleGenerateFlashcards}
                disabled={generatingCards}
              >
                {generatingCards
                  ? "Generating..."
                  : "Generate Flashcards for This Topic"}
              </Button>
            )}
          </Card>
        )}

        <p className="text-xs text-muted text-center mt-4">
          Click any node to select it. Drag nodes to rearrange the view.
        </p>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete mind map?"
        description="This will permanently delete this mind map. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />

      <toast.ToastContainer />
      {generatingCards && (
        <PageLoading
          overlay
          variant="generating"
          message="Generating flashcards from mind map..."
        />
      )}
    </div>
  );
}
