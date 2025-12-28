import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, Bookmark, ShieldCheck, X, LogIn, UserPlus, LogOut, Clock, LayoutDashboard } from "lucide-react";
import { useNews } from "../context/NewsContext";
import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Sidebar() {
    const { isSidebarOpen, closeSidebar, openSidebar, user, logout } = useNews();
    const location = useLocation();
    const [publisherStatus, setPublisherStatus] = useState("none");

    useEffect(() => {
        if (user) {
            api.get(`/publisher/status/${user.id || user._id}`)
                .then(res => setPublisherStatus(res.data.status))
                .catch(err => console.error("Status fetch error", err));
        }
    }, [user, isSidebarOpen]); // Fetch when sidebar opens too in case updates happened

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: "/", label: "Home", icon: <Home size={24} /> },
        ...(user ? [
            { path: "/bookmarks", label: "Saved", icon: <Bookmark size={24} /> },
            ...(user.isPublisher ? [
                { path: "/publisher-dashboard", label: "Publisher Studio", icon: <LayoutDashboard size={24} className="text-red-500" /> }
            ] : [
                {
                    path: publisherStatus === "pending" ? "#" : "/publisher-guidelines",
                    label: publisherStatus === "pending" ? "Application Pending" : "Become Publisher",
                    icon: publisherStatus === "pending" ? <Clock size={24} className="text-yellow-500" /> : <ShieldCheck size={24} />,
                    disabled: publisherStatus === "pending"
                }
            ])
        ] : []),
    ];

    return (
        <>
            {/* Edge Trigger Area - Swipe Right to Open */}
            <motion.div
                className="fixed top-0 left-0 h-full w-12 z-[40] bg-transparent"
                onPanEnd={(e, info) => {
                    if (info.offset.x > 30) {
                        openSidebar();
                    }
                }}
            />

            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop - High Z-index and interactive */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                            onClick={closeSidebar}
                        />

                        {/* Sidebar Panel - Higher Z-index than backdrop */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }} // Smooth transition
                            className="fixed top-0 left-0 h-full w-full max-w-xs sm:w-80 bg-gray-900 border-r border-white/10 z-[150] flex flex-col shadow-2xl"
                        >
                            {/* Header Removed to prevent overlap with main Navbar */}
                            <div className="p-6 pt-8 flex flex-col gap-2">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-white tracking-wider">
                                        MENU
                                    </h2>
                                    <button onClick={closeSidebar} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={closeSidebar}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(item.path)
                                            ? "bg-red-500/10 text-red-500"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                ))}

                                {/* Divider */}
                                <div className="h-px bg-white/10 my-2 mx-3" />

                                {/* Auth Section */}
                                {user ? (
                                    <>
                                        <div className="px-3 py-2">
                                            <p className="text-sm text-gray-500">Logged in as</p>
                                            <p className="text-white font-bold truncate">@{user.username || user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                closeSidebar();
                                            }}
                                            className="flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
                                        >
                                            <LogOut size={24} />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={closeSidebar}
                                            className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <LogIn size={24} />
                                            <span className="font-medium">Log In</span>
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={closeSidebar}
                                            className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <UserPlus size={24} />
                                            <span className="font-medium">Sign Up</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
