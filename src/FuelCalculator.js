import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function FuelCalculator() {
  // Mercedes models
  const MERCEDES_MODELS = [
    { id: "c_300", label: "C 300 Sedan" },
    { id: "e_350", label: "E 350 Sedan" },
    { id: "glc_300", label: "GLC 300 SUV" },
    { id: "gle_350", label: "GLE 350 SUV" },
  ];

  // UI + Form state
  const [selectedModel, setSelectedModel] = useState("c_300");
  const [distance, setDistance] = useState("");
  const [fuelUsed, setFuelUsed] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");

  // Animation + Result
  const [result, setResult] = useState(null);
  const [animatedMPG, setAnimatedMPG] = useState(0);
  const [animatedBaseMPG, setAnimatedBaseMPG] = useState(0);
  const [animatedCost, setAnimatedCost] = useState(0);
  const [loading, setLoading] = useState(false);

  // User greeting
  const [firstName, setFirstName] = useState("");

  // ---------------------- FETCH USER NAME ----------------------
  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setFirstName(snap.data().firstName);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    loadUser();
  }, []);

  // ---------------------- ANIMATION EFFECT ----------------------
  useEffect(() => {
    if (!result) return;

    let step = 0;
    const steps = 60;
    const duration = 1500;

    const incMPG = result.predicted_mpg / steps;
    const incBase = result.base_mpg / steps;
    const incCost = result.fuel_cost / steps;

    const interval = setInterval(() => {
      step++;

      setAnimatedMPG((prev) =>
        Math.min(prev + incMPG, result.predicted_mpg)
      );
      setAnimatedBaseMPG((prev) =>
        Math.min(prev + incBase, result.base_mpg)
      );
      setAnimatedCost((prev) =>
        Math.min(prev + incCost, result.fuel_cost)
      );

      if (step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [result]);

  // ---------------------- HANDLE CALCULATION ----------------------
  const handleCalculate = async () => {
    if (!distance || !fuelUsed || !fuelPrice) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      await new Promise((res) => setTimeout(res, 1500)); // AI effect

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: selectedModel,
          distance: Number(distance),
          fuel_used: Number(fuelUsed),
          fuel_price: Number(fuelPrice),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Backend not responding.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- UI ----------------------
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#030b17] text-white font-sans">
      
      {/* Greeting */}
      {firstName && (
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold mb-4 text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
        >
          Hello, {firstName} 👋
        </motion.h2>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 text-cyan-400 drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">
        Fuel Efficiency Calculator
      </h1>

      {/* Card */}
      <div className="w-[380px] p-8 bg-gradient-to-b from-[#0d1b2a] to-[#0a192f] rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.2)] border border-cyan-700">

        {/* Model Dropdown */}
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white border border-cyan-600 focus:ring-2 focus:ring-cyan-400"
        >
          {MERCEDES_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
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
          placeholder="Fuel Used (gallons)"
          value={fuelUsed}
          onChange={(e) => setFuelUsed(e.target.value)}
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
        >
          {loading ? (
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>
              Calculating...
            </motion.span>
          ) : (
            "Calculate"
          )}
        </button>

        {/* Go to Compare Page */}
      <div className="mt-4 flex justify-center">
        <Link
          to="/compare"
            className="px-6 py-2 rounded-lg font-semibold text-white
               bg-gradient-to-r from-blue-500 to-cyan-400
               hover:from-blue-400 hover:to-cyan-300
               shadow-lg hover:shadow-cyan-400/40
               transition-all duration-300"
  >
            Compare Two Models
          </Link>
        </div>


        {/* Result */}
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
  );
}
