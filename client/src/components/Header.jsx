import { Link } from "react-router-dom";
import { Nav } from "./Nav";
import devPulse from "../assets/images/devpulse2.jpg";
import "./Header.css";

export function Header() {
  return (
    <header>
      <div className="header-inner">
        <Link to="/">
          <img src={devPulse} alt="DevPulse logo header image" className="welcome-banner" />
        </Link>
        <Nav />
      </div>
    </header>
  );
}
