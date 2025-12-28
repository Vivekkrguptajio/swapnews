import { motion } from "framer-motion";
import { Share2, Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useNews } from "../context/NewsContext";
import { useNavigate } from "react-router-dom";

export default function NewsCard({ newsItem, index, currentIndex }) {
    const { toggleBookmark, isBookmarked, toggleLike, isLiked, language, handleLanguageChange, user } = useNews();
    const navigate = useNavigate();
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

    // Dynamic Time Ago Helper
    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " YEARS AGO";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " MONTHS AGO";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " DAYS AGO";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " HOURS AGO";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " MIN AGO";
        return "JUST NOW";
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
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
            </div>

            {/* Top Category Badge - Reference Style (Pill) */}
            <div className="absolute top-3.5 left-4 z-50">
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                    {newsItem.category || "URBAN"}
                </span>
            </div>

            {/* Title & Source - Moved to Top */}
            <div className="absolute top-20 left-4 right-16 z-[25]">
                <h2 className="text-white text-[28px] font-bold leading-[1.1] drop-shadow-lg font-sans tracking-tight mb-2">
                    {newsItem.title}
                </h2>
                {/* Source + Time - Moved Below Title */}
                <div className="flex items-center gap-2 text-[12px] text-gray-300 uppercase tracking-wider font-medium opacity-90">
                    <span className="text-[#FF7F50] font-bold">{newsItem.location || "GLOBAL"}</span>
                    <span className="text-gray-400">•</span>
                    <span>{getTimeAgo(newsItem.createdAt)}</span>
                </div>
            </div>

            {/* Right Side Actions (Minimal) */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-[20]">
                {/* Like Button */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={() => toggleLike(newsItem)}
                        className="p-2 transition-transform active:scale-75"
                    >
                        <Heart
                            size={30}
                            className={`transition-colors drop-shadow-md ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
                            strokeWidth={liked ? 0 : 2}
                        />
                    </button>
                    <span className="text-white text-xs font-medium drop-shadow-md">
                        {liked ? "1.2k" : "Like"}
                    </span>
                </div>

                {/* Bookmark Button - Only visible if logged in */}
                {user && (
                    <div className="flex flex-col items-center gap-1">
                        <button
                            onClick={() => toggleBookmark(newsItem)}
                            className="p-2 transition-transform active:scale-75"
                        >
                            <Bookmark
                                size={30}
                                className={`transition-colors drop-shadow-md ${bookmarked ? "fill-white text-white" : "text-white"}`}
                                strokeWidth={2}
                            />
                        </button>
                        <span className="text-white text-xs font-medium drop-shadow-md">Save</span>
                    </div>
                )}

                {/* Share Button */}
                <div className="flex flex-col items-center gap-1">
                    <button
                        onClick={handleShare}
                        className="p-2 transition-transform active:scale-75"
                    >
                        <Share2 size={30} className="text-white drop-shadow-md" strokeWidth={2} />
                    </button>
                    <span className="text-white text-xs font-medium drop-shadow-md">Share</span>
                </div>

                {/* More Options */}
                <div className="flex flex-col items-center gap-1 pt-2">
                    <button className="p-2 transition-transform active:scale-90">
                        <MoreHorizontal size={30} className="text-white drop-shadow-md" strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Bottom Content - Only Description & Follow */}
            <div className="absolute left-0 bottom-0 w-full p-5 pb-24 z-[15] pr-16 bg-gradient-to-t from-black via-black/40 to-transparent">

                {/* Description - Bottom Floating */}
                <p className="text-white/90 text-[14px] leading-relaxed font-light drop-shadow-md">
                    {newsItem.description?.split(" ").slice(0, 30).join(" ")}
                    {newsItem.description?.split(" ").length > 30 ? "..." : ""}
                </p>

                {/* Profile Section with Follow Button - Bottom */}
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-lg ring-2 ring-black">
                        SN
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm drop-shadow-md">SwipeNews</p>
                    </div>
                    {user && (
                        <button className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                            Follow
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
