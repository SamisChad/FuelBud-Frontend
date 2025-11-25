import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

// Firebase
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register mode
  const [isRegistering, setIsRegistering] = useState(false);

  // Registration fields
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  // Password validation
  const hasEight = regPass.length >= 8;
  const hasSpecial = /[@#$%&*]/.test(regPass);
  const passValid = hasEight && hasSpecial;

  // ---------- LOGIN ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("❌ " + error.message);
      console.error("Login error:", error);
    }
  };

  // Registration loading state
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);

  // ---------- REGISTER ----------
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate password before proceeding
    if (!passValid) {
      alert("❌ Please ensure your password meets all requirements.");
      return;
    }

    // Validate required fields
    if (!first.trim() || !last.trim() || !regEmail.trim() || !regPass.trim()) {
      alert("❌ Please fill in all fields.");
      return;
    }

    setIsRegisteringUser(true);
    
    try {
      // 1️⃣ Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        regEmail,
        regPass
      );
      const user = userCred.user;
      console.log("✅ Auth user created:", user.uid);

      // 2️⃣ Save additional user info to Firestore (completely non-blocking)
      // Use setTimeout to ensure this doesn't block navigation
      setTimeout(() => {
        setDoc(doc(db, "users", user.uid), {
          firstName: first.trim(),
          lastName: last.trim(),
          email: regEmail.trim(),
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
      setIsRegisteringUser(false);
      
      // 4️⃣ Navigate to dashboard with firstName in state (for immediate display)
      try {
        navigate("/dashboard", { 
          replace: true,
          state: { firstName: first.trim() }
        });
      } catch (navError) {
        console.error("Navigation error, using window.location:", navError);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setIsRegisteringUser(false); // Reset loading state on error
      let errorMessage = "Failed to create account. ";
      if (err.code === "auth/email-already-in-use") {
        errorMessage += "This email is already registered.";
      } else if (err.code === "auth/weak-password") {
        errorMessage += "Password is too weak.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage += "Invalid email address.";
      } else {
        errorMessage += err.message;
      }
      alert("❌ " + errorMessage);
      console.error("Register error:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/mercedes-bg.jpg"})`,
        backgroundSize: "80%",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "#000",
        width: "100vw",
      }}
    >
      <div className="overlay">
        <div className="login-box">
          {/* ================= REGISTER ================= */}
          {isRegistering ? (
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center glow-text">
                Create Account
              </h1>

              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  placeholder="First name"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  required
                />

                <input
                  type="text"
                  placeholder="Last name"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />

                {/* PASSWORD INPUT */}
                <input
                  type="password"
                  placeholder="Create a Password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  required
                />

                {/* PASSWORD REQUIREMENTS */}
                <div className="mt-3 space-y-2 text-sm">

                  {/* 8 character rule */}
                  <div className="flex items-center gap-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: hasEight ? 1 : 0.8 }}
                    >
                      {hasEight ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-400" />
                      )}
                    </motion.span>
                    <span className={hasEight ? "text-green-300" : "text-gray-300"}>
                      At least 8 characters
                    </span>
                  </div>

                  {/* Special character rule */}
                  <div className="flex items-center gap-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: hasSpecial ? 1 : 0.8 }}
                    >
                      {hasSpecial ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-400" />
                      )}
                    </motion.span>
                    <span className={hasSpecial ? "text-green-300" : "text-gray-300"}>
                      Contains special character (@#$%&*)
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!passValid || isRegisteringUser}
                  className={`mt-4 ${
                    passValid && !isRegisteringUser
                      ? "bg-blue-500 hover:bg-blue-400"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isRegisteringUser ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="text-gray-400 text-sm text-center mt-4">
                Already have an account?{" "}
                <span
                  onClick={() => setIsRegistering(false)}
                  className="text-blue-400 cursor-pointer hover:underline"
                >
                  Sign in
                </span>
              </p>
            </motion.div>
          ) : (
            /* ================= LOGIN ================= */
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center glow-text">
                Welcome to FuelBud
              </h1>

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

                <button type="submit">Sign In</button>
              </form>

              <p className="text-gray-400 text-sm text-center mt-4">
                Don't have an account?{" "}
                <span
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-400 cursor-pointer hover:underline"
                >
                  Create one
                </span>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
