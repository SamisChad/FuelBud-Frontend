import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./index.css";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate required fields
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        alert("❌ Please fill in all fields.");
        return;
      }

      // Validate password
      if (password.length < 8 || !/[@#$%&*]/.test(password)) {
        alert("❌ Password must be at least 8 characters and contain a special character (@#$%&*).");
        return;
      }

      setIsCreating(true);
      
      try {
        // 1️⃣ Create Firebase Auth user
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        console.log("✅ Auth user created:", user.uid);

        // 2️⃣ Save additional user info to Firestore (completely non-blocking)
        // Use setTimeout to ensure this doesn't block navigation
        setTimeout(() => {
          setDoc(doc(db, "users", user.uid), {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            createdAt: new Date(),
          })
            .then(() => {
              console.log("✅ User data saved to Firestore");
            })
            .catch((firestoreError) => {
              console.error("Firestore error (non-blocking):", firestoreError);
              // Continue even if Firestore fails - user is still created in Auth
            });
        }, 0);

        // 3️⃣ Reset loading state immediately
        setIsCreating(false);
        
        // 4️⃣ Navigate to dashboard with firstName in state (for immediate display)
        try {
          navigate("/dashboard", { 
            replace: true,
            state: { firstName: firstName.trim() }
          });
        } catch (navError) {
          console.error("Navigation error, using window.location:", navError);
          window.location.href = "/dashboard";
        }
      } catch (error) {
        setIsCreating(false); // Reset loading state on error
        let errorMessage = "Failed to create account. ";
        if (error.code === "auth/email-already-in-use") {
          errorMessage += "This email is already registered.";
        } else if (error.code === "auth/weak-password") {
          errorMessage += "Password is too weak.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage += "Invalid email address.";
        } else {
          errorMessage += error.message;
        }
        alert("❌ " + errorMessage);
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
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password (min 8 chars, include @#$%&*)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={isCreating}>
              {isCreating ? "Creating Account..." : "Sign Up"}
            </button>
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

