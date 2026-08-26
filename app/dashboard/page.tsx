'use client'

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useToast } from "@/hooks/useToast"
import PageBackground from "@/components/layout/PageBackground"
import PageHeader from "@/components/layout/PageHeader"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { ConfirmModal } from "@/components/ui/Modal"
import { shuffleFlashcards } from "@/lib/flashcard-utils"
import {
  downloadTextFile,
  flashcardsToCsv,
  flashcardsToAnkiCsv,
} from "@/lib/export-utils"
import type { Flashcard as FlashcardExport } from "@/types/flashcard"

interface Flashcard {
  id: string
  front: string
  back: string
  hint?: string | null
  mnemonic?: string | null
  category?: string | null
  difficulty?: string | null
}

interface FlashcardSet {
  id: string
  title: string
  topic: string
  createdAt: string
  flashcards: Flashcard[]
}

export default function Dashboard() {
  const toast = useToast()
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)
  const [studyQueue, setStudyQueue] = useState<number[]>([])
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [masteredCount, setMasteredCount] = useState(0)
  const [reviewAgainCount, setReviewAgainCount] = useState(0)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    axios.get('/api/flashcard-sets')
      .then((response) => {
        if (!active) return
        setFlashcardSets(response.data.flashcardSets)
      })
      .catch((error) => {
        console.error("Error fetching flashcard sets:", error)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const filteredSets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return flashcardSets
    return flashcardSets.filter(
      (set) =>
        set.title.toLowerCase().includes(q) ||
        set.topic.toLowerCase().includes(q)
    )
  }, [flashcardSets, searchQuery])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await axios.delete(`/api/flashcard-sets/${deleteId}`)
      setFlashcardSets(flashcardSets.filter(set => set.id !== deleteId))
      if (selectedSet?.id === deleteId) {
        setSelectedSet(null)
      }
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
      const response = await axios.post(`/api/flashcard-sets/${setId}`)
      setFlashcardSets((prev) => [response.data.flashcardSet, ...prev])
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

  const startStudying = (set: FlashcardSet, shuffled = false) => {
    const order = shuffled
      ? shuffleFlashcards(set.flashcards.map((_, i) => i))
      : set.flashcards.map((_, i) => i)
    setSelectedSet(set)
    setStudyQueue(order)
    setCurrentQueueIndex(0)
    setIsFlipped(false)
    setMasteredCount(0)
    setReviewAgainCount(0)
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

  const advanceStudy = (mastered: boolean) => {
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

  const prevCard = () => {
    if (currentQueueIndex > 0) {
      setCurrentQueueIndex(currentQueueIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (currentQueueIndex >= studyQueue.length) return
    if (e.key === "ArrowRight" && isFlipped) advanceStudy(true)
    if (e.key === "ArrowLeft") prevCard()
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      setIsFlipped(!isFlipped)
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <PageBackground />
        <Card className="relative z-10">
          <p className="text-primary text-base">Loading your dashboard...</p>
        </Card>
      </div>
    )
  }

  if (selectedSet) {
    const studyComplete = currentQueueIndex >= studyQueue.length
    const currentCardIdx = studyQueue[currentQueueIndex]
    const currentCard = selectedSet.flashcards[currentCardIdx]
    const progress = studyQueue.length
      ? ((currentQueueIndex + (studyComplete ? 0 : 1)) / studyQueue.length) * 100
      : 100

    return (
      <div className="relative min-h-screen overflow-hidden">
        <PageBackground />
        <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-6">
          <Button variant="secondary" size="sm" onClick={() => setSelectedSet(null)} className="mb-4">
            ← Back to Dashboard
          </Button>

          <Card className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">{selectedSet.title}</h1>
            <p className="text-muted text-sm">{selectedSet.topic}</p>
          </Card>

          <Card className="mb-6">
            <div className="flex justify-between text-xs text-muted mb-2">
              <span className="font-semibold">
                {studyComplete
                  ? "Session complete"
                  : `Card ${currentQueueIndex + 1} of ${studyQueue.length}`}
              </span>
              <span className="font-semibold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
              <div className="h-2 rounded-full bg-primary-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted">
              <span className="text-success">✓ {masteredCount} mastered</span>
              <span className="text-warning">↻ {reviewAgainCount} to review</span>
            </div>
          </Card>

          {studyComplete ? (
            <Card className="mb-6 text-center border-2 border-primary/30 py-12">
              <p className="text-4xl mb-4">🎉</p>
              <p className="text-primary font-bold text-lg mb-2">Study session complete!</p>
              <p className="text-muted text-sm mb-6">
                You mastered {masteredCount} cards
                {reviewAgainCount > 0 && ` and marked ${reviewAgainCount} for review`}.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => startStudying(selectedSet, true)}>Study Again</Button>
                <Button variant="secondary" onClick={() => setSelectedSet(null)}>Back to Sets</Button>
              </div>
            </Card>
          ) : (
            <>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsFlipped(!isFlipped)}
                onKeyDown={handleCardKeyDown}
                className={`mb-6 cursor-pointer focus-ring rounded-2xl ${isFlipped ? 'glow-cyan' : 'glow'}`}
                aria-label="Flip flashcard"
              >
                <Card hover padding="lg" className="min-h-[280px] md:min-h-[360px] flex flex-col justify-center items-center text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-surface border border-border text-xs font-bold mb-5">
                    {isFlipped ? 'ANSWER' : 'QUESTION'}
                  </span>
                  {currentCard?.category && !isFlipped && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-muted mb-3">
                      {currentCard.category}
                    </span>
                  )}
                  <p className="text-foreground text-xl md:text-2xl font-bold leading-relaxed mb-4">
                    {isFlipped ? currentCard?.back : currentCard?.front}
                  </p>
                  {!isFlipped && currentCard?.hint && (
                    <p className="text-primary/80 text-sm italic mb-2">Hint: {currentCard.hint}</p>
                  )}
                  {isFlipped && currentCard?.mnemonic && (
                    <p className="text-info text-sm bg-info/10 rounded-lg px-3 py-2 mb-2">💡 {currentCard.mnemonic}</p>
                  )}
                  <p className="text-muted text-sm">
                    {isFlipped
                      ? "Rate yourself below or press → if you got it"
                      : "Click or press Space to flip"}
                  </p>
                </Card>
              </div>

              {isFlipped ? (
                <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
                  <Button variant="secondary" onClick={() => advanceStudy(false)}>
                    Review Again
                  </Button>
                  <Button onClick={() => advanceStudy(true)}>
                    Got It ✓
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between items-center gap-3 mb-6">
                  <Button variant="secondary" onClick={prevCard} disabled={currentQueueIndex === 0}>Previous</Button>
                  <Button variant="ghost" onClick={() => setIsFlipped(true)}>Show Answer</Button>
                  <Button variant="secondary" onClick={shuffleStudy}>Shuffle</Button>
                </div>
              )}
            </>
          )}
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
            <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{flashcardSets.length}</p>
            <p className="text-muted font-semibold text-sm">Ready to Study</p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link href="/pages/flashcards">
            <Button size="lg">+ Create New Flashcard Set</Button>
          </Link>
          {flashcardSets.length > 0 && (
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

        {flashcardSets.length === 0 ? (
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
            {filteredSets.map((set, index) => (
              <Card key={set.id} hover className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-lg font-bold text-foreground mb-2">{set.title}</h3>
                <p className="text-muted text-sm mb-3">{set.topic}</p>
                <div className="flex items-center gap-3 text-xs text-muted mb-5">
                  <span>{set.flashcards.length} cards</span>
                  <span>{new Date(set.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 mb-2">
                  <Button fullWidth onClick={() => startStudying(set)}>Study</Button>
                  <Button variant="secondary" size="sm" onClick={() => startStudying(set, true)} aria-label={`Shuffle study ${set.title}`}>
                    🔀
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
            ))}
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
