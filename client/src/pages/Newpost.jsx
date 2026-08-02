import { PostForm } from "../components/PostForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Newpost() {
  const { user } = useAuth();
  const token = user ? localStorage.getItem("token") : null;

  const navigate = useNavigate();

  const handleSubmit = (postData) => {
    if (!token) {
      return;
    }
    fetch("http://localhost:3001/api/posts", {
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
    <div>
      <h1>Create New Post</h1>
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Newpost;
