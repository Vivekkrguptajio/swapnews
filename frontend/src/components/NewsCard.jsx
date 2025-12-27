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
                    className="w-full h-full object-cover opacity-90"
                    loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Right Side Actions (Reels Style) */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-[20]">
                {/* Like Button */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => toggleLike(newsItem)}
                        className="p-3 transition-transform active:scale-75"
                    >
                        <Heart
                            size={32}
                            className={`transition-colors drop-shadow-lg ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
                            strokeWidth={liked ? 0 : 2}
                        />
                    </button>
                    <span className="text-white text-xs font-medium drop-shadow-md">
                        {liked ? "1.2k" : "Like"}
                    </span>
                </div>

                {/* Comment Button */}
                <div className="flex flex-col items-center gap-1">
                    <button className="p-3 transition-transform active:scale-75">
                        <MessageCircle size={32} className="text-white drop-shadow-lg" strokeWidth={2} />
                    </button>
                    <span className="text-white text-xs font-medium drop-shadow-md">234</span>
                </div>

                {/* Bookmark Button */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => toggleBookmark(newsItem)}
                        className="p-3 transition-transform active:scale-75"
                    >
                        <Bookmark
                            size={32}
                            className={`transition-colors drop-shadow-lg ${bookmarked ? "fill-yellow-400 text-yellow-400" : "text-white"}`}
                            strokeWidth={bookmarked ? 0 : 2}
                        />
                    </button>
                    <span className="text-white text-xs font-medium drop-shadow-md">Save</span>
                </div>

                {/* Share Button */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={handleShare}
                        className="p-3 transition-transform active:scale-75"
                    >
                        <Share2 size={32} className="text-white drop-shadow-lg" strokeWidth={2} />
                    </button>
                    <span className="text-white text-xs font-medium drop-shadow-md">Share</span>
                </div>

                {/* Language Toggle */}
                <div className="flex flex-col items-center gap-1 pt-2">
                    <button
                        onClick={handleLanguageChange}
                        className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center bg-black/20 backdrop-blur-sm text-white font-bold text-xs"
                    >
                        {language === "en" ? "EN" : "HI"}
                    </button>
                </div>
            </div>

            {/* Bottom Info Content */}
            <div className="absolute left-0 bottom-0 w-full p-4 pb-20 z-[15] pr-20 flex flex-col gap-3">

                {/* User/Source Info */}
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">
                            SN
                        </div>
                    </div>
                    <span className="text-white font-semibold text-sm drop-shadow-md">SwipeNews</span>
                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium text-white border border-white/10">
                        Follow
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-white text-lg font-bold leading-tight line-clamp-2 drop-shadow-lg font-sans">
                    {newsItem.title}
                </h2>

                {/* Description (Collapsed by default logic handles 'more') */}
                <div className="text-white/90 text-sm font-light leading-snug line-clamp-2 drop-shadow-md">
                    {newsItem.description}
                    <span className="font-semibold text-white ml-1 opacity-100">... more</span>
                </div>

                {/* Music/Tag line */}
                <div className="flex items-center gap-2 mt-1 opacity-80">
                    <div className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full border border-white/5 backdrop-blur-sm">
                        <span className="text-[10px] text-white font-medium uppercase tracking-wider">
                            {newsItem.category || "Trending"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
