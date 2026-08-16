import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export function PostForm({ onSubmit, initialValues, submitLabel = "Create" }) {
  const { user, loading: authLoading } = useAuth();
  const token = user ? localStorage.getItem("token") : null;

  const {
    title: initialTitle = "",
    content: initialContent = "",
    categoryId: initialCategoryId,
  } = initialValues ?? {};

  const [categoryResult, setCategoryResult] = useState(
    authLoading || token
      ? { state: "loading" }
      : { state: "error", error: new Error("User not authenticated") },
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/categories`, {
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
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [categoryId, setCategoryId] = useState(
    initialCategoryId != null ? String(initialCategoryId) : "1",
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, categoryId });
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="pf-title">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="pf-content">
        <label htmlFor="content">Content:</label>
        <p className="hint">
          Tip: this field supports Markdown. Check{" "}
          <Link to="https://commonmark.org/help/">the Markdown guide</Link> for
          info; for syntax highlighting, wrap code in triple backticks with a
          language name (e.g. ```js) .
        </p>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div className="pf-category">
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
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
