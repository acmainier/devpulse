import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Nav.css";

export function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav>
      {user && (
        <div className="link-area">
          <ul className="nav-list">
            <li>
              <NavLink className="feed-button" to="/feed">Feed</NavLink>
            </li>
            <li>
              <NavLink className="feed-button" to="/posts/new">New post</NavLink>
            </li>
          </ul>
          <p className="p-text">Logged in as {user.username}</p>
          <button className="feed-button" onClick={handleLogout}>Log out</button>
        </div>
      )}
    </nav>
  );
}
