import { Home, Bookmark, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomBar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="hidden md:flex fixed bottom-0 w-full z-10 bg-black border-t border-white/10 px-6 py-3 justify-between items-center pb-6">
            <Link to="/" className={`flex flex-col items-center ${isActive("/") ? "text-red-500" : "text-gray-400"}`}>
                <Home size={24} />
                <span className="text-xs mt-1">Home</span>
            </Link>

            <Link to="/bookmarks" className={`flex flex-col items-center ${isActive("/bookmarks") ? "text-red-500" : "text-gray-400"}`}>
                <Bookmark size={24} />
                <span className="text-xs mt-1">Saved</span>
            </Link>

            <Link to="/admin" className={`flex flex-col items-center ${isActive("/admin") ? "text-red-500" : "text-gray-400"}`}>
                <ShieldCheck size={24} />
                <span className="text-xs mt-1">Admin</span>
            </Link>
        </div>
    );
}
