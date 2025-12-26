import { useState, useRef } from "react";
import { useNews } from "../context/NewsContext";
import NewsCard from "../components/NewsCard";
import Navbar from "../components/Navbar";
import BottomBar from "../components/BottomBar";
import { motion } from "framer-motion";

export default function Home() {
    const { news, loading } = useNews();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Drag constraints
    const handleDragEnd = (event, info) => {
        const threshold = 100; // Drag distance to trigger swipe
        if (info.offset.y < -threshold) {
            // Swiped Up -> Next
            if (currentIndex < news.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            }
        } else if (info.offset.y > threshold) {
            // Swiped Down -> Prev
            if (currentIndex > 0) {
                setCurrentIndex((prev) => prev - 1);
            }
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-white bg-black">Loading News...</div>;
    if (!news || news.length === 0) return <div className="h-screen flex items-center justify-center text-white bg-black">No News Available</div>;

    return (
        <div className="h-screen w-full bg-black relative overflow-hidden">
            <Navbar />

            <div className="h-full w-full relative">
                <motion.div
                    className="h-full w-full"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }} // Elastic effect but snap back
                    onDragEnd={handleDragEnd}
                    animate={{ y: -currentIndex * window.innerHeight }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                >
                    {news.map((item, index) => (
                        <div key={item._id} className="h-screen w-full relative">
                            <NewsCard newsItem={item} index={index} currentIndex={currentIndex} />
                        </div>
                    ))}
                </motion.div>
            </div>

            <BottomBar />
        </div>
    );
}
