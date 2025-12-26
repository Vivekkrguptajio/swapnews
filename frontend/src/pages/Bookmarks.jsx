import { useNews } from "../context/NewsContext";
import BottomBar from "../components/BottomBar";
import { Trash2 } from "lucide-react";

export default function Bookmarks() {
    const { bookmarks, toggleBookmark } = useNews();

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <div className="p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
                <h1 className="text-xl font-bold">Saved Stories</h1>
            </div>

            <div className="p-4 flex flex-col gap-4">
                {bookmarks.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">No saved stories yet.</div>
                ) : (
                    bookmarks.map((item) => (
                        <div key={item._id} className="bg-gray-900 rounded-lg overflow-hidden flex shadow-lg border border-gray-800">
                            <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover" />
                            <div className="p-3 flex flex-col justify-between flex-1">
                                <h3 className="font-bold text-sm line-clamp-2">{item.title}</h3>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <button
                                        onClick={() => toggleBookmark(item)}
                                        className="text-red-500 p-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <BottomBar />
        </div>
    );
}
