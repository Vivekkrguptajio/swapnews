import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Bookmarks from "./pages/Bookmarks";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublisherGuidelines from "./pages/PublisherGuidelines";
import PublisherRequestForm from "./pages/PublisherRequestForm";

import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/publisher-guidelines" element={<PublisherGuidelines />} />
        <Route path="/publisher-application" element={<PublisherRequestForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
