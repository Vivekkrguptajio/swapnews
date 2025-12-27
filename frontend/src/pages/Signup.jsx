import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNews } from "../context/NewsContext";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { register } = useNews();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const res = await register(username, email, password);
        if (res.success) {
            navigate("/login");
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-sm p-8 z-10 flex flex-col gap-6">
                {/* Logo */}
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-black italic tracking-tighter">
                        SWIPE<span className="text-red-600">NEWS</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Join the revolution.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-gray-500 tracking-wider ml-1">Username</label>
                        <input
                            type="text"
                            placeholder="@username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-medium placeholder:text-gray-600"
                        />
                    </div>

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

                    <button className="mt-4 w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 text-lg uppercase tracking-wide">
                        Create Account
                    </button>
                </form>

                <div className="text-center text-gray-500 text-sm">
                    Already have an account? <a href="/login" className="text-white font-bold hover:underline">Log In</a>
                </div>
            </div>
        </div>
    );
}
