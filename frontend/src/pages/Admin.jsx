import { useState, useEffect } from "react";
import { useNews } from "../context/NewsContext";
import BottomBar from "../components/BottomBar";
import api from "../utils/api";
import { Trash2, PlusCircle, X, LogOut, FileText, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
    const { news, fetchNews, logout, user } = useNews();
    const navigate = useNavigate();
    const [view, setView] = useState("news"); // 'news' or 'requests'
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        category: "General"
    });

    useEffect(() => {
        if (view === "requests") {
            fetchRequests();
        }
    }, [view]);

    const fetchRequests = async () => {
        try {
            const res = await api.get("/publisher/requests");
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/publisher/approve/${id}`);
            alert("Publisher Approved!");
            fetchRequests();
        } catch (err) {
            alert("Failed to approve");
        }
    };

    const handleReject = async (id) => {
        try {
            await api.put(`/publisher/reject/${id}`);
            alert("Publisher Rejected");
            fetchRequests();
        } catch (err) {
            alert("Failed to reject");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <div className="flex items-center gap-3">
                    {view === "news" && (user?.isAdmin || user?.isPublisher) && (
                        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-red-500 font-bold text-sm">
                            <PlusCircle size={20} /> Add
                        </button>
                    )}
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setView("news")}
                    className={`flex-1 p-3 text-sm font-bold ${view === "news" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"}`}
                >
                    News Manager
                </button>
                <button
                    onClick={() => setView("requests")}
                    className={`flex-1 p-3 text-sm font-bold ${view === "requests" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"}`}
                >
                    Publisher Requests
                </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
                {view === "news" ? (
                    news.map((item) => (
                        <div key={item._id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center">
                            <div className="flex gap-3 items-center overflow-hidden">
                                <img src={item.imageUrl} className="w-12 h-12 rounded object-cover" />
                                <div className="min-w-0">
                                    <h3 className="font-bold text-sm truncate">{item.title}</h3>
                                    <p className="text-xs text-gray-400">{item.category}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500 p-2">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col gap-4">
                        {requests.length === 0 && <p className="text-gray-500 text-center mt-10">No pending requests.</p>}
                        {requests.map((req) => (
                            <div key={req._id} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-base">{req.fullName}</h3>
                                        <p className="text-xs text-gray-400">{req.email} | {req.phoneNumber}</p>
                                        <p className="text-xs text-gray-500 mt-1">Aadhaar: {req.aadhaarNumber}</p>
                                    </div>
                                    <span className="bg-yellow-500/10 text-yellow-500 text-[10px] px-2 py-1 rounded border border-yellow-500/20 uppercase font-bold">
                                        {req.status}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleApprove(req._id)}
                                        className="flex-1 bg-green-600/20 text-green-500 py-2 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-green-600/30"
                                    >
                                        <CheckCircle size={14} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(req._id)}
                                        className="flex-1 bg-red-600/20 text-red-500 py-2 rounded text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-600/30"
                                    >
                                        <XCircle size={14} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add News Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-md p-6 rounded-xl border border-white/10 relative">
                        <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Add News</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white" />
                            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white h-24" />
                            <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white" />
                            <select name="category" value={formData.category} onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded text-white">
                                <option value="General">General</option>
                                <option value="Tech">Tech</option>
                                <option value="Business">Business</option>
                                <option value="Entertainment">Entertainment</option>
                            </select>
                            <button type="submit" className="bg-red-600 p-3 rounded font-bold mt-2">Publish</button>
                        </form>
                    </div>
                </div>
            )}

            <BottomBar />
        </div>
    );
}
