import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Home page (placeholder)</h1>
      {user && <p>Logged in as {user.username}</p>}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Home;
