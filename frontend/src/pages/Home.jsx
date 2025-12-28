import { useState, useRef, useEffect } from "react";
import { useNews } from "../context/NewsContext";
import NewsCard from "../components/NewsCard";
import SkeletonNewsCard from "../components/SkeletonNewsCard";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import NewsDetail from "../components/NewsDetail";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { news, loading, openSidebar, closeSidebar, isSidebarOpen, showDetail, setShowDetail, fetchNews, user } = useNews();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    // Redirect Admin to Dashboard logic
    useEffect(() => {
        if (user) {
            if (user.isAdmin) {
                navigate("/admin");
            }
            // Publishers can view Home/News Feed, no forced redirect
        }
    }, [user, navigate]);

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

    if (loading) return (
        <div className="h-[100dvh] w-full bg-black relative">
            <Navbar />
            <SkeletonNewsCard />
            <BottomBar />
        </div>
    );

    if (!news || news.length === 0) return <div className="h-[100dvh] w-full flex items-center justify-center bg-black text-white">No News Available</div>;

    const currentNews = news[currentIndex];

    return (
        <div className="h-[100dvh] w-full bg-black relative">
            <Navbar />

            {/* Scroll Snap Container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory snap-always overscroll-y-none touch-pan-y no-scrollbar"
                style={{ willChange: 'scroll-position', transform: 'translate3d(0,0,0)' }}
                onScroll={handleScroll}
            >
                {news.map((item, index) => (
                    <div
                        key={item._id}
                        data-index={index}
                        className="news-item h-full w-full snap-start relative bg-black"
                        style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
                    >
                        <NewsCard newsItem={item} index={index} currentIndex={currentIndex} />
                    </div>
                ))}

                {/* Empty snap point to trigger End of Feed card */}
                {/* End of Feed Card - Inline Scrollable */}
                <div
                    data-index={news.length}
                    className="news-item h-full w-full snap-start relative bg-black flex items-center justify-center"
                >
                    <div className="flex flex-col items-center gap-6 p-8 opacity-80 scale-90 md:scale-100 transition-all duration-500">
                        <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-2xl shadow-red-500/10">
                            <ChevronDown className="animate-bounce text-red-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-black italic text-white tracking-tighter">YOU'RE CAUGHT <span className="text-red-600">UP</span></h2>
                        <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">No more news for now</p>

                        <button
                            onClick={() => {
                                setIsRefreshing(true);
                                fetchNews().finally(() => setIsRefreshing(false));
                            }}
                            className="group relative px-8 py-3 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            {isRefreshing ? "Refreshing..." : "Start Over"}
                            <span className="absolute inset-0 rounded-full border border-white/50 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3 Dots Navigation - Always Visible & Top Layer */}
            <div className="fixed bottom-6 left-0 w-full flex justify-center items-center gap-3 z-[9999] pb-safe pointer-events-none">
                <div className="flex gap-4 pointer-events-auto bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/5">
                    {/* Left Dot (Sidebar) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Left dot clicked - Opening sidebar');
                            setShowDetail(false);
                            openSidebar();
                        }}
                        className="flex items-center justify-center group min-w-[44px] min-h-[44px] cursor-pointer"
                    >
                        <span className={`h-2 rounded-full transition-all duration-300 group-hover:bg-white/80 ${isSidebarOpen ? "w-8 bg-red-500" : "w-2 bg-white/40"}`} />
                    </button>

                    {/* Center Dot (Current Feed) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Center dot clicked - Closing all');
                            closeSidebar();
                            setShowDetail(false);
                        }}
                        className="flex items-center justify-center group min-w-[44px] min-h-[44px] cursor-pointer"
                    >
                        <span className={`h-2 rounded-full transition-all duration-300 group-hover:bg-white/80 ${!isSidebarOpen && !showDetail ? "w-8 bg-red-500" : "w-2 bg-white/40"}`} />
                    </button>

                    {/* Right Dot (Details) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Right dot clicked - Opening details');
                            closeSidebar();
                            setShowDetail(true);
                        }}
                        className="flex items-center justify-center group min-w-[44px] min-h-[44px] cursor-pointer"
                    >
                        <span className={`h-2 rounded-full transition-all duration-300 group-hover:bg-white/80 ${showDetail ? "w-8 bg-red-500" : "w-2 bg-white/40"}`} />
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
