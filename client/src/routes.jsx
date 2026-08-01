import { Route, Routes } from "react-router-dom";
import Feed from "./pages/Feed";
import Home from "./pages/Home";
import Newpost from "./pages/Newpost";
import Results from "./pages/Results";
import Post from "./pages/Post";
import Contact from "./pages/Contact";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/newpost" element={<Newpost />} />
      <Route path="/results" element={<Results />} />
      <Route path="/posts/:id" element={<Post />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
