import { Nav } from "./Nav";
import devPulse from "../assets/images/devpulse2.jpg";
import "./Header.css";

export function Header() {
  return (
    <header>
        <img src={devPulse} alt="DevPulse logo header image" className="welcome-banner" />
        <div className="header-inner">
            <Nav />
        </div>
    </header>
  );
}
