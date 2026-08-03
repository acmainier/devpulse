import { Nav } from "./Nav";
import devPulse from "../assets/images/devpulse2.jpg";
import "./Header.css";

export function Header() {
  return (
    <header>
      <div className="header-inner">
        <img src={devPulse} alt="DevPulse logo header image" className="welcome-banner" />
        <Nav />
      </div>
    </header>
  );
}
