import { useState, useRef, useEffect } from "react";
import { useNews } from "../context/NewsContext";
import NewsCard from "../components/NewsCard";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import NewsDetail from "../components/NewsDetail";
import { ChevronDown } from "lucide-react";

export default function Home() {
    const { news, loading, openSidebar, closeSidebar, isSidebarOpen, showDetail, setShowDetail, fetchNews } = useNews();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef(null);

    // Intersection Observer to track current index
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute("data-index"));
                        setCurrentIndex(index);

                        // Check if we reached the last item to trigger refresh
                        if (index === news.length - 1 && !isRefreshing) {
                            // Optional: Auto-load more logic here if needed
                        }
                    }
                });
            },
            {
                threshold: 0.6, // Trigger when 60% visible
            }
        );

        const children = container.querySelectorAll(".news-item");
        children.forEach((child) => observer.observe(child));

        return () => {
            children.forEach((child) => observer.unobserve(child));
            observer.disconnect();
        };
    }, [news]);

    // Pull to Refresh Logic (Basic implementation for Scroll Snap)
    const handleScroll = (e) => {
        // logic for pull to refresh can be added here if needed, 
        // but native scroll snap usually handles physics well.
    };

    if (loading) return <div className="h-[100dvh] w-full flex items-center justify-center bg-black text-white">Loading...</div>;
    if (!news || news.length === 0) return <div className="h-[100dvh] w-full flex items-center justify-center bg-black text-white">No News Available</div>;

    const currentNews = news[currentIndex];

    return (
        <div className="h-[100dvh] w-full bg-black relative">
            <Navbar />

            {/* Scroll Snack Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                onScroll={handleScroll}
            >
                {news.map((item, index) => (
                    <div
                        key={item._id}
                        data-index={index}
                        className="news-item h-full w-full snap-start relative bg-black"
                    >
                        <NewsCard newsItem={item} index={index} currentIndex={currentIndex} />
                    </div>
                ))}

                {/* Loading/Refresh Indicator at bottom */}
                <div className="h-24 w-full flex flex-col items-center justify-center snap-start text-white/50">
                    <ChevronDown className="animate-bounce mb-2" />
                    <span className="text-xs uppercase tracking-widest">End of Feed</span>
                    <button
                        onClick={() => {
                            setIsRefreshing(true);
                            fetchNews().finally(() => setIsRefreshing(false));
                        }}
                        className="mt-4 px-6 py-2 bg-white/10 rounded-full text-xs font-bold hover:bg-white/20 transition-colors"
                    >
                        {isRefreshing ? "Refreshing..." : "Tap to Refresh"}
                    </button>
                </div>
            </div>

            {/* 3 Dots Navigation - Always Visible */}
            <div className="fixed bottom-6 left-0 w-full flex justify-center items-center gap-3 z-[200] pb-safe pointer-events-none">
                <div className="flex gap-3 pointer-events-auto">
                    {/* Left Dot (Sidebar) */}
                    <button
                        onClick={() => {
                            setShowDetail(false);
                            openSidebar();
                        }}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300`}
                    >
                        <span className={`h-3 rounded-full transition-all duration-300 shadow-lg ${isSidebarOpen ? "w-10 bg-red-500" : "w-3 bg-white/50"}`} />
                    </button>

                    {/* Center Dot (Current Feed) */}
                    <button
                        onClick={() => {
                            closeSidebar();
                            setShowDetail(false);
                        }}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300`}
                    >
                        <span className={`h-3 rounded-full transition-all duration-300 shadow-lg ${!isSidebarOpen && !showDetail ? "w-10 bg-red-500" : "w-3 bg-white/50"}`} />
                    </button>

                    {/* Right Dot (Details) */}
                    <button
                        onClick={() => {
                            closeSidebar();
                            setShowDetail(true);
                        }}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-300`}
                    >
                        <span className={`h-3 rounded-full transition-all duration-300 shadow-lg ${showDetail ? "w-10 bg-red-500" : "w-3 bg-white/50"}`} />
                    </button>
                </div>
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
