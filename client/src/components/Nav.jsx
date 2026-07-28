import { NavLink } from "react-router-dom";

export function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/feed">Feed</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
        <li>
          <NavLink to="/signup">Signup</NavLink>
        </li>
      </ul>
    </nav>
  );
}
