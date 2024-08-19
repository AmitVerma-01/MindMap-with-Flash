import ReactCardFlip from "react-card-flip"

export default function Flashcard({ front, back, index, flippedIndex, setFlippedIndex }: 
    { front: string, back: string, index: number, flippedIndex: number | null, setFlippedIndex: (i: number | null) => void }) {
const isFlipped = flippedIndex === index
const handleClick = () => {
setFlippedIndex(isFlipped ? null : index)
}

return (
    <div onClick={handleClick} className="font-serif">
        <ReactCardFlip
            isFlipped={isFlipped}
            flipDirection="horizontal"
            >
            <div className={`${isFlipped ? "hidden" : "block"} bg-green-400 flex justify-center items-center  w-72 h-52 p-2 rounded-md`}>
                {front}
            </div>
            <div className={`${isFlipped ? "block" : "hidden"} bg-orange-400 flex justify-center items-center w-72 h-52 p-2 rounded-md`}>
                {back}
            </div>
        </ReactCardFlip>
    </div>
)
}