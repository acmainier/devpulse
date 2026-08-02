import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function PostForm({ onSubmit }) {
  const { user, loading: authLoading } = useAuth();
  const token = user ? localStorage.getItem("token") : null;

  const [categoryResult, setCategoryResult] = useState(
    authLoading || token
      ? { state: "loading" }
      : { state: "error", error: new Error("User not authenticated") },
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    fetch(`http://localhost:3001/api/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      })
      .then((categories) => {
        setCategoryResult({ state: "success", categories });
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategoryResult({ state: "error", error });
      });
  }, [token]);

  // Form Inputs using state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("1");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, categoryId });
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div>
        {categoryResult.state === "loading" && <p>Loading categories...</p>}
        {categoryResult.state === "error" && (
          <p>Error loading categories: {categoryResult.error.message}</p>
        )}
        {categoryResult.state === "success" && (
          <>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categoryResult.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <button type="submit">Create</button>
    </form>
  );
}
