import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer-main">
      Made by the Dark Side devs. <Link to="/contact">Contact us</Link> for more
      information!
    </footer>
  );
}
