import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import {jwtDecode} from "jwt-decode";  
import txtLogo from "../../assets/logo/text-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;  // Get current time in seconds

        // Check if the token is expired
        if (decodedToken.exp > currentTime) {
          navigate("/home");  // Redirect to home if token is valid
        } else {
          localStorage.removeItem("token");  // Remove expired token
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");  // Remove invalid token
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save JWT token in localStorage
        localStorage.setItem("token", data.token);
  
        // Decode the token to extract userId and save it
        try {
          const decodedToken = jwtDecode(data.token);
          localStorage.setItem("userId", decodedToken.userId); // Replace 'userId' with the actual key in your token
        } catch (error) {
          console.error("Error decoding token:", error);
          setError("An error occurred while processing your login. Please try again.");
          return;
        }
  
        // Redirect to home page after successful login
        navigate("/home");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(`An error occurred while logging in. Please try again. ${err.message}`);
    }
  };
  

  return (
    <div className={styles.container}>
      <div>
        <img src={txtLogo} className={styles.txtLogo} />
      </div>
      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
