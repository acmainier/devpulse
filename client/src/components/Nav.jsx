import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <div>
          <ul>
            <li>
              <NavLink to="/feed">Feed</NavLink>
            </li>
            <li>
              <NavLink to="/newpost">New post</NavLink>
            </li>
          </ul>
          <p>Logged in as {user.username}</p>
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </nav>
  );
}
