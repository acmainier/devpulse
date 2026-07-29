import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Auth() {
    const location = useLocation();

    // Starting mode follows the URL, signup opens register and login opens login
    const [mode, setMode] = useState(
        location.pathname.includes("signup") ? "register" : "login",
    );

    // Form Inputs using state
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // Redirects user after succesful submit

    const isRegister = mode === "register";

    // URL drives the selected state, it wont change even if user uses back and forward button
    useEffect(() => {
        setMode(location.pathname.includes("signup") ? "register" : "login");
    }, [location.pathname]);

    // Flips selected mode and updates the URL & the State
    const toggleMode = () => {
        const nextMode = isRegister ? "login" : "register";
        setMode(nextMode);
        setError("");
        navigate(nextMode === "register" ? "/signup" : "/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stops broswers default form behaviour
        setError("");

        try {
        const url = isRegister
            ? "http://localhost:3001/api/auth/register"
            : "http://localhost:3001/api/auth/login";

        // Login only needs email/password, Register also sends username
        const payload = isRegister
            ? { username, email, password }
            : { email, password };

        const response = await axios.post(url, payload);

        localStorage.setItem("token", response.data.token); // Keeps user logged in
        navigate("/");
        } catch (err) {
        setError(
            err.response?.data?.error || "Something went wrong. Please try again.",
        );
    }
};

    return (
        <form onSubmit={handleSubmit}>
        <h1>{isRegister ? "Sign Up" : "Log In"}</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {isRegister && (
            <div>
            <label>Username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
        )}

        <div>
            <label>Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div>
            <label>Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <button type="submit">{isRegister ? "Sign Up" : "Log In"}</button>

        <p>
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <button type="button" onClick={toggleMode}>
            {isRegister ? "Log In" : "Sign Up"}
            </button>
        </p>
        </form>
    );
}

export default Auth;
