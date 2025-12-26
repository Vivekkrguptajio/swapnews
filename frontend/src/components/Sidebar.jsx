import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Bookmark, ShieldCheck, X } from "lucide-react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: "/", label: "Home", icon: <Home size={24} /> },
        { path: "/bookmarks", label: "Saved", icon: <Bookmark size={24} /> },
        { path: "/admin", label: "Admin", icon: <ShieldCheck size={24} /> },
    ];

    return (
        <>
            {/* Edge Trigger Area - Swipe Right to Open */}
            {/* Edge Trigger Area - Swipe Right to Open */}
            <motion.div
                className="fixed top-0 left-0 h-full w-8 z-[100] bg-transparent"
                onPanEnd={(e, info) => {
                    if (info.offset.x > 50) {
                        setIsOpen(true);
                    }
                }}
            />

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-50"
                            onClick={toggleSidebar}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-white/10 z-50 flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">
                                    SWIPE<span className="text-red-500">NEWS</span>
                                </h2>
                                <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col p-4 gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(item.path)
                                            ? "bg-red-500/10 text-red-500"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
