'use client'

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/useToast"
import PageBackground from "@/components/layout/PageBackground"
import PageHeader from "@/components/layout/PageHeader"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { ConfirmModal } from "@/components/ui/Modal"
import StudyFlipCard from "@/components/StudyFlipCard"
import { LoadingLottie } from "@/components/LoadingLottie"
import { shuffleFlashcards } from "@/lib/flashcard-utils"
import {
  downloadTextFile,
  flashcardsToCsv,
  flashcardsToAnkiCsv,
} from "@/lib/export-utils"
import {
  deleteFlashcardSet,
  duplicateFlashcardSet,
} from "@/app/actions/flashcard-sets"
import { getStudyDueCards, submitReview } from "@/app/actions/study"
import type { DashboardData, SerializedFlashcardSet } from "@/lib/data/dashboard"
import type { Flashcard as FlashcardExport } from "@/types/flashcard"
import type { ReviewGrade, SetStudyStats, StudyCard } from "@/types/study"

type FlashcardSet = SerializedFlashcardSet
type StudyMode = "srs" | "quick"

interface DashboardClientProps {
  initialData: DashboardData
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const router = useRouter()
  const toast = useToast()
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>(
    initialData.flashcardSets
  )
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)
  const [studyMode, setStudyMode] = useState<StudyMode | null>(null)
  const [srsCards, setSrsCards] = useState<StudyCard[]>([])
  const [studyQueue, setStudyQueue] = useState<number[]>([])
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [masteredCount, setMasteredCount] = useState(0)
  const [reviewAgainCount, setReviewAgainCount] = useState(0)
  const [cardsReviewed, setCardsReviewed] = useState(0)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)
  const [studyStats, setStudyStats] = useState<Record<string, SetStudyStats>>(
    initialData.studyStats
  )
  const [totalDue, setTotalDue] = useState(initialData.totalDue)
  const [totalNew, setTotalNew] = useState(initialData.totalNew)
  const [loadingStudy, setLoadingStudy] = useState(false)
  const [mindMapSets, setMindMapSets] = useState(initialData.mindMapSets)
  const [dashboardTab, setDashboardTab] = useState<"sets" | "mindmaps">("sets")

  const filteredSets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return flashcardSets
    return flashcardSets.filter(
      (set) =>
        set.title.toLowerCase().includes(q) ||
        set.topic.toLowerCase().includes(q)
    )
  }, [flashcardSets, searchQuery])

  const exitStudy = () => {
    setSelectedSet(null)
    setStudyMode(null)
    setSrsCards([])
    setStudyQueue([])
    setCurrentQueueIndex(0)
    setIsFlipped(false)
    setMasteredCount(0)
    setReviewAgainCount(0)
    setCardsReviewed(0)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const result = await deleteFlashcardSet(deleteId)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      const nextSets = flashcardSets.filter((set) => set.id !== deleteId)
      setFlashcardSets(nextSets)
      if (selectedSet?.id === deleteId) {
        exitStudy()
      }
      router.refresh()
      toast.success("Flashcard set deleted successfully")
    } catch (error) {
      console.error("Error deleting flashcard set:", error)
      toast.error("Failed to delete flashcard set")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleDuplicate = async (setId: string) => {
    setDuplicatingId(setId)
    try {
      const result = await duplicateFlashcardSet(setId)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setFlashcardSets((prev) => [result.data, ...prev])
      router.refresh()
      toast.success("Set duplicated")
    } catch (error) {
      console.error("Error duplicating set:", error)
      toast.error("Failed to duplicate set")
    } finally {
      setDuplicatingId(null)
    }
  }

  const handleExportSet = (set: FlashcardSet, format: "json" | "csv" | "anki") => {
    const slug = set.title.replace(/\s+/g, "-").toLowerCase()
    const cards: FlashcardExport[] = set.flashcards.map((c) => ({
      front: c.front,
      back: c.back,
      hint: c.hint ?? undefined,
      mnemonic: c.mnemonic ?? undefined,
      category: c.category ?? undefined,
      difficulty: (c.difficulty as FlashcardExport["difficulty"]) ?? undefined,
    }))
    if (format === "json") {
      downloadTextFile(
        JSON.stringify({ title: set.title, topic: set.topic, flashcards: cards }, null, 2),
        `${slug}.json`,
        "application/json;charset=utf-8"
      )
    } else if (format === "csv") {
      downloadTextFile(
        flashcardsToCsv(cards),
        `${slug}.csv`,
        "text/csv;charset=utf-8"
      )
    } else {
      downloadTextFile(
        flashcardsToAnkiCsv(cards),
        `${slug}-anki.csv`,
        "text/csv;charset=utf-8"
      )
    }
    toast.success(`Downloaded ${format.toUpperCase()} file`)
  }

  const startQuickStudy = (set: FlashcardSet, shuffled = false) => {
    const order = shuffled
      ? shuffleFlashcards(set.flashcards.map((_, i) => i))
      : set.flashcards.map((_, i) => i)
    setSelectedSet(set)
    setStudyMode("quick")
    setSrsCards([])
    setStudyQueue(order)
    setCurrentQueueIndex(0)
    setIsFlipped(false)
    setMasteredCount(0)
    setReviewAgainCount(0)
    setCardsReviewed(0)
  }

  const startSrsStudy = async (set: FlashcardSet) => {
    setLoadingStudy(true)
    try {
      const result = await getStudyDueCards(set.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      const cards = result.data.cards
      if (cards.length === 0) {
        toast.info("No cards due right now. Try Quick Study or come back later!")
        return
      }
      setSelectedSet(set)
      setStudyMode("srs")
      setSrsCards(cards)
      setStudyQueue(cards.map((_, i) => i))
      setCurrentQueueIndex(0)
      setIsFlipped(false)
      setMasteredCount(0)
      setReviewAgainCount(0)
      setCardsReviewed(0)
    } catch (error) {
      console.error("Error starting SRS study:", error)
      toast.error("Failed to load study queue")
    } finally {
      setLoadingStudy(false)
    }
  }

  const shuffleStudy = () => {
    if (!selectedSet) return
    setStudyQueue(shuffleFlashcards(selectedSet.flashcards.map((_, i) => i)))
    setCurrentQueueIndex(0)
    setIsFlipped(false)
    setMasteredCount(0)
    setReviewAgainCount(0)
    toast.info("Study order shuffled")
  }

  const advanceQuickStudy = (mastered: boolean) => {
    if (!selectedSet || studyQueue.length === 0) return

    const currentCardIdx = studyQueue[currentQueueIndex]

    if (mastered) {
      setMasteredCount((c) => c + 1)
      if (currentQueueIndex < studyQueue.length - 1) {
        setCurrentQueueIndex(currentQueueIndex + 1)
        setIsFlipped(false)
      } else {
        setCurrentQueueIndex(studyQueue.length)
        setIsFlipped(false)
      }
    } else {
      setReviewAgainCount((c) => c + 1)
      const newQueue = [...studyQueue]
      newQueue.splice(currentQueueIndex, 1)
      newQueue.push(currentCardIdx)
      setStudyQueue(newQueue)
      setIsFlipped(false)
      if (currentQueueIndex >= newQueue.length - 1) {
        setCurrentQueueIndex(newQueue.length - 1)
      }
    }
  }

  const handleSrsGrade = async (grade: ReviewGrade) => {
    if (!selectedSet || srsCards.length === 0) return

    const cardIndex = studyQueue[currentQueueIndex]
    const card = srsCards[cardIndex]
    if (!card) return

    try {
      const result = await submitReview({
        flashcardId: card.id,
        grade,
      })
      if (!result.success) {
        toast.error(result.error)
        return
      }
    } catch (error) {
      console.error("Error recording review:", error)
      toast.error("Failed to save review")
      return
    }

    setCardsReviewed((c) => c + 1)
    if (grade === "again") {
      setReviewAgainCount((c) => c + 1)
    } else {
      setMasteredCount((c) => c + 1)
    }

    const newQueue = [...studyQueue]
    newQueue.splice(currentQueueIndex, 1)
    if (grade === "again") {
      newQueue.push(cardIndex)
    }

    if (newQueue.length === 0) {
      setStudyQueue([])
      setCurrentQueueIndex(0)
      setIsFlipped(false)
    } else if (currentQueueIndex >= newQueue.length) {
      setStudyQueue(newQueue)
      setCurrentQueueIndex(newQueue.length)
      setIsFlipped(false)
    } else {
      setStudyQueue(newQueue)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentQueueIndex > 0) {
      setCurrentQueueIndex(currentQueueIndex - 1)
      setIsFlipped(false)
    }
  }

  if (selectedSet && studyMode) {
    const isSrs = studyMode === "srs"
    const queueLength = isSrs ? studyQueue.length : studyQueue.length
    const studyComplete = currentQueueIndex >= queueLength || queueLength === 0
    const currentCardIdx = studyQueue[currentQueueIndex]
    const srsCard = isSrs ? srsCards[currentCardIdx] : null
    const quickCard = !isSrs ? selectedSet.flashcards[currentCardIdx] : null
    const currentCard = srsCard ?? quickCard
    const progress = queueLength
      ? ((currentQueueIndex + (studyComplete ? 0 : 1)) / queueLength) * 100
      : 100

    return (
      <div className="relative min-h-screen overflow-hidden">
        <PageBackground />
        <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-6">
          <Button variant="secondary" size="sm" onClick={exitStudy} className="mb-4">
            ← Back to Dashboard
          </Button>

          <Card className="mb-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">{selectedSet.title}</h1>
                <p className="text-muted text-sm">{selectedSet.topic}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-surface border border-border text-muted shrink-0">
                {isSrs ? "SRS Study" : "Quick Study"}
              </span>
            </div>
          </Card>

          <Card className="mb-6">
            <div className="flex justify-between text-xs text-muted mb-2">
              <span className="font-semibold">
                {studyComplete
                  ? "Session complete"
                  : `Card ${currentQueueIndex + 1} of ${queueLength}`}
              </span>
              <span className="font-semibold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full bg-primary-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted">
              <span className="text-success">✓ {masteredCount} rated good+</span>
              <span className="text-warning">↻ {reviewAgainCount} again</span>
              {isSrs && <span>{cardsReviewed} reviewed this session</span>}
            </div>
          </Card>

          {studyComplete ? (
            <Card className="mb-6 text-center border-2 border-primary/30 py-12">
              <p className="text-4xl mb-4">🎉</p>
              <p className="text-primary font-bold text-lg mb-2">Study session complete!</p>
              <p className="text-muted text-sm mb-6">
                {isSrs
                  ? `You reviewed ${cardsReviewed} cards. Come back when more are due!`
                  : `You mastered ${masteredCount} cards${reviewAgainCount > 0 ? ` and marked ${reviewAgainCount} for review` : ""}.`}
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                {isSrs ? (
                  <Button onClick={() => startSrsStudy(selectedSet)}>SRS Study Again</Button>
                ) : (
                  <Button onClick={() => startQuickStudy(selectedSet, true)}>Quick Study Again</Button>
                )}
                <Button variant="secondary" onClick={exitStudy}>Back to Sets</Button>
              </div>
            </Card>
          ) : currentCard ? (
            <>
              <StudyFlipCard
                card={currentCard}
                isFlipped={isFlipped}
                onFlip={setIsFlipped}
                showGradeButtons={isSrs && isFlipped}
                onGrade={isSrs ? handleSrsGrade : undefined}
                onPrevious={prevCard}
                heightClass="min-h-[280px] md:min-h-[360px]"
                cardKey={currentCard.id}
              />

              {!isSrs && (
                isFlipped ? (
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                    <Button variant="secondary" onClick={() => advanceQuickStudy(false)}>
                      Review Again
                    </Button>
                    <Button onClick={() => advanceQuickStudy(true)}>
                      Got It ✓
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-3 mt-4">
                    <Button variant="secondary" onClick={prevCard} disabled={currentQueueIndex === 0}>Previous</Button>
                    <Button variant="ghost" onClick={() => setIsFlipped(true)}>Show Answer</Button>
                    <Button variant="secondary" onClick={shuffleStudy}>Shuffle</Button>
                  </div>
                )
              )}

              {isSrs && !isFlipped && (
                <div className="flex justify-between items-center gap-3 mt-4">
                  <Button variant="secondary" onClick={prevCard} disabled={currentQueueIndex === 0}>Previous</Button>
                  <Button variant="ghost" onClick={() => setIsFlipped(true)}>Show Answer</Button>
                  <span className="text-xs text-muted">
                    {srsCard?.status === "new" ? "New card" : "Due card"}
                  </span>
                </div>
              )}
            </>
          ) : null}
        </div>
        <toast.ToastContainer />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">
        <PageHeader
          badge="YOUR LEARNING HUB"
          title="Dashboard"
          subtitle="Manage and study your flashcard collections"
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <Card hover>
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{flashcardSets.length}</p>
            <p className="text-muted font-semibold text-sm">Total Sets</p>
          </Card>
          <Card hover>
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
              {flashcardSets.reduce((acc, set) => acc + set.flashcards.length, 0)}
            </p>
            <p className="text-muted font-semibold text-sm">Total Cards</p>
          </Card>
          <Card hover>
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{totalDue + totalNew}</p>
            <p className="text-muted font-semibold text-sm">Due to Study</p>
            <p className="text-xs text-muted mt-1">{totalDue} due · {totalNew} new</p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link href="/pages/flashcards">
            <Button size="lg">+ Create Flashcard Set</Button>
          </Link>
          <Link href="/pages/mindmap">
            <Button size="lg" variant="secondary">+ Create Mind Map</Button>
          </Link>
          {(flashcardSets.length > 0 || mindMapSets.length > 0) && dashboardTab === "sets" && (
            <div className="flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search sets by title or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search flashcard sets"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={dashboardTab === "sets" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setDashboardTab("sets")}
          >
            Flashcard Sets
          </Button>
          <Button
            variant={dashboardTab === "mindmaps" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setDashboardTab("mindmaps")}
          >
            Mind Maps ({mindMapSets.length})
          </Button>
        </div>

        {dashboardTab === "mindmaps" ? (
          mindMapSets.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-5xl mb-4">🗺️</p>
              <h2 className="text-xl font-bold text-foreground mb-3">No mind maps yet</h2>
              <p className="text-muted mb-6">Generate a mind map from any topic or existing deck.</p>
              <Link href="/pages/mindmap">
                <Button>Create Mind Map</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {mindMapSets.map((map) => (
                <Card key={map.id} hover>
                  <h3 className="text-lg font-bold text-foreground mb-2">{map.title}</h3>
                  <p className="text-muted text-sm mb-3">{map.topic}</p>
                  <div className="flex items-center gap-3 text-xs text-muted mb-5">
                    <span>{map.nodeCount} nodes</span>
                    <span>{new Date(map.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/pages/mindmap/${map.id}`}>
                    <Button fullWidth>View Mind Map</Button>
                  </Link>
                </Card>
              ))}
            </div>
          )
        ) : flashcardSets.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <Card className="inline-block p-8 md:p-12">
              <p className="text-5xl mb-4">📚</p>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">No flashcard sets yet</h2>
              <p className="text-muted mb-6">Create your first set to start learning!</p>
              <Link href="/pages/flashcards">
                <Button>Create Flashcard Set</Button>
              </Link>
            </Card>
          </div>
        ) : filteredSets.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-muted">No sets match &ldquo;{searchQuery}&rdquo;</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredSets.map((set, index) => {
              const stats = studyStats[set.id]
              return (
                <Card key={set.id} hover className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="text-lg font-bold text-foreground mb-2">{set.title}</h3>
                  <p className="text-muted text-sm mb-3">{set.topic}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-5">
                    <span>{set.flashcards.length} cards</span>
                    <span>{new Date(set.createdAt).toLocaleDateString()}</span>
                    {stats && stats.due > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning font-semibold">
                        {stats.due} due
                      </span>
                    )}
                    {stats && stats.new > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-info/20 text-info font-semibold">
                        {stats.new} new
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Button
                      fullWidth
                      onClick={() => startSrsStudy(set)}
                      disabled={loadingStudy}
                    >
                      {loadingStudy ? (
                        <span className="inline-flex items-center gap-2">
                          <LoadingLottie size={28} />
                          Loading...
                        </span>
                      ) : (
                        "SRS Study"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startQuickStudy(set)}
                      aria-label={`Quick study ${set.title}`}
                      title="Quick Study"
                    >
                      Quick
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteId(set.id)}
                      aria-label={`Delete ${set.title}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => handleDuplicate(set.id)}
                      disabled={duplicatingId === set.id}
                    >
                      {duplicatingId === set.id ? "Copying..." : "Duplicate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => handleExportSet(set, "csv")}
                    >
                      Export
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete flashcard set?"
        description="This action cannot be undone. The flashcard set will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
      />

      <toast.ToastContainer />
    </div>
  )
}
