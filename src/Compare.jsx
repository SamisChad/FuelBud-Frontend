import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Compare() {
  const [modelA, setModelA] = useState("c_300");
  const [modelB, setModelB] = useState("e_350");
  const [distance, setDistance] = useState("");
  const [fuelUsed, setFuelUsed] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [result, setResult] = useState(null);

  const models = [
    { id: "c_300", name: "C 300 Sedan" },
    { id: "e_350", name: "E 350 Sedan" },
    { id: "glc_300", name: "GLC 300 SUV" },
    { id: "gle_350", name: "GLE 350 SUV" },
  ];

  const compare = async () => {
    if (!distance || !fuelUsed || !fuelPrice) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_a: modelA,
          model_b: modelB,
          distance: Number(distance),
          fuel_used: Number(fuelUsed),
          fuel_price: Number(fuelPrice),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Backend not responding.");
    }
  };

  return (
    <div className="flex w-full min-h-screen px-6 py-12 gap-10 justify-center items-start text-white overflow-y-auto">

      {/* LEFT — INPUT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0e1b2b]/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,255,0.2)] w-[380px]"
      >
        <h1 className="text-center text-3xl font-bold mb-6 neon-text">Compare Models</h1>

        {/* Model A */}
        <select
          value={modelA}
          onChange={(e) => setModelA(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-[#07111f] border border-cyan-400/40"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {/* Model B */}
        <select
          value={modelB}
          onChange={(e) => setModelB(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-[#07111f] border border-cyan-400/40"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {/* Inputs */}
        <input
          type="number"
          placeholder="Distance (miles)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-[#07111f] border border-cyan-400/40"
        />

        <input
          type="number"
          placeholder="Fuel Used (gallons)"
          value={fuelUsed}
          onChange={(e) => setFuelUsed(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-[#07111f] border border-cyan-400/40"
        />

        <input
          type="number"
          placeholder="Fuel Price ($)"
          value={fuelPrice}
          onChange={(e) => setFuelPrice(e.target.value)}
          className="w-full p-3 mb-6 rounded-xl bg-[#07111f] border border-cyan-400/40"
        />

        {/* Compare Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={compare}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-xl shadow-lg"
        >
          Compare
        </motion.button>
      </motion.div>

      {/* RIGHT — RESULTS PANEL */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0e1b2b]/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,255,0.2)] 
                     w-[420px] max-h-[80vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold mb-6 neon-text text-center">Results</h2>

          {/* Model A */}
<div className="mb-8 p-6 rounded-2xl bg-[#07111f]/70 border border-cyan-400/40 shadow-[0_0_25px_rgba(0,200,255,0.18)]">
  <h3 className="text-2xl font-bold mb-4 text-cyan-300">
    {result.model_a.model_display_name}
  </h3>

  <p className="text-lg mb-2">
    🚗 <b>MPG:</b> {result.model_a.predicted_mpg.toFixed(2)}
  </p>

  <p className="text-lg">
    ⛽ <b>Trip Cost:</b> ${result.model_a.trip_cost.toFixed(2)}
  </p>
</div>

          {/* Model B */}
<div className="mb-8 p-6 rounded-2xl bg-[#07111f]/70 border border-cyan-400/40 shadow-[0_0_25px_rgba(0,200,255,0.18)]">
  <h3 className="text-2xl font-bold mb-4 text-cyan-300">
    {result.model_b.model_display_name}
  </h3>

  <p className="text-lg mb-2">
    🚗 <b>MPG:</b> {result.model_b.predicted_mpg.toFixed(2)}
  </p>

  <p className="text-lg">
    ⛽ <b>Trip Cost:</b> ${result.model_b.trip_cost.toFixed(2)}
  </p>
</div>
          {/* AI Recommendation */}
<div className="p-6 rounded-2xl bg-[#002630]/80 border border-green-400/40 shadow-[0_0_25px_rgba(0,255,140,0.15)]">
  <h3 className="text-2xl font-bold text-green-300">AI Recommendation</h3>
  <p className="mt-4 text-lg leading-relaxed opacity-90">
    {result.ai_reason}
  </p>
</div>
        </motion.div>
      )}
    </div>
  );
}
