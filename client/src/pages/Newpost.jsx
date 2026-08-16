import { PostForm } from "../components/PostForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Newpost.css";

function Newpost() {
  const { user } = useAuth();
  const token = user ? localStorage.getItem("token") : null;

  const navigate = useNavigate();

  const handleSubmit = (postData) => {
    if (!token) {
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      response.json().then((data) => {
        navigate(`/posts/${data.id}`); // Redirect to the newly created post
      });
    });
  };
  return (
    <div className="container">
      <h2>Create New Post</h2>
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Newpost;
