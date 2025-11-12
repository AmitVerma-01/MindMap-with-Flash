import ReactCardFlip from "react-card-flip"

export default function Flashcard({ front, back, index, flippedIndex, setFlippedIndex }: 
    { front: string, back: string, index: number, flippedIndex: number | null, setFlippedIndex: (i: number | null) => void }) {
const isFlipped = flippedIndex === index
const handleClick = () => {
setFlippedIndex(isFlipped ? null : index)
}

return (
    <div onClick={handleClick} className="w-full h-72 perspective-1000">
        <ReactCardFlip
            isFlipped={isFlipped}
            flipDirection="horizontal"
            >
            {/* Question Side - Liquid Glass Brand Blue */}
            <div className="relative w-full h-72 p-8 rounded-2xl cursor-pointer glass-card glass-card-hover group overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2B74AB]/30 via-[#265973]/20 to-[#0F1438]/30 opacity-80"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer"></div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow rounded-2xl"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <span className="text-xs font-bold text-white/90 tracking-wider">QUESTION</span>
                    </div>
                    <div className="text-white text-center font-semibold text-lg leading-relaxed px-2 drop-shadow-lg">
                        {front}
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-white/60 text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span>Click to reveal</span>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-[#CCFFFF]/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-[#2B74AB]/10 rounded-full blur-xl"></div>
            </div>

            {/* Answer Side - Liquid Glass Brand Cyan */}
            <div className="relative w-full h-72 p-8 rounded-2xl cursor-pointer glass-card glass-card-hover group overflow-hidden"
                title={back}
            >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#265973]/30 via-[#CCFFFF]/10 to-[#212D7D]/30 opacity-80"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 shimmer"></div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-cyan rounded-2xl"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        <span className="text-xs font-bold text-white/90 tracking-wider">ANSWER</span>
                    </div>
                    <div className="text-white text-center font-medium leading-relaxed overflow-y-auto max-h-44 px-2 drop-shadow-lg custom-scrollbar">
                        {back}
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-white/60 text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span>Click to flip back</span>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-[#CCFFFF]/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-[#265973]/10 rounded-full blur-xl"></div>
            </div>
        </ReactCardFlip>
    </div>
)
}