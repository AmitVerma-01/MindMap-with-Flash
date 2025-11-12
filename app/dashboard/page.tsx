'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/useToast"

interface Flashcard {
  id: string
  front: string
  back: string
}

interface FlashcardSet {
  id: string
  title: string
  topic: string
  createdAt: string
  flashcards: Flashcard[]
}

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const toast = useToast()
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/')
      return
    }

    if (user) {
      fetchFlashcardSets()
    }
  }, [user, isLoaded, router])

  const fetchFlashcardSets = async () => {
    try {
      const response = await axios.get('/api/flashcard-sets')
      setFlashcardSets(response.data.flashcardSets)
    } catch (error) {
      console.error("Error fetching flashcard sets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flashcard set?")) {
      return
    }

    try {
      await axios.delete(`/api/flashcard-sets/${id}`)
      setFlashcardSets(flashcardSets.filter(set => set.id !== id))
      if (selectedSet?.id === id) {
        setSelectedSet(null)
      }
      toast.success("Flashcard set deleted successfully");
    } catch (error) {
      console.error("Error deleting flashcard set:", error)
      toast.error("Failed to delete flashcard set");
    }
  }

  const startStudying = (set: FlashcardSet) => {
    setSelectedSet(set)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  const nextCard = () => {
    if (selectedSet && currentCardIndex < selectedSet.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2f45] via-[#265973] to-[#1a4d6d] flex items-center justify-center">
        <div className="glass-card p-6 rounded-xl">
          <div className="text-[#CCFFFF] text-base">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  // Study Mode View
  if (selectedSet) {
    const currentCard = selectedSet.flashcards[currentCardIndex]
    const progress = ((currentCardIndex + 1) / selectedSet.flashcards.length) * 100

    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated liquid background - Brand colors */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#0f2f45] via-[#265973] to-[#1a4d6d]">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-[#2B74AB] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-[#265973] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#CCFFFF] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedSet(null)}
              className="glass-button px-4 py-2 rounded-lg text-white text-sm font-semibold mb-4 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <div className="glass-card p-5 rounded-xl">
              <h1 className="text-2xl font-bold text-white mb-1.5">{selectedSet.title}</h1>
              <p className="text-gray-300 text-sm">{selectedSet.topic}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="glass-card p-5 rounded-xl mb-6">
            <div className="flex justify-between text-xs text-gray-300 mb-2">
              <span className="font-semibold">Card {currentCardIndex + 1} of {selectedSet.flashcards.length}</span>
              <span className="font-semibold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-[#2B74AB] via-[#265973] to-[#CCFFFF] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="mb-6 cursor-pointer group"
          >
            <div className={`relative glass-card glass-card-hover rounded-2xl p-10 min-h-[360px] flex flex-col justify-center items-center overflow-hidden ${isFlipped ? 'glow-cyan' : 'glow'}`}>
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${isFlipped ? 'from-[#265973]/20 via-[#CCFFFF]/10 to-[#212D7D]/20' : 'from-[#2B74AB]/20 via-[#265973]/10 to-[#0F1438]/20'} opacity-80`}></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 shimmer"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center max-w-2xl">
                <div className="inline-block px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-5">
                  <span className="text-xs font-bold text-white/90 tracking-wider">
                    {isFlipped ? 'ANSWER' : 'QUESTION'}
                  </span>
                </div>
                <div className="text-white text-2xl font-bold leading-relaxed mb-6 drop-shadow-lg">
                  {isFlipped ? currentCard.back : currentCard.front}
                </div>
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span>Click to {isFlipped ? 'see question' : 'reveal answer'}</span>
                </div>
              </div>

              {/* Decorative blobs */}
              <div className="absolute top-6 right-6 w-24 h-24 bg-[#CCFFFF]/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-6 left-6 w-20 h-20 bg-[#2B74AB]/10 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={prevCard}
              disabled={currentCardIndex === 0}
              className="glass-button px-6 py-3 rounded-lg text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="glass-card glass-card-hover px-8 py-3 rounded-lg text-white text-sm font-bold bg-gradient-to-r from-[#265973]/20 to-[#CCFFFF]/20"
            >
              Flip Card
            </button>
            <button
              onClick={nextCard}
              disabled={currentCardIndex === selectedSet.flashcards.length - 1}
              className="glass-button px-6 py-3 rounded-lg text-white text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Completion Message */}
          {currentCardIndex === selectedSet.flashcards.length - 1 && (
            <div className="mt-6 glass-card p-5 rounded-xl text-center border-2 border-[#CCFFFF]/30">
              <p className="text-[#CCFFFF] font-bold text-base">
                🎉 You've reached the last card! Great job studying!
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated liquid background - Brand colors */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f2f45] via-[#265973] to-[#1a4d6d]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-[#2B74AB] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-[#265973] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#CCFFFF] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="glass-card px-6 py-2 rounded-full">
              <span className="text-sm font-bold text-white/90 tracking-wider">📊 YOUR LEARNING HUB</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-2xl">Dashboard</h1>
          <p className="text-gray-300 text-lg">Manage and study your flashcard collections</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="glass-card glass-card-hover p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="text-white text-4xl font-bold mb-2">{flashcardSets.length}</div>
            <div className="text-gray-400 font-semibold">Total Sets</div>
          </div>
          <div className="glass-card glass-card-hover p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#265973]/20">
                <svg className="w-8 h-8 text-[#CCFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
            </div>
            <div className="text-white text-4xl font-bold mb-2">
              {flashcardSets.reduce((acc, set) => acc + set.flashcards.length, 0)}
            </div>
            <div className="text-gray-400 font-semibold">Total Cards</div>
          </div>
          <div className="glass-card glass-card-hover p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#0F1438]/20">
                <svg className="w-8 h-8 text-[#CCFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-white text-4xl font-bold mb-2">{flashcardSets.length}</div>
            <div className="text-gray-400 font-semibold">Ready to Study</div>
          </div>
        </div>

        {/* Create New Button */}
        <div className="mb-6">
          <Link href="/pages/flashcards">
            <button className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] via-[#265973] to-[#0F1438] rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] via-[#265973] to-[#0F1438] rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <div className="relative px-8 py-4 font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Flashcard Set
              </div>
            </button>
          </Link>
        </div>

        {/* Flashcard Sets */}
        {flashcardSets.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-card inline-block p-12 rounded-2xl">
              <div className="text-6xl mb-5 float-animation">📚</div>
              <h2 className="text-2xl font-bold text-white mb-3">No flashcard sets yet</h2>
              <p className="text-gray-400 mb-6 text-base">Create your first set to start learning!</p>
              <Link href="/pages/flashcards">
                <button className="glass-button px-6 py-3 rounded-lg text-white text-sm font-bold">
                  Create Flashcard Set
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {flashcardSets.map((set, index) => (
              <div
                key={set.id}
                className="glass-card glass-card-hover p-5 rounded-xl animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-white mb-2">{set.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{set.topic}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      {set.flashcards.length} cards
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(set.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startStudying(set)}
                    className="flex-1 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-lg"></div>
                    <div className="relative py-2 text-sm font-bold text-white transition-transform group-hover:scale-105">
                      Study
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(set.id)}
                    className="glass-button px-3 py-2 rounded-lg text-red-400 text-sm font-bold hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Toast Container */}
      <toast.ToastContainer />
    </div>
  )
}
