import { useEffect, useRef, useState } from "react";
import { getOrders } from "../services/orderService";

function Track() {
  const [orders, setOrders] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const prevRef = useRef({});

  const TIME_PER_KG = 5; // 🍯 1kg = 5 min

  /* 🧠 EXTRACT KG FROM STRING */
  const getKg = (jalebi) => {
    if (!jalebi) return 0;

    let kg = 0;

    const kgMatch = jalebi.match(/(\d+)\s*Kg/i);
    const gMatch = jalebi.match(/(\d+)\s*g/i);

    if (kgMatch) kg += Number(kgMatch[1]);
    if (gMatch) kg += Number(gMatch[1]) / 1000;

    return kg;
  };

  /* ⏱ CORE QUEUE WAITING TIME */
  const getWaitingTime = (index) => {
    let totalMinutes = 0;

    for (let i = 0; i < index; i++) {
      const order = queue[i];
      const kg = getKg(order?.jalebi);
      totalMinutes += kg * TIME_PER_KG;
    }

    if (totalMinutes < 60) return `${totalMinutes} min`;

    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    return `${h}h ${m}m`;
  };

  /* 🔊 SPEAK */
  const speak = (text) => {
    if (!voiceEnabled) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  /* 🔘 VOICE TOGGLE */
  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);

    if (newState) speak("Voice enabled");
    else window.speechSynthesis.cancel();
  };

  /* 📡 LIVE DATA */
  useEffect(() => {
    const unsubscribe = getOrders((data) => {
      setOrders(data);

      const prev = prevRef.current;

      data.forEach((order) => {
        if (prev[order.id] && prev[order.id] !== order.status) {
          speak(`Token ${order.token} is ${order.status}`);
        }
      });

      const map = {};
      data.forEach((o) => (map[o.id] = o.status));
      prevRef.current = map;
    });

    return () => unsubscribe();
  }, [voiceEnabled]);

  /* 📊 QUEUE */
  const queue = orders
    .filter((o) => o.status !== "Completed")
    .sort((a, b) => a.token - b.token);

  const current = queue[0];

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">

      {/* HEADER */}
      <div className={`${glass} p-6 text-center`}>
        <h1 className="text-3xl font-extrabold">📺 Live Queue System</h1>

        <button
          onClick={toggleVoice}
          className={`mt-3 px-4 py-2 rounded-lg font-bold ${
            voiceEnabled ? "bg-red-500" : "bg-green-500 text-black"
          }`}
        >
          🔊 {voiceEnabled ? "Disable Voice" : "Enable Voice"}
        </button>
      </div>

      {/* CURRENT */}
      <div className={`${glass} p-6 mt-6 text-center`}>
        <h2 className="text-xl font-bold">🔴 Now Serving</h2>

        {current ? (
          <>
            <h1 className="text-5xl text-orange-400 font-bold">
              #{current.token}
            </h1>
            <p>👤 {current.customer}</p>
          </>
        ) : (
          <p>No Orders</p>
        )}
      </div>

      {/* QUEUE LIST */}
      <div className={`${glass} mt-6 p-5`}>
        <h2 className="text-xl font-bold mb-4">
          📋 Queue (Smart Waiting Time)
        </h2>

        {queue.map((order, index) => (
          <div
            key={order.id}
            className="flex justify-between p-4 border-b border-white/10"
          >
            <div>
              <p className="text-orange-300 font-bold">
                Token #{order.token}
              </p>
              <p className="text-gray-300">👤 {order.customer}</p>
              <p className="text-sm text-gray-400">
                🍯 {order.jalebi || "0"}
              </p>
            </div>

            {/* ⏱ FINAL WAITING TIME */}
            <div className="text-green-400 font-bold">
              ⏱ {index === 0 ? "In Progress" : getWaitingTime(index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Track;