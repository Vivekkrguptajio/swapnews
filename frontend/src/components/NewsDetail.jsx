import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Share2, Globe } from "lucide-react";

export default function NewsDetail({ newsItem, isOpen, onClose }) {
    if (!newsItem) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black"
                        onClick={onClose}
                    />

                    {/* Content Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={{ left: 0, right: 0.3 }}
                        onDragEnd={(e, info) => {
                            // Swipe Left-to-Right to Close (reduced threshold for mobile)
                            if (info.offset.x > 80) {
                                onClose();
                            }
                        }}
                        className="w-full md:w-2/3 lg:w-1/2 h-full bg-gray-900 border-l border-white/10 relative overflow-y-auto shadow-2xl"
                    >
                        {/* Header Image */}
                        <div className="relative h-64 w-full">
                            <img
                                src={newsItem.imageUrl}
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                        </div>

                        {/* Text Content */}
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-white mb-4 leading-tight font-serif">
                                {newsItem.title}
                            </h1>

                            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-6 uppercase tracking-wider">
                                <div className="flex items-center gap-1">
                                    <User size={14} /> <span>Tech Insider</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} /> <span>{new Date(newsItem.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
                                <p>{newsItem.description}</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <p>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </div>

                            <a
                                href="#"
                                className="mt-8 flex items-center justify-center gap-2 w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition"
                            >
                                <Globe size={18} /> Read Full Article
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
