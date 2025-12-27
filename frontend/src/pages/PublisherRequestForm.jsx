import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNews } from "../context/NewsContext";
import api from "../utils/api";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

export default function PublisherRequestForm() {
    const navigate = useNavigate();
    const { user } = useNews();
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        aadhaarNumber: ""
    });
    const [status, setStatus] = useState("idle"); // idle, submitting, success, error
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!formData.fullName || !formData.phoneNumber || !formData.aadhaarNumber) {
            setError("All fields are required.");
            return;
        }

        setStatus("submitting");
        try {
            await api.post("/publisher/request", {
                userId: user.id || user._id, // Handle potential id inconsistencies
                email: user.email,
                ...formData
            });
            setStatus("success");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to submit application.");
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center">
                <CheckCircle size={64} className="text-green-500 mb-6" />
                <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    Your request to become a publisher is under review. You will be notified once the admin approves your application.
                </p>
                <button onClick={() => navigate("/")} className="text-red-500 font-bold">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold italic tracking-tighter">
                        PUBLISHER <span className="text-red-600">APPLICATION</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Verify your identity to start publishing news.
                    </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-500 text-xs font-bold flex items-center gap-2">
                                <AlertTriangle size={16} /> {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">Full Name</label>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="As per Aadhaar Card"
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">Phone Number</label>
                            <input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">Aadhaar Number</label>
                            <input
                                name="aadhaarNumber"
                                value={formData.aadhaarNumber}
                                onChange={handleChange}
                                placeholder="XXXX XXXX XXXX"
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                            />
                        </div>

                        <button
                            disabled={status === "submitting"}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mt-4 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {status === "submitting" ? "Submitting..." : "Submit Application"}
                            {!status === "submitting" && <ArrowRight size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
