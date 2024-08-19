export default function Footer(){
    return(
        <footer className="px-4 flex justify-between items-center h-14 bg-[#0F1438] text-[#CCFFFF] text-sm font-mono">
            <p className="text-xs md:text-base">© 2024 MindMapWithFlash. All rights reserved.</p>
            <div>
                <span className="hover:underline mr-3 text-xs md:text-base"> Terms of services </span>
                <span className="hover:underline text-xs md:text-base"> Privacy </span>
            </div>
        </footer>
    )
}