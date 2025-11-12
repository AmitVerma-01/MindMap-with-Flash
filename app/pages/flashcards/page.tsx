'use client'

import Flashcard from "@/components/flashcard"
import Spinner from "@/components/spinner"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { useState } from "react"
import type { Flashcard as FlashcardType } from "@/types/flashcard"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/useToast"

export default function Flashcards() {
    const { user } = useUser()
    const router = useRouter()
    const toast = useToast()
    const [loading, setLoading] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)
    const [flashcards, setFlashcards] = useState<FlashcardType[]>([])
    const [topic, setTopic] = useState<string>('')
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null)
    const [showSaveModal, setShowSaveModal] = useState<boolean>(false)
    const [setTitle, setSetTitle] = useState<string>('')

    const handleGenerate = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        
        if (!topic.trim()) {
            toast.warning("Please enter a topic or question");
            return;
        }

        setLoading(true)
        try {
            const response = await axios.post('/api/flashcard', {
                topic: topic
            })
            
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            
            setFlashcards(response.data.flashcard)
            setFlippedIndex(null)
            toast.success(`Generated ${response.data.flashcard.length} flashcards!`);
        } catch (error) {
            console.error("Error generating flashcards:", error);
            toast.error(error instanceof Error ? error.message : "Failed to generate flashcards. Please try again.");
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!user) {
            toast.warning("Please sign in to save flashcards");
            return;
        }

        if (!setTitle.trim()) {
            toast.warning("Please enter a title for your flashcard set");
            return;
        }

        setSaving(true)
        try {
            await axios.post('/api/flashcard-sets', {
                title: setTitle,
                topic: topic,
                flashcards: flashcards
            })
            
            setShowSaveModal(false)
            setSetTitle('')
            toast.success("Flashcards saved successfully!");
            setTimeout(() => router.push('/dashboard'), 1000);
        } catch (error) {
            console.error("Error saving flashcards:", error);
            toast.error("Failed to save flashcards. Please try again.");
        } finally {
            setSaving(false)
        }
    }

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
                {/* Header with glass effect */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-block mb-4">
                        <div className="glass-card px-6 py-2 rounded-full">
                            <span className="text-sm font-bold text-white/90 tracking-wider">✨ AI-POWERED LEARNING</span>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                        Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] via-[#CCFFFF] to-[#265973]">Flashcards</span>
                    </h1>
                    <p className="text-gray-300 text-lg">Transform any topic into interactive learning cards</p>
                </div>

                {/* Input Form with liquid glass */}
                <div className="w-full flex justify-center items-center mb-12">
                    <form className="w-full max-w-3xl">
                        <div className="glass-card rounded-2xl p-8 shadow-2xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your topic... (e.g., 'React Hooks', 'Quantum Physics')"
                                    required
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full p-5 rounded-xl text-lg bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:border-white/30 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all backdrop-blur-sm"
                                    disabled={loading}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleGenerate(e)}
                                disabled={loading}
                                className="w-full mt-6 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] via-[#265973] to-[#0F1438] rounded-xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] via-[#265973] to-[#0F1438] rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                                <div className="relative px-8 py-4 bg-gradient-to-r from-[#2B74AB] via-[#265973] to-[#0F1438] rounded-xl font-bold text-white text-lg transition-transform group-hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <Spinner /> 
                                            <span>Generating Magic...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Generate Flashcards
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Flashcards Grid */}
                {flashcards && flashcards.length > 0 && (
                    <>
                        <div className="mb-8 text-center">
                            <div className="inline-block glass-card px-6 py-3 rounded-full">
                                <p className="text-white font-semibold">
                                    ✨ Generated <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B74AB] to-[#CCFFFF] font-bold text-xl">{flashcards.length}</span> flashcards
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {flashcards.map((flashcard, i) => (
                                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <Flashcard
                                        index={i}
                                        front={flashcard.front}
                                        back={flashcard.back}
                                        flippedIndex={flippedIndex}
                                        setFlippedIndex={setFlippedIndex}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons with glass effect */}
                        <div className="flex flex-wrap justify-center items-center gap-4 pb-12">
                            <button 
                                className="group relative overflow-hidden"
                                onClick={() => setShowSaveModal(true)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-xl"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                                <div className="relative glass-card px-8 py-4 rounded-xl font-bold text-white transition-transform group-hover:scale-105 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Save Flashcards
                                </div>
                            </button>
                            <button 
                                className="glass-card glass-card-hover px-8 py-4 rounded-xl font-bold text-white flex items-center gap-2"
                                onClick={() => {
                                    setFlashcards([]);
                                    setTopic('');
                                    setFlippedIndex(null);
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Clear All
                            </button>
                        </div>
                    </>
                )}

                {/* Empty State with glass effect */}
                {flashcards.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="glass-card inline-block p-12 rounded-3xl">
                            <div className="text-7xl mb-6 float-animation">📚</div>
                            <p className="text-white text-xl font-semibold mb-2">Ready to Learn?</p>
                            <p className="text-gray-400">Enter a topic above to generate your first flashcard set</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Modal with liquid glass */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="glass-card rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="inline-block p-4 rounded-full bg-gradient-to-r from-[#2B74AB]/20 to-[#265973]/20 mb-4">
                                <svg className="w-8 h-8 text-[#CCFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Save Your Flashcards</h2>
                            <p className="text-gray-400">Give your set a memorable name</p>
                        </div>
                        <input
                            type="text"
                            placeholder="e.g., 'JavaScript Fundamentals'"
                            value={setTitle}
                            onChange={(e) => setSetTitle(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:border-white/30 focus:ring-2 focus:ring-purple-500/50 focus:outline-none mb-6 backdrop-blur-sm"
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-xl"></div>
                                <div className="relative px-6 py-3 font-bold text-white transition-transform group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    {saving ? "Saving..." : "Save"}
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setShowSaveModal(false)
                                    setSetTitle('')
                                }}
                                disabled={saving}
                                className="flex-1 glass-button px-6 py-3 font-bold text-white rounded-xl"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Toast Container */}
            <toast.ToastContainer />
        </div>
    )
}


