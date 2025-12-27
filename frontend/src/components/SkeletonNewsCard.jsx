export default function SkeletonNewsCard() {
    return (
        <div className="absolute inset-0 w-full h-full bg-zinc-900 animate-pulse">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-zinc-800/50" />

            {/* Gradient Overlays */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

            {/* Top Category Badge */}
            <div className="absolute top-3.5 left-4 z-50">
                <div className="h-6 w-20 bg-white/10 rounded-full" />
            </div>

            {/* Title & Source Placeholder (Top) */}
            <div className="absolute top-20 left-4 right-16 z-[25] flex flex-col gap-3">
                {/* Title Lines */}
                <div className="h-8 w-3/4 bg-white/10 rounded-md" />
                <div className="h-8 w-1/2 bg-white/10 rounded-md" />

                {/* Source Line */}
                <div className="h-4 w-1/3 bg-white/10 rounded-md mt-1" />
            </div>

            {/* Right Side Actions Placeholder */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-[20]">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 bg-white/10 rounded-full" />
                        <div className="w-8 h-2 bg-white/10 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Bottom Content Placeholder */}
            <div className="absolute left-0 bottom-0 w-full p-5 pb-24 z-[15] pr-16 bg-gradient-to-t from-black via-black/40 to-transparent">
                {/* Description Lines */}
                <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-white/10 rounded" />
                    <div className="h-4 w-5/6 bg-white/10 rounded" />
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="flex-1">
                        <div className="h-4 w-24 bg-white/10 rounded" />
                    </div>
                    <div className="h-8 w-20 bg-white/10 rounded-full" />
                </div>
            </div>
        </div>
    );
}
