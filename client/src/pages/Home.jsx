import "./Home.css";
import devPulse from "../assets/images/devpulse2.jpg";

function Home() {
  return (
    <>
      <div className="welcome-area">
        <h1>Welcome to DevPulse</h1>
        <img
          src={devPulse}
          alt="DevPulse logo header image"
          className="welcome-banner"
        />
      </div>
      <div className="card-area">
        <div className="left-card">
          <h3>Title</h3>
          <p>Placeholder</p>
        </div>
        <div className="mid-card">
          <h3>Title</h3>
          <p>Placeholder</p>
        </div>
        <div className="right-card">
          <h3>Title</h3>
          <p>Placeholder</p>
        </div>
      </div>
    </>
  );
}

export default Home;
