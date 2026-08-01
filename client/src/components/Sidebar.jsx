import { useAuth } from "../context/AuthContext";
import Auth from "./Auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function Sidebar() {
  const { user, loading } = useAuth();
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
        setResult({ state: "success", categories });
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

  if (loading) return <aside className="sidebar" />; // avoid a flash of the login form before the token check resolves

  if (!user) {
    return (
      <aside className="sidebar">
        <p className="sidebar-intro">
          Login or create an account to get started.
        </p>
        <Auth />
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <p>Check posts by category</p>
      <ul>
        {result.categories.map((category) => (
          <li key={category.id}>
            <Link to={`/feed?categoryId=${category.id}`}>
              {category.category_name}
            </Link>
          </li>
        ))}
        <li>
          <Link to={`/feed`}>All Categories</Link>
        </li>
      </ul>
    </aside>
  );
}
