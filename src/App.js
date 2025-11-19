import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./login";
import SignUp from "./signup";
import FuelCalculator from "./FuelCalculator";
import Landing from "./Landing";
import Chatbot from "./chatbot";
import Compare from "./Compare";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Landing */}
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Landing />
            </motion.div>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Login />
            </motion.div>
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <SignUp />
            </motion.div>
          }
        />

        {/* Fuel Calculator */}
        <Route
          path="/dashboard"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <FuelCalculator />
            </motion.div>
          }
        />

        {/* ⭐ Compare Page with animation */}
        <Route
          path="/compare"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Compare />
            </motion.div>
          }
        />

      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden">
        <header className="global-header">
          <Link to="/" className="global-logo">FuelBud</Link>
        </header>

        <AnimatedRoutes />

        <Chatbot />
      </div>
    </Router>
  );
}
