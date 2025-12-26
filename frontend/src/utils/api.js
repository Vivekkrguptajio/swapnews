import axios from "axios";

// Determine API URL based on environment
// For now, hardcode localhost if not in .env, or use relative if proxy setup
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
