import { useNews } from "../context/NewsContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
    const { isSidebarOpen, closeSidebar, openSidebar } = useNews();

    // We'll use CSS hidden/block for responsiveness to avoid hydration mismatches if possible, 
    // but for specific logic we might need media queries.

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden bg-zinc-950 text-white font-sans">
            {/* Desktop Sidebar (Fixed Left) */}
            <div className="hidden md:flex w-64 lg:w-72 shrink-0 border-r border-white/10 flex-col bg-zinc-900/50 backdrop-blur-xl">
                <Sidebar variant="desktop" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative h-full w-full flex flex-col">
                {/* Mobile Navbar (Hidden on Desktop usually, or kept as top bar) */}
                <div className="md:hidden z-50">
                    <Navbar />
                </div>

                {/* Content */}
                <main className="flex-1 relative w-full h-full overflow-hidden">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Drawer (Overlay) */}
            <div className="md:hidden">
                <Sidebar variant="mobile" />
            </div>
        </div>
    );
}
