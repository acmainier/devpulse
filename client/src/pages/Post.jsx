import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Post() {
  const { user } = useAuth();
  const token = user ? localStorage.getItem("token") : null;
  const { id } = useParams();

  const [result, setResult] = useState(
    token
      ? { state: "loading" }
      : { state: "error", error: new Error("User not authenticated") },
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(`http://localhost:3001/api/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to get post ${id}`);
        }
        return response.json();
      })
      .then((post) => {
        setResult({ state: "success", post });
      })
      .catch((error) => {
        setResult({ state: "error", error });
      });
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

  return (
    <div>
      <h1>{result.post.title}</h1>
      <p>
        by {result.post.user.username} category:{" "}
        {result.post.category.category_name} on{" "}
        {new Date(result.post.createdAt).toLocaleDateString()}
      </p>
      <p>{result.post.content}</p>
    </div>
  );
}

export default Post;
