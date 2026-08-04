import "./Home.css";
import devPulse from "../assets/images/devpulse2.jpg";

function Home() {
  return (
    <>
      <div className="welcome-area">
        <p>
          DevPulse is where developers write about the stuff that actually
          happened — the bug that ate your afternoon, the hook that finally
          clicked, the commit message you still cringe at. Browse the feed,
          dig in by topic, or share your own.
        </p>
      </div>
      <div className="card-area">
        <div className="left-card">
          <h3>Share what you learn</h3>
          <p>
            Write up the fix, the pattern, or the lesson while it's still
            fresh, with full Markdown and code highlighting.
          </p>
        </div>
        <div className="mid-card">
          <h3>Browse by topic</h3>
          <p>
            React, JavaScript, CSS, GitHub, jQuery — filter the feed to what
            you're working on right now.
          </p>
        </div>
        <div className="right-card">
          <h3>Talk it through</h3>
          <p>
            Comment, reply, and compare notes with other devs on any post.
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
