import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { NavLink } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showpass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again");
    }
  };
  return (
    <div className="login-container">
      <div className="aboutus-home">
        <NavLink to="/">
          <i className="bx bxs-home-alt-2"></i>
        </NavLink>{" "}
        | Login
      </div>
      <div className="enquiry-heading">
        {" "}
        <h2>Login</h2>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="login-form">
        <form onSubmit={handleLogin}>
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password: </label>
            <div className="password-container">
              <input
                type={showpass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={showpass ? "bx bx-hide" : "bx bx-show"}
                onClick={() => setShowPass(!showpass)}
              ></i>
            </div>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
