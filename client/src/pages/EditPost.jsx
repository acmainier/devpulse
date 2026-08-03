import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PostForm } from "../components/PostForm";

function EditPost() {
  const { user } = useAuth();
  const token = user ? localStorage.getItem("token") : null;
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(
    token
      ? { state: "loading" }
      : { state: "error", error: new Error("User not authenticated") },
  );

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:3001/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to get post ${id}`);
        return response.json();
      })
      .then((post) => setResult({ state: "success", post }))
      .catch((error) => setResult({ state: "error", error }));
  }, [id, token]);

  if (result.state === "loading") {
    return <div>Loading...</div>;
  }

  if (result.state === "error") {
    return <div>Error: {result.error.message}</div>;
  }

  if (!result.post) {
    return <div>Post not found!</div>;
  }

  const isUserPostOwner = user && result.post.user.id === user.id;

  if (!isUserPostOwner) {
    return <div>You do not have permission to edit this post.</div>;
  }

  const handleSubmit = (postData) => {
    if (!token) {
      return;
    }
    fetch(`http://localhost:3001/api/posts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      navigate(`/posts/${id}`);
    });
  };
  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm
        onSubmit={handleSubmit}
        initialValues={result.post}
        submitLabel="Update Post"
      />
    </div>
  );
}

export default EditPost;
