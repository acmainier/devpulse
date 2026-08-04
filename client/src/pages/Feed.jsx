import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router";
import "./Feed.css";

function Feed() {
  const { user } = useAuth();
  const token = user ? localStorage.getItem("token") : null;

  const [result, setResult] = useState(
    token
      ? { state: "loading" }
      : { state: "error", error: new Error("User not authenticated") },
  );
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const searchQuery = searchParams.get("q");
  console.log("categoryId:", categoryId);

  useEffect(() => {
    if (!token) {
      return;
    }
    const postsUrl = new URL(`http://localhost:3001/api/posts`);
    if (categoryId) {
      postsUrl.searchParams.append("categoryId", categoryId);
    }
    if (searchQuery) {
      postsUrl.searchParams.append("q", searchQuery);
    }
    fetch(postsUrl, {
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
  }, [token, categoryId, searchQuery]);

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
    <div className="feed-area">
      <h2>Post Feed</h2>
      <ul>
        {categoryId && <li>Showing posts in category: {categoryId}</li>}
        {searchQuery && <li>Showing search results for: {searchQuery}</li>}
      </ul>
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
