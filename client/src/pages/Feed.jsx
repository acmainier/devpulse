import { useEffect, useState } from "react";

function Feed() {
  const [result, setResult] = useState({ state: "loading" });

  useEffect(() => {
    fetch(`http://localhost:3001/api/posts`)
      .then((response) => response.json())
      .then((posts) => {
        setResult({ state: "success", posts });
      })
      .catch((error) => {
        setResult({ state: "error", error });
      });
  }, []);

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
            {post.title} by {post.user.username} in
            {post.category.category_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feed;
