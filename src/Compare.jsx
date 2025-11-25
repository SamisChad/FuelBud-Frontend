import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Compare() {
  const [modelA, setModelA] = useState("c_300");
  const [modelB, setModelB] = useState("e_350");
  const [distance, setDistance] = useState("");
  const [fuelUsed, setFuelUsed] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [result, setResult] = useState(null);

  // Animated values
  const [animatedMPGA, setAnimatedMPGA] = useState(0);
  const [animatedCostA, setAnimatedCostA] = useState(0);
  const [animatedMPGB, setAnimatedMPGB] = useState(0);
  const [animatedCostB, setAnimatedCostB] = useState(0);

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

      if (!res.ok) {
        throw new Error(`Backend responded with status: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResult(data);
      // Reset animated values when new result comes in
      setAnimatedMPGA(0);
      setAnimatedCostA(0);
      setAnimatedMPGB(0);
      setAnimatedCostB(0);
    } catch (err) {
      console.error("Compare error:", err);
      let errorMessage = "Backend not responding.";
      
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        errorMessage = "Cannot connect to backend server. Please ensure the backend is running on http://127.0.0.1:8000";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`❌ ${errorMessage}\n\nCheck the browser console (F12) for more details.`);
    }
  };

  // ---------------------- ANIMATION EFFECT ----------------------
  useEffect(() => {
    if (!result) return;

    let step = 0;
    const steps = 60;
    const duration = 1500;

    const incMPGA = result.model_a.predicted_mpg / steps;
    const incCostA = result.model_a.trip_cost / steps;
    const incMPGB = result.model_b.predicted_mpg / steps;
    const incCostB = result.model_b.trip_cost / steps;

    const interval = setInterval(() => {
      step++;
      setAnimatedMPGA((prev) => Math.min(prev + incMPGA, result.model_a.predicted_mpg));
      setAnimatedCostA((prev) => Math.min(prev + incCostA, result.model_a.trip_cost));
      setAnimatedMPGB((prev) => Math.min(prev + incMPGB, result.model_b.predicted_mpg));
      setAnimatedCostB((prev) => Math.min(prev + incCostB, result.model_b.trip_cost));
      if (step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [result]);

  // Generate professional recommendation text
  const getRecommendationText = () => {
    if (!result) return "";
    
    const cheaperModel = result.model_a.trip_cost < result.model_b.trip_cost 
      ? result.model_a 
      : result.model_b;
    const expensiveModel = result.model_a.trip_cost >= result.model_b.trip_cost 
      ? result.model_a 
      : result.model_b;
    
    const savings = Math.abs(result.model_a.trip_cost - result.model_b.trip_cost);
    
    return `Mercefueler recommends the ${cheaperModel.model_display_name} over the ${expensiveModel.model_display_name} as it saves $${savings.toFixed(2)} on this trip.`;
  };

  return (
    <div 
      className="flex w-full min-h-screen px-6 py-12 gap-10 justify-center items-center text-white relative"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/mercedes-bg.jpg"})`,
        backgroundSize: "80%",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundColor: "#000",
      }}
    >
      {/* Overlay for blur and glow effects */}
      <div className="overlay absolute inset-0 pointer-events-none"></div>
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 flex gap-10 justify-center items-center">

      {/* LEFT — INPUT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0e1b2b]/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,255,0.2)] w-[380px] relative"
        style={{
          boxShadow: "0 0 40px rgba(0,200,255,0.2), 0 0 80px rgba(0,200,255,0.1)",
        }}
      >
        {/* Glowing effect from UI box */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(0, 200, 255, 0.15), transparent 70%)",
            filter: "blur(60px)",
            animation: "pulse 4s ease-in-out infinite",
            zIndex: 0,
          }}
        ></div>
        <div className="relative z-10">
        <h1 className="text-center text-3xl font-bold mb-6 glow-text">Compare Models</h1>

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
        </div>
      </motion.div>

      {/* RIGHT — RESULTS PANEL */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0e1b2b]/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(0,200,255,0.2)] 
                     w-[420px] max-h-[80vh] overflow-y-auto relative"
          style={{
            boxShadow: "0 0 40px rgba(0,200,255,0.2), 0 0 80px rgba(0,200,255,0.1)",
          }}
        >
          {/* Glowing effect from UI box */}
          <div 
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(0, 200, 255, 0.15), transparent 70%)",
              filter: "blur(60px)",
              animation: "pulse 4s ease-in-out infinite",
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6 glow-text text-center">Results</h2>

          {/* Model A */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 p-6 rounded-2xl bg-[#07111f]/70 border border-cyan-400/40 relative"
            style={{
              boxShadow: "0 0 25px rgba(0,200,255,0.3), 0 0 50px rgba(0,200,255,0.15)",
            }}
          >
            {/* Glowing effect from box */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(0, 200, 255, 0.1), transparent 70%)",
                filter: "blur(40px)",
                animation: "pulse 3s ease-in-out infinite",
                zIndex: 0,
              }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">
                {result.model_a.model_display_name}
              </h3>

              <p className="text-lg mb-2">
                🚗 <b>MPG:</b> {animatedMPGA.toFixed(2)}
              </p>

              <p className="text-lg">
                ⛽ <b>Trip Cost:</b> ${animatedCostA.toFixed(2)}
              </p>
            </div>
          </motion.div>

          {/* Model B */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 p-6 rounded-2xl bg-[#07111f]/70 border border-cyan-400/40 relative"
            style={{
              boxShadow: "0 0 25px rgba(0,200,255,0.3), 0 0 50px rgba(0,200,255,0.15)",
            }}
          >
            {/* Glowing effect from box */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(0, 200, 255, 0.1), transparent 70%)",
                filter: "blur(40px)",
                animation: "pulse 3s ease-in-out infinite",
                zIndex: 0,
              }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">
                {result.model_b.model_display_name}
              </h3>

              <p className="text-lg mb-2">
                🚗 <b>MPG:</b> {animatedMPGB.toFixed(2)}
              </p>

              <p className="text-lg">
                ⛽ <b>Trip Cost:</b> ${animatedCostB.toFixed(2)}
              </p>
            </div>
          </motion.div>
          
          {/* AI Recommendation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-2xl bg-[#002630]/80 border border-green-400/40 relative"
            style={{
              boxShadow: "0 0 25px rgba(0,255,140,0.3), 0 0 50px rgba(0,255,140,0.15)",
            }}
          >
            {/* Glowing effect from box */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(0, 255, 140, 0.1), transparent 70%)",
                filter: "blur(40px)",
                animation: "pulse 3s ease-in-out infinite",
                zIndex: 0,
              }}
            ></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-green-300 mb-4">AI Recommendation</h3>
              <p className="mt-4 text-lg leading-relaxed">
                {getRecommendationText()}
              </p>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
