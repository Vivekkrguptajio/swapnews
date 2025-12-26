import { motion } from "framer-motion";
import { Share2, Bookmark, Heart, MessageCircle, Languages } from "lucide-react";
import { useNews } from "../context/NewsContext";

export default function NewsCard({ newsItem, index, currentIndex }) {
    const { toggleBookmark, isBookmarked, toggleLike, isLiked, language, handleLanguageChange } = useNews();
    const bookmarked = isBookmarked(newsItem._id);
    const liked = isLiked(newsItem._id);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: newsItem.title,
                    text: newsItem.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Error sharing:", err);
            }
        } else {
            alert("Web Share API not supported on this browser");
        }
    };

    // Only render if it's the current, previous, or next card to improve performance
    if (index < currentIndex - 1 || index > currentIndex + 1) return null;

    return (
        <div
            className="absolute top-0 left-0 w-full h-full flex flex-col bg-gray-900 text-white overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                />
                {/* Top Gradient for Title */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                {/* Bottom Gradient for Description */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
            </div>

            {/* Top Content (Title & Meta) */}
            <div className="absolute top-0 left-0 w-full p-6 pt-24 z-10">
                <div className="mb-3">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-xs font-bold rounded-full uppercase tracking-wider text-red-500 border border-red-500/30">
                        {newsItem.category}
                    </span>
                </div>

                <h2 className="text-3xl font-extrabold leading-tight mb-2 drop-shadow-lg font-serif tracking-tight">
                    {newsItem.title}
                </h2>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 uppercase tracking-widest">
                    <span>Tech Insider</span>
                    <span>•</span>
                    <span>4 Hours Ago</span>
                </div>
            </div>

            {/* Bottom Content (Description) */}
            <div className="absolute bottom-0 left-0 w-full p-6 pb-20 z-10">
                <p className="text-gray-200 text-sm leading-relaxed drop-shadow-md">
                    {newsItem.description}
                </p>
                <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                    Read More
                </div>
            </div>

            {/* Right Side Action Buttons (Small, Glassmorphism) */}
            <div className="absolute right-4 bottom-28 flex flex-col gap-4 z-20">
                <button
                    onClick={() => toggleLike(newsItem)}
                    className={`p-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-all ${liked ? "bg-red-500/20 text-red-500 border-red-500/50" : "bg-black/30 text-white hover:bg-black/50"}`}
                >
                    <Heart size={20} fill={liked ? "currentColor" : "none"} />
                </button>

                <button
                    onClick={() => toggleBookmark(newsItem)}
                    className={`p-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-all ${bookmarked ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" : "bg-black/30 text-white hover:bg-black/50"}`}
                >
                    <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
                </button>

                <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-black/50"
                >
                    <Share2 size={20} />
                </button>

                <button
                    className="p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-black/50"
                >
                    <MessageCircle size={20} />
                </button>

                <button
                    onClick={handleLanguageChange}
                    className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-black/50 flex items-center justify-center font-bold text-xs"
                >
                    {language === "en" ? "EN" : "HI"}
                </button>
            </div>
        </div>
    );
}
