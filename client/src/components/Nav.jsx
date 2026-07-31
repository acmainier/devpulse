import { NavLink } from "react-router-dom";

export function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/feed">Feed</NavLink>
        </li>
        <li>Create a Post</li>
      </ul>
    </nav>
  );
}
