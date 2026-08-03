import { Nav } from "./Nav";
import "./Header.css";

export function Header() {
  return (
    <header>
      <div className="header-inner">
        <h1 className="h1-welcome">Welcome to DevPulse</h1>
        <Nav />
      </div>
    </header>
  );
}
