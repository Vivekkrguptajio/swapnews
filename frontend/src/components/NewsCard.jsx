import { motion } from "framer-motion";
import { Share2, Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
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
            console.log("Web Share API not supported");
        }
    };

    // Optimization: Don't render content if far from viewport
    const isVisible = index === currentIndex || index === currentIndex - 1 || index === currentIndex + 1;
    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 w-full h-full bg-black">
            {/* Background Image - Full Screen */}
            <div className="absolute inset-0">
                <img
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Top Category Badge */}
            <div className="absolute top-6 left-4 z-10">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wide">
                    {newsItem.category || "URBAN"}
                </span>
            </div>

            {/* Right Side Actions (Minimal) */}
            <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-[20]">
                {/* Like */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => toggleLike(newsItem)}
                        className="p-2 transition-transform active:scale-90"
                    >
                        <Heart
                            size={28}
                            className={`filter drop-shadow-lg transition-all ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
                            strokeWidth={liked ? 0 : 2.5}
                        />
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">
                        {liked ? "1.2k" : "Like"}
                    </span>
                </div>

                {/* Bookmark */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => toggleBookmark(newsItem)}
                        className="p-2 transition-transform active:scale-90"
                    >
                        <Bookmark
                            size={28}
                            className={`filter drop-shadow-lg transition-all ${bookmarked ? "fill-white text-white" : "text-white"}`}
                            strokeWidth={2.5}
                        />
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">Save</span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={handleShare}
                        className="p-2 transition-transform active:scale-90"
                    >
                        <Share2 size={28} className="text-white filter drop-shadow-lg" strokeWidth={2.5} />
                    </button>
                    <span className="text-white text-xs font-semibold drop-shadow-md">Share</span>
                </div>

                {/* More Options */}
                <div className="flex flex-col items-center gap-1">
                    <button className="p-2 transition-transform active:scale-90">
                        <MoreHorizontal size={28} className="text-white filter drop-shadow-lg" strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Bottom Content - YouTube Shorts Style */}
            <div className="absolute left-0 bottom-0 w-full p-4 pb-24 z-[15] pr-20">

                {/* Title */}
                <h2 className="text-white text-xl font-bold leading-tight mb-3 drop-shadow-lg">
                    {newsItem.title}
                </h2>

                {/* Source + Time */}
                <div className="flex items-center gap-2 text-xs text-white/80 mb-3 uppercase tracking-wide font-medium">
                    <span>URBAN CHRONICLE</span>
                    <span>•</span>
                    <span>2 HOURS AGO</span>
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-2">
                    {newsItem.description}
                </p>

                {/* Profile Section with Follow Button */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        SN
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-semibold text-sm">SwipeNews</p>
                    </div>
                    <button className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-white/90 transition-colors">
                        Follow
                    </button>
                </div>
            </div>
        </div>
    );
}
