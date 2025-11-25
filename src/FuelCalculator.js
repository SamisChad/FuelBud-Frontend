import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";

export default function FuelCalculator() {
  const location = useLocation();

  // Mercedes models
  const MERCEDES_MODELS = [
    { id: "c_300", label: "C 300 Sedan" },
    { id: "e_350", label: "E 350 Sedan" },
    { id: "glc_300", label: "GLC 300 SUV" },
    { id: "gle_350", label: "GLE 350 SUV" },
  ];

  // UI State
  const [selectedModel, setSelectedModel] = useState("c_300");
  const [distance, setDistance] = useState("");
  const [speed, setSpeed] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");

  // Results / Animation
  const [result, setResult] = useState(null);
  const [animatedMPG, setAnimatedMPG] = useState(0);
  const [animatedBaseMPG, setAnimatedBaseMPG] = useState(0);
  const [animatedCost, setAnimatedCost] = useState(0);
  const [loading, setLoading] = useState(false);

  // Greeting
  const [firstName, setFirstName] = useState(location.state?.firstName || "");

  // ---------------------- FETCH USER NAME ----------------------
  useEffect(() => {
    if (location.state?.firstName) return;

    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) setFirstName(snap.data().firstName);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    loadUser();
  }, [location.state]);


  // ---------------------- ANIMATION ----------------------
  useEffect(() => {
    if (!result) {
      // Reset animated values when result is cleared
      setAnimatedMPG(0);
      setAnimatedBaseMPG(0);
      setAnimatedCost(0);
      return;
    }

    // Reset to 0 first, then animate
    setAnimatedMPG(0);
    setAnimatedBaseMPG(0);
    setAnimatedCost(0);

    let step = 0;
    const steps = 60;
    const duration = 1500;
    let intervalId = null;

    const incMPG = result.predicted_mpg / steps;
    const incBase = result.base_mpg / steps;
    const incCost = result.fuel_cost / steps;

    // Small delay to ensure reset happens first, then start animation
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        step++;
        setAnimatedMPG((prev) => Math.min(prev + incMPG, result.predicted_mpg));
        setAnimatedBaseMPG((prev) => Math.min(prev + incBase, result.base_mpg));
        setAnimatedCost((prev) => Math.min(prev + incCost, result.fuel_cost));
        if (step >= steps) {
          clearInterval(intervalId);
        }
      }, duration / steps);
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [result]);



  // ---------------------- MAIN FIX: SEND PROPER JSON ----------------------
  const handleCalculate = async () => {
    if (!distance || !speed || !fuelPrice) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      await new Promise((res) => setTimeout(res, 1500)); // UI animation

      const fuelUsed = Number(speed); // 🔥 TEMPORARY: treat speed input as fuel_used

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: selectedModel,     // ✔ backend requires this
          distance: Number(distance),    // ✔
          fuel_used: fuelUsed,           // ✔ backend requires fuel_used
          fuel_price: Number(fuelPrice)  // ✔
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      console.error("ERROR:", err);
      alert("❌ Cannot contact backend.\nMake sure FastAPI is running at 127.0.0.1:8000");
    }

    setLoading(false);
  };



  // ---------------------- UI ----------------------
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-white font-sans relative"
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
      <div className="overlay absolute inset-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col justify-center items-center w-full">

        {firstName && (
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold mb-8 glow-text"
          >
            Welcome, {firstName} 👋
          </motion.h2>
        )}

        <h1 className="text-4xl font-bold mb-8 text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          Fuel Efficiency Calculator
        </h1>

        {/* CARD */}
        <div
          className="w-[380px] p-8 bg-gradient-to-b from-[#0d1b2a] to-[#0a192f] rounded-2xl border border-cyan-700 relative"
          style={{ boxShadow: "0 0 30px rgba(0,255,255,0.2)" }}
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,255,255,0.15), transparent 70%)",
              filter: "blur(60px)",
              animation: "pulse 4s ease-in-out infinite",
            }}
          ></div>

          <div className="relative z-10">

            {/* Model Dropdown */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-cyan-600"
            >
              {MERCEDES_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>

            {/* Inputs */}
            <input
              type="number"
              placeholder="Distance (miles)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-cyan-600"
            />

            <input
              type="number"
              placeholder="Fuel Used (gallons)"   // 🔥 renamed to make sense
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-cyan-600"
            />

            <input
              type="number"
              placeholder="Fuel Price ($ per gallon)"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className="w-full p-3 mb-6 rounded-lg bg-gray-800 border border-cyan-600"
            />

            {/* Button */}
            <button
              onClick={handleCalculate}
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold transition-all duration-500 ${
                loading
                  ? "bg-blue-900 cursor-wait text-gray-300"
                  : "bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300"
              }`}
              style={!loading ? {
                boxShadow: "0 0 10px rgba(0, 200, 255, 0.3)",
                transition: "box-shadow 0.3s ease"
              } : {}}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 200, 255, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 200, 255, 0.3)";
                }
              }}
            >
              {loading ? (
                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                  Calculating...
                </motion.span>
              ) : (
                "Calculate"
              )}
            </button>

            {/* Compare Button */}
            <div className="mt-4 flex justify-center">
              <Link
                to="/compare"
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                style={{
                  boxShadow: "0 0 10px rgba(0, 200, 255, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 200, 255, 0.6), 0 0 40px rgba(0, 200, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 200, 255, 0.2)";
                }}
              >
                Compare Two Models
              </Link>
            </div>

            {/* RESULTS */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-600/30 to-cyan-400/20 border border-cyan-400/40"
              >
                <h3 className="text-xl font-semibold mb-3">
                  🤖 AI Prediction for {result.model_display_name}
                </h3>

                <p className="text-lg">
                  ⛽ <strong>Predicted MPG:</strong> {animatedMPG.toFixed(2)}
                </p>
                <p className="text-lg">
                  📊 <strong>Base MPG:</strong> {animatedBaseMPG.toFixed(2)}
                </p>
                <p className="text-lg">
                  💸 <strong>Fuel Cost:</strong> ${animatedCost.toFixed(2)}
                </p>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
