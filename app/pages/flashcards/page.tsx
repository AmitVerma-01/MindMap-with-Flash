'use client'

import Flashcard from "@/components/flashcard"
import Spinner from "@/components/spinner"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { useState } from "react"

interface FlashCard {
    front: string,
    back: string
}

export default function Flashcards() {
    const {user} = useUser()
    const [loading , setLoading] = useState<boolean>(false)
    const [flashcards, setFlashcards] = useState<FlashCard[]>([])
    const [topic, setTopic] = useState('')
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

    const handleClick = async (e: any) => {
        e.preventDefault()
        setLoading(true)
        const response = await axios.post('/api/flashcard', {
            topic: topic
        })
        setFlashcards(response.data.flashcard)
        setFlippedIndex(null)
        setLoading(false)
    }

    return (
        <div className="bg-gray-800 w-screen min-h-screen p-3">
            <div className="w-full flex justify-center items-center"> 
                <form className="flex flex-col gap-y-2 items-center">
                    <input 
                        type="text" 
                        placeholder="Enter text/question/topic here..." 
                        required 
                        onChange={(e) => setTopic(e.target.value)} 
                        className="p-2 mx-2 rounded-md text-lg md:w-[40vw]" 
                        />
                    <button 
                        onClick={(e) => handleClick(e)} 
                        className="bg-[#2B74AB] p-2 font-medium text-white rounded-md w-fit min-w-24 h-10 flex justify-center items-center"
                        >
                        {loading ? <Spinner/> : "Submit" }
                    </button>
                </form>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 font-semibold justify-items-center m-3 my-5">
                {
                    flashcards.length > 0 &&
                    flashcards.map((flashcard, i) => (
                        <Flashcard 
                            key={i} 
                            index={i} 
                            front={flashcard.front} 
                            back={flashcard.back} 
                            flippedIndex={flippedIndex} 
                            setFlippedIndex={setFlippedIndex} 
                        />
                    ))
                }
            </div>
            {
                flashcards.length > 0 && (
                   <div className="w-full flex justify-center items-center">
                        <button className="bg-[#2B74AB] p-2 font-medium text-white rounded-md w-fit min-w-24 h-10 flex justify-center items-center">
                            Save
                        </button>
                   </div>
                )
            }
        </div>
    )
}


