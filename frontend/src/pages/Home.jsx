import { useState, useRef } from "react";
import { useNews } from "../context/NewsContext";
import NewsCard from "../components/NewsCard";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import NewsDetail from "../components/NewsDetail";
import { motion } from "framer-motion";

export default function Home() {
    const { news, loading, openSidebar, closeSidebar, isSidebarOpen } = useNews();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDetail, setShowDetail] = useState(false);

    // Drag constraints (Vertical) - Velocity-based detection
    const handleDragEnd = (event, info) => {
        const swipeThreshold = 50; // Distance threshold
        const velocityThreshold = 500; // Velocity threshold for flick detection

        // Check both distance AND velocity for more natural feel
        const shouldSwipe = Math.abs(info.offset.y) > swipeThreshold || Math.abs(info.velocity.y) > velocityThreshold;

        // Only trigger vertical swipe if horizontal movement is small
        if (Math.abs(info.offset.x) < 50 && shouldSwipe) {
            if (info.offset.y < 0 || info.velocity.y < -velocityThreshold) {
                // Swiped Up or Flicked Up -> Next
                if (currentIndex < news.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                }
            } else if (info.offset.y > 0 || info.velocity.y > velocityThreshold) {
                // Swiped Down or Flicked Down -> Prev
                if (currentIndex > 0) {
                    setCurrentIndex((prev) => prev - 1);
                }
            }
        }
        // If swipe doesn't meet threshold, framer-motion will snap back automatically
    };

    // Horizontal Swipe Handler (Right-to-Left for Details)
    const handlePanEnd = (event, info) => {
        // Swipe Right-to-Left (Open Details) - velocity-aware
        const shouldOpenDetails = info.offset.x < -60 || info.velocity.x < -500;
        if (shouldOpenDetails && Math.abs(info.offset.y) < 50) {
            setShowDetail(true);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-white bg-black">Loading News...</div>;
    if (!news || news.length === 0) return <div className="h-screen flex items-center justify-center text-white bg-black">No News Available</div>;

    const currentNews = news[currentIndex];

    return (
        <div className="h-screen w-full bg-black relative overflow-hidden">
            <Navbar />

            <div className="h-full w-full relative">
                <motion.div
                    className="h-full w-full hw-accelerate"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.05} // Stiffer elastic for cleaner feeling
                    dragMomentum={false}
                    dragDirectionLock
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    onDragEnd={handleDragEnd}
                    onPanEnd={handlePanEnd}
                    animate={{ y: -currentIndex * window.innerHeight }}
                    // Force re-render on index change to reset drag state if needed
                    key={currentIndex}
                    transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 350,
                        mass: 0.5,
                        restDelta: 0.001 // Settle faster
                    }}
                >
                    {news.map((item, index) => (
                        <div key={item._id} className="h-screen w-full relative hw-accelerate">
                            <NewsCard newsItem={item} index={index} currentIndex={currentIndex} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* 3 Dots Navigation Indicator & Controls - Always Visible */}
            <div
                className="fixed bottom-6 left-0 w-full flex justify-center items-center gap-3 z-[200] pb-safe"
            >
                {/* Left Dot (Sidebar) */}
                <button
                    onClick={() => {
                        setShowDetail(false);
                        openSidebar();
                    }}
                    aria-label="Open sidebar"
                    className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300`}
                >
                    <span className={`h-3 rounded-full transition-all duration-300 ${isSidebarOpen ? "w-10 bg-red-500" : "w-3 bg-gray-500/50"}`} />
                </button>

                {/* Center Dot (Current Feed) */}
                <button
                    onClick={() => {
                        closeSidebar();
                        setShowDetail(false);
                    }}
                    aria-label="Return to feed"
                    className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300`}
                >
                    <span className={`h-3 rounded-full transition-all duration-300 ${!isSidebarOpen && !showDetail ? "w-10 bg-red-500" : "w-3 bg-gray-500/50"}`} />
                </button>

                {/* Right Dot (Details) */}
                <button
                    onClick={() => {
                        closeSidebar();
                        setShowDetail(true);
                    }}
                    aria-label="View details"
                    className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300`}
                >
                    <span className={`h-3 rounded-full transition-all duration-300 ${showDetail ? "w-10 bg-red-500" : "w-3 bg-gray-500/50"}`} />
                </button>
            </div>

            <NewsDetail
                newsItem={currentNews}
                isOpen={showDetail}
                onClose={() => setShowDetail(false)}
            />

            <BottomBar />
        </div>
    );
}
