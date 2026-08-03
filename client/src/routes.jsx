import { Route, Routes } from "react-router-dom";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import Newpost from "./pages/Newpost";
import Post from "./pages/Post";
import Contact from "./pages/Contact";
import EditPost from "./pages/EditPost";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/posts/new" element={<Newpost />} />
      <Route path="/posts/edit/:id" element={<EditPost />} />
      <Route path="/posts/:id" element={<Post />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
