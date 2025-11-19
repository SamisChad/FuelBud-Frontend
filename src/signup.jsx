import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./index.css";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("✅ Account created successfully!");
        navigate("/login"); // redirect to login after signup
      } catch (error) {
        alert("❌ " + error.message);
        console.error("Signup error:", error);
      }
    };

return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/mercedes-bg.jpg"})`,
        backgroundSize: "80%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "#000",
      }}
    >
      <div className="overlay">
        <div className="login-box">
          <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center glow-text">
            Create Your FuelBud Account
          </h1>
          <p className="text-gray-400 mb-8 text-center">
            Sign up to track your Mercedes fuel efficiency
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </form>

          <p className="text-gray-400 text-center mt-6 text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#00bfff", cursor: "pointer" }}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

