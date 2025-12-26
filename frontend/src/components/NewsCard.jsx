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
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full p-6 pb-24">
                <div className="mb-2">
                    <span className="px-2 py-1 bg-red-600 text-xs font-bold rounded uppercase">
                        {newsItem.category}
                    </span>
                </div>

                <h2 className="text-2xl font-bold leading-tight mb-2 drop-shadow-lg">
                    {newsItem.title}
                </h2>

                <p className="text-gray-200 text-sm mb-4 line-clamp-3 drop-shadow-md">
                    {newsItem.description}
                </p>

                {/* Action Buttons */}
                <div className="absolute right-4 bottom-32 flex flex-col gap-6">
                    <button
                        onClick={() => toggleLike(newsItem)}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 ${liked ? "text-red-500" : "text-white"}`}>
                            <Heart size={24} fill={liked ? "currentColor" : "none"} />
                        </div>
                        <span className="text-xs font-medium">Like</span>
                    </button>

                    <button
                        onClick={() => toggleBookmark(newsItem)}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 ${bookmarked ? "text-yellow-400" : "text-white"}`}>
                            <Bookmark size={24} fill={bookmarked ? "currentColor" : "none"} />
                        </div>
                        <span className="text-xs font-medium">Save</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
                            <Share2 size={24} />
                        </div>
                        <span className="text-xs font-medium">Share</span>
                    </button>

                    <button
                        className="flex flex-col items-center gap-1"
                    >
                        <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
                            <MessageCircle size={24} />
                        </div>
                        <span className="text-xs font-medium">Comment</span>
                    </button>

                    <button
                        onClick={handleLanguageChange}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white">
                            <Languages size={24} />
                        </div>
                        <span className="text-xs font-medium">{language === "en" ? "EN" : "HI"}</span>
                    </button>
                </div>

                <div className="text-xs text-gray-400 mt-2">
                    Swipe for more • {new Date(newsItem.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
