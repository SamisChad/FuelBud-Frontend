import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./index.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="landing-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/mercedes-bg.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      {/* 🔹 Animated Sign In Button */}
      <motion.button
        className="landing-signin"
        onClick={() => navigate("/login")}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
      >
        Sign In
      </motion.button>

      {/* 🔹 Animated Footer */}
      <motion.footer
        className="landing-footer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.9 }}
      >
        <p>Mercedes Fleet • Efficiency • AI-Driven Insights</p>
      </motion.footer>
    </div>
  );
}
