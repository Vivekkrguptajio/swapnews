import { useState } from "react";
import { useNews } from "../context/NewsContext";
import BottomBar from "../components/BottomBar";
import api from "../utils/api";
import { Trash2, PlusCircle, X, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PublisherDashboard() {
    const { news, fetchNews, logout, user } = useNews();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        category: "General"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.imageUrl) return alert("Title and Image are required");

        try {
            await api.post("/news", formData);
            alert("News Added!");
            setShowForm(false);
            setFormData({ title: "", description: "", imageUrl: "", category: "General" });
            fetchNews();
        } catch (err) {
            alert("Error adding news");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this news?")) return;
        try {
            await api.delete(`/news/${id}`);
            fetchNews();
        } catch (err) {
            alert("Error deleting");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20 relative">
            <div className="p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="text-red-500" size={24} />
                    <h1 className="text-xl font-bold">Publisher Studio</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-red-500 font-bold text-sm bg-red-500/10 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors">
                        <PlusCircle size={18} /> Add News
                    </button>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Your News</h2>
                    <span className="text-xs text-gray-500">{news.length} Posts</span>
                </div>

                {news.map((item) => (
                    <div key={item._id} className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors">
                        <div className="flex gap-4 items-center overflow-hidden">
                            <img src={item.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-zinc-800" />
                            <div className="min-w-0">
                                <h3 className="font-bold text-sm truncate text-white">{item.title}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded font-bold uppercase">{item.category}</span>
                                    <span className="text-[10px] text-gray-500 py-0.5">Just now</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(item._id)} className="text-gray-500 hover:text-red-500 p-2 transition-colors">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add News Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-zinc-900 w-full max-w-md p-6 rounded-2xl border border-white/10 relative shadow-2xl">
                        <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-black italic tracking-tighter mb-6">ADD <span className="text-red-600">NEWS</span></h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                name="title"
                                placeholder="News Headline"
                                value={formData.title}
                                onChange={handleChange}
                                className="bg-black border border-zinc-700 p-4 rounded-xl text-white focus:outline-none focus:border-red-600 transition-colors font-bold"
                            />
                            <textarea
                                name="description"
                                placeholder="News Description..."
                                value={formData.description}
                                onChange={handleChange}
                                className="bg-black border border-zinc-700 p-4 rounded-xl text-white h-32 focus:outline-none focus:border-red-600 transition-colors resize-none"
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider ml-1">Image URL or Upload</label>
                                <div className="flex gap-2">
                                    <input
                                        name="imageUrl"
                                        placeholder="Paste Image URL"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className="bg-black border border-zinc-700 p-4 rounded-xl text-white focus:outline-none focus:border-red-600 transition-colors text-sm flex-1"
                                    />
                                    <label className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white p-4 rounded-xl cursor-pointer transition-colors flex items-center justify-center">
                                        <span className="text-xs font-bold uppercase">Upload</span>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>
                                {formData.imageUrl && (
                                    <div className="w-full h-32 rounded-xl overflow-hidden border border-zinc-800 mt-2">
                                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="bg-black border border-zinc-700 p-4 rounded-xl text-white focus:outline-none focus:border-red-600 transition-colors appearance-none"
                            >
                                <option value="General">General</option>
                                <option value="Tech">Tech</option>
                                <option value="Business">Business</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Sports">Sports</option>
                                <option value="Politics">Politics</option>
                            </select>
                            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-bold mt-2 uppercase tracking-wide transition-all active:scale-95 shadow-lg shadow-red-900/20">
                                Publish Now
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <BottomBar />
        </div>
    );
}
