import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNews } from "../context/NewsContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useNews();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await login(email, password);
        if (res.success) {
            if (res.user?.isAdmin) {
                navigate("/admin");
            } else if (res.user?.isPublisher) {
                navigate("/publisher-dashboard");
            } else {
                navigate("/");
            }
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-sm p-8 z-10 flex flex-col gap-6">
                {/* Logo */}
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-black italic tracking-tighter">
                        SWIPE<span className="text-red-600">NEWS</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Short news for the fast world.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-medium placeholder:text-gray-600"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-medium placeholder:text-gray-600"
                        />
                    </div>

                    <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-95 text-lg uppercase tracking-wide">
                        Log In
                    </button>
                </form>

                <div className="text-center text-gray-500 text-sm">
                    Don't have an account? <a href="/signup" className="text-white font-bold hover:underline">Sign Up</a>
                </div>
            </div>
        </div>
    );
}
