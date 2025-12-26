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
                handleLanguageChange
            }}
        >
            {children}
        </NewsContext.Provider>
    );
};
