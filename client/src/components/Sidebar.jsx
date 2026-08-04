import { useAuth } from "../context/AuthContext";
import Auth from "./Auth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import "./Sidebar.css";

export function Sidebar() {
  const { user, loading: authLoading } = useAuth();
  const token = user ? localStorage.getItem("token") : null;
  const navigate = useNavigate();

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
        setCategoryResult({ state: "error", error });
      });
  }, [token]);

  if (authLoading) return <aside className="sidebar" />; // avoid a flash of the login form before the token check resolves

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

  if (categoryResult.state === "loading") {
    return <div>Categories are loading...</div>;
  }

  if (categoryResult.state === "error") {
    return (
      <div>Error retreiving categories: {categoryResult.error.message}</div>
    );
  }

  function onSearch(event) {
    event.preventDefault();
    const query = event.target[0].value;
    if (query) {
      navigate(`/feed?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <aside className="sidebar sidebar--authenticated">
      <p>Browse posts by category</p>
      <ul>
        {categoryResult.categories.map((category) => (
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
      <p>Search posts' titles</p>
      <form onSubmit={onSearch}>
        <input id="search" type="text" placeholder="Enter keywords..." />

        <button type="submit">Search</button>
      </form>
    </aside>
  );
}
