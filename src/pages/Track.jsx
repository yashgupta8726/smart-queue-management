import { useEffect, useRef, useState } from "react";
import { getOrders } from "../services/orderService";

function Track() {
  const [orders, setOrders] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const prevRef = useRef({});

  const JALEBI_TIME_PER_KG = 5;
  const DAHI_TIME = 0;

  const speak = (text) => {
    if (!voiceEnabled) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);

    if (newState) speak("Voice enabled");
    else window.speechSynthesis.cancel();
  };

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

  const queue = orders
    .filter((o) => o.status !== "Completed")
    .sort((a, b) => a.token - b.token);

  const current = queue[0];
  const next = queue[1];

  const getOrderTime = (order) => {
    const jalebiKg = parseInt(order.jalebi?.match(/\d+/)?.[0] || 0);
    return jalebiKg * JALEBI_TIME_PER_KG + DAHI_TIME;
  };

  const getWaitingTime = (index) => {
    let total = 0;
    for (let i = 0; i < index; i++) {
      total += getOrderTime(queue[i]);
    }
    return total;
  };

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">

      {/* HEADER */}
      <div className={`${glass} p-6 text-center`}>
        <h1 className="text-3xl font-bold">📺 Live Queue Display</h1>

        <p className="text-gray-400 mt-1">
          Smart Order Tracking System
        </p>

        <button
          onClick={toggleVoice}
          className={`mt-3 px-4 py-2 rounded-lg font-bold ${
            voiceEnabled ? "bg-red-500" : "bg-green-500 text-black"
          }`}
        >
          🔊 {voiceEnabled ? "Disable Voice" : "Enable Voice"}
        </button>
      </div>

      {/* CURRENT + NEXT */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">

        {/* CURRENT */}
        <div className={`${glass} p-6 text-center`}>
          <h2 className="text-xl font-bold">🔴 Now Preparing</h2>

          {current ? (
            <>
              <div className="text-6xl font-bold text-orange-400 mt-3">
                #{current.token}
              </div>

              <p className="mt-2">👤 {current.customer}</p>

              <p className="text-green-400 mt-2 font-bold">
                ⏱ In Progress
              </p>
            </>
          ) : (
            <p className="text-gray-400 mt-4">No Active Orders</p>
          )}
        </div>

        {/* NEXT */}
        <div className={`${glass} p-6 text-center`}>
          <h2 className="text-xl font-bold">🟡 Be Ready</h2>

          {next ? (
            <>
              <div className="text-5xl font-bold text-yellow-400 mt-3">
                #{next.token}
              </div>

              <p className="mt-2">👤 {next.customer}</p>

              <p className="text-green-400 mt-2 font-bold">
                ⏱ Waiting: {getWaitingTime(1)} min
              </p>
            </>
          ) : (
            <p className="text-gray-400 mt-4">No Next Order</p>
          )}
        </div>
      </div>

      {/* QUEUE LIST */}
      <div className={`${glass} mt-6 p-4 md:p-6`}>
        <h2 className="text-2xl font-bold mb-4">📋 Live Queue</h2>

        {queue.length === 0 ? (
          <p className="text-gray-400">No Orders</p>
        ) : (
          <div className="space-y-3">

            {queue.map((order, index) => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row md:justify-between"
              >

                <div>
                  <h3 className="font-bold text-orange-300">
                    Token #{order.token}
                  </h3>

                  <p>👤 {order.customer}</p>

                  <p className="text-sm text-gray-400">
                    💳 {order.payment}
                  </p>

                  <p className="text-green-400 font-bold mt-1">
                    ⏱ Waiting Time: {getWaitingTime(index)} min
                  </p>
                </div>

                <div className="text-gray-300">
                  {order.jalebi && <p>🍯 {order.jalebi}</p>}
                  {order.dahi && <p>🥛 {order.dahi}</p>}
                </div>

                {/* ❌ STATUS REMOVED (IMPORTANT CHANGE) */}
              </div>
            ))}

          </div>
        )}
      </div>

      <p className="text-center mt-6 text-gray-500 text-sm">
        Please wait for your token number 🙏
      </p>
    </div>
  );
}

export default Track;