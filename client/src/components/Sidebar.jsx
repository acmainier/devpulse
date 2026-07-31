import { useAuth } from "../context/AuthContext";
import Auth from "./Auth";

export function Sidebar() {
  const { user, loading } = useAuth();

  if (loading) return <aside className="sidebar" />; // avoid a flash of the login form before the token check resolves

  return (
    <aside className="sidebar">
      {user ? (
        <p>List of categories to filter posts (logged in users only)</p>
      ) : (
        <>
          <p className="sidebar-intro">
            Login or create an account to get started.
          </p>
          <Auth />
        </>
      )}
    </aside>
  );
}
