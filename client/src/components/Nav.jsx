import { NavLink } from "react-router-dom";

export function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/feed">Feed</NavLink>
        </li>
        <li>
          <NavLink to="/newpost">New post</NavLink>
        </li>
      </ul>
    </nav>
  );
}
