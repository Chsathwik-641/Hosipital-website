import React, { useContext, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [reTypeConfirmPass, setReTypeConfrimPass] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showpass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleConfrimPass = (e) => {
    const retypedPass = e.target.value;
    setReTypeConfrimPass(retypedPass);

    if (password.startsWith(retypedPass)) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response from backend:", data);

      if (data.message) {
        alert(data.message);
        setUser({ email });
        navigate("/login");
      } else {
        alert("Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server error. Please try again.");
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="enquiry-container">
      <div className="aboutus-home">
        <NavLink to="/">
          <i className="bx bxs-home-alt-2"></i>
        </NavLink>{" "}
        | Register
      </div>
      <div className="enquiry-heading">
        {" "}
        <h2>Register</h2>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="login-form">
        <form onSubmit={handleRegister}>
          <div>
            {" "}
            <label>Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
          <div>
            {" "}
            <label>Retype Password: </label>
            <input
              type="password"
              value={reTypeConfirmPass}
              onChange={handleConfrimPass}
              required
            />
          </div>
          {!passwordMatch && reTypeConfirmPass.length > 0 && (
            <p style={{ color: "red" }}>Passwords do not match.</p>
          )}
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
