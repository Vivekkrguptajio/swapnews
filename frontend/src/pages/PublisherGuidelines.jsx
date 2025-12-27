import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function PublisherGuidelines() {
    const navigate = useNavigate();

    const guidelines = [
        "Content must be original and not copied from other sources without credit.",
        "Ensure all news is fact-checked and accurate before publishing.",
        "Do not publish hate speech, violence, or explicit content.",
        "Images must be high-quality and relevant to the news topic.",
        "Keep headlines concise and engaging (Clickbait is allowed but don't mislead).",
        "Select the correct category for your news to reach the right audience.",
        "Respect copyright laws; do not use watermarked images from other brands.",
        "You are responsible for the engagement and comments on your posts.",
        "Spamming duplicate news is strictly prohibited.",
        "Violation of these rules may lead to permanent suspension of your publisher status."
    ];

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl w-full z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black italic tracking-tighter mb-4">
                        BECOME A <span className="text-red-600">PUBLISHER</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Before you start your journey, here are 10 golden rules you must know.
                    </p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl mb-8">
                    <div className="flex items-center gap-3 mb-6 text-yellow-500">
                        <AlertTriangle size={28} />
                        <h2 className="text-xl font-bold uppercase tracking-wide">Publisher Guidelines</h2>
                    </div>

                    <ul className="space-y-4">
                        {guidelines.map((rule, index) => (
                            <li key={index} className="flex gap-4 items-start text-gray-300">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-xs mt-0.5">
                                    {index + 1}
                                </span>
                                <span className="leading-relaxed">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/publisher-application")}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-95 text-lg uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                        <span>I Understand, Let's Publish</span>
                        <CheckCircle size={20} />
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                    >
                        Cancel and Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
