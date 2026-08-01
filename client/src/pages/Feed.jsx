import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Feed() {
  const { user } = useAuth();
  const token = user ? localStorage.getItem("token") : null;

  const [result, setResult] = useState(
    token
      ? { state: "loading" }
      : { state: "error", error: new Error("User not authenticated") },
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    fetch(`http://localhost:3001/api/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        return response.json();
      })
      .then((posts) => {
        setResult({ state: "success", posts });
      })
      .catch((error) => {
        setResult({ state: "error", error });
      });
  }, [token]);

  if (result.state === "loading") {
    return <div>Loading...</div>;
  }

  if (result.state === "error") {
    return <div>Error: {result.error.message}</div>;
  }

  if (result.posts.length === 0) {
    return <div>No posts yet!</div>;
  }

  return (
    <div>
      <h1>Feed</h1>
      <ul>
        {result.posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link> by{" "}
            {post.user.username} in
            {post.category.category_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feed;
