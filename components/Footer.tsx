export default function Footer(){
    return(
        <footer className="px-6 py-6 bg-gray-900 border-t border-gray-800 text-gray-400 text-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs md:text-sm">© 2024 MindMapWithFlash. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-blue-400 transition-colors text-xs md:text-sm">Terms of Service</a>
                    <a href="#" className="hover:text-blue-400 transition-colors text-xs md:text-sm">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-400 transition-colors text-xs md:text-sm">Contact</a>
                </div>
            </div>
        </footer>
    )
}