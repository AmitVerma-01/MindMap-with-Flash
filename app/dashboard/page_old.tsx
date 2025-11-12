'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
    } catch (error) {
      console.error("Error deleting flashcard set:", error)
      alert("Failed to delete flashcard set")
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (selectedSet) {
    const currentCard = selectedSet.flashcards[currentCardIndex]
    const progress = ((currentCardIndex + 1) / selectedSet.flashcards.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedSet(null)}
              className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">{selectedSet.title}</h1>
            <p className="text-gray-400">{selectedSet.topic}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Card {currentCardIndex + 1} of {selectedSet.flashcards.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Flashcard */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="mb-6 cursor-pointer"
          >
            <div className={`bg-gradient-to-br ${isFlipped ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'} rounded-2xl p-12 shadow-2xl min-h-[400px] flex flex-col justify-center items-center transition-all transform hover:scale-[1.02] border ${isFlipped ? 'border-purple-400' : 'border-blue-400'}`}>
              <div className="text-sm text-white/80 mb-4 font-semibold">
                {isFlipped ? 'ANSWER' : 'QUESTION'}
              </div>
              <div className="text-white text-center text-2xl font-medium leading-relaxed max-w-2xl">
                {isFlipped ? currentCard.back : currentCard.front}
              </div>
              <div className="mt-6 text-white/70 text-sm">
                Click to {isFlipped ? 'see question' : 'reveal answer'}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevCard}
              disabled={currentCardIndex === 0}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold transition-all"
            >
              ← Previous
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-8 py-3 rounded-lg text-white font-semibold transition-all"
            >
              Flip Card
            </button>
            <button
              onClick={nextCard}
              disabled={currentCardIndex === selectedSet.flashcards.length - 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed px-6 py-3 rounded-lg text-white font-semibold transition-all"
            >
              Next →
            </button>
          </div>

          {/* Completion Message */}
          {currentCardIndex === selectedSet.flashcards.length - 1 && (
            <div className="mt-6 bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
              <p className="text-green-400 font-semibold">
                🎉 You've reached the last card! Great job studying!
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-gray-400 text-lg">Manage and study your flashcard sets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6">
            <div className="text-blue-400 text-sm font-semibold mb-2">TOTAL SETS</div>
            <div className="text-white text-3xl font-bold">{flashcardSets.length}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
            <div className="text-purple-400 text-sm font-semibold mb-2">TOTAL CARDS</div>
            <div className="text-white text-3xl font-bold">
              {flashcardSets.reduce((acc, set) => acc + set.flashcards.length, 0)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
            <div className="text-green-400 text-sm font-semibold mb-2">READY TO STUDY</div>
            <div className="text-white text-3xl font-bold">{flashcardSets.length}</div>
          </div>
        </div>

        {/* Create New Button */}
        <div className="mb-6">
          <Link href="/pages/flashcards">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg text-white font-semibold transition-all transform hover:scale-105 shadow-lg">
              ✨ Create New Flashcard Set
            </button>
          </Link>
        </div>

        {/* Flashcard Sets */}
        {flashcardSets.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-white mb-2">No flashcard sets yet</h2>
            <p className="text-gray-400 mb-6">Create your first set to get started!</p>
            <Link href="/pages/flashcards">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 rounded-lg text-white font-semibold transition-all">
                Create Flashcard Set
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardSets.map((set) => (
              <div
                key={set.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{set.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{set.topic}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📝 {set.flashcards.length} cards</span>
                    <span>📅 {new Date(set.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startStudying(set)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-2 rounded-lg text-white font-semibold transition-all"
                  >
                    Study
                  </button>
                  <button
                    onClick={() => handleDelete(set.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-semibold transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
