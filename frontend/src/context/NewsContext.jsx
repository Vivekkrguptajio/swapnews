import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const NewsContext = createContext();

export const useNews = () => useContext(NewsContext);

export const NewsProvider = ({ children }) => {
    const [news, setNews] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load bookmarks and likes from local storage on mount
    useEffect(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        const savedLikes = JSON.parse(localStorage.getItem("likes")) || [];
        setBookmarks(savedBookmarks);
        setLikes(savedLikes);
    }, []);

    // Fetch news from backend
    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await api.get("/news");
            setNews(response.data);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    // Toggle Bookmark
    const toggleBookmark = (newsItem) => {
        let updatedBookmarks;
        if (bookmarks.some((b) => b._id === newsItem._id)) {
            updatedBookmarks = bookmarks.filter((b) => b._id !== newsItem._id);
        } else {
            updatedBookmarks = [...bookmarks, newsItem];
        }
        setBookmarks(updatedBookmarks);
        localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    };

    const isBookmarked = (id) => bookmarks.some((b) => b._id === id);

    // Toggle Like
    const toggleLike = (newsItem) => {
        let updatedLikes;
        if (likes.some((l) => l._id === newsItem._id)) {
            updatedLikes = likes.filter((l) => l._id !== newsItem._id);
        } else {
            updatedLikes = [...likes, newsItem];
        }
        setLikes(updatedLikes);
        localStorage.setItem("likes", JSON.stringify(updatedLikes));
    };

    const isLiked = (id) => likes.some((l) => l._id === id);

    // Language State
    const [language, setLanguage] = useState("en");

    const handleLanguageChange = () => {
        setLanguage((prev) => (prev === "en" ? "hi" : "en"));
    };

    // Global Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Global Detail Panel State
    // Global Detail Panel State
    const [showDetail, setShowDetail] = useState(false);

    // Auth State
    const [user, setUser] = useState(null);

    // Check for logged in user on mount
    // Check for logged in user on mount and refresh data
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (token) {
            api.defaults.headers.common["Authorization"] = token;
            api.get("/auth/me")
                .then(res => {
                    setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                })
                .catch(err => {
                    console.error("Session expired or invalid", err);
                    logout();
                });
        }
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", { email, password });
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            setUser(data.user);
            return { success: true, user: data.user };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const register = async (username, email, password) => {
        try {
            await api.post("/auth/signup", { username, email, password });
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <NewsContext.Provider
            value={{
                news,
                bookmarks,
                likes,
                language,
                loading,
                fetchNews,
                toggleBookmark,
                isBookmarked,
                toggleLike,
                isLiked,
                handleLanguageChange,
                isSidebarOpen,
                openSidebar: () => setIsSidebarOpen(true),
                closeSidebar: () => setIsSidebarOpen(false),
                toggleSidebar: () => setIsSidebarOpen(prev => !prev),
                showDetail,
                setShowDetail,
                user,
                login,
                register,
                logout
            }}
        >
            {children}
        </NewsContext.Provider>
    );
};
