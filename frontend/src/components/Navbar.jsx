import { Share2 } from "lucide-react";
import { useNews } from "../context/NewsContext";

export default function Navbar() {
    const { isSidebarOpen } = useNews();

    return (
        <div
            className={`fixed top-0 w-full z-50 bg-transparent px-4 py-3 flex justify-center items-center transition-opacity duration-300 ${isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
            <h1 className="text-white font-bold text-xl tracking-wider">
                SWIPE<span className="text-red-500">NEWS</span>
            </h1>
        </div>
    );
}
