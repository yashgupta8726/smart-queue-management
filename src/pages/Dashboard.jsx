import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, updateOrderStatus } from "../services/orderService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [autoPrint, setAutoPrint] = useState(false);

  useEffect(() => {
    const unsubscribe = getOrders((data) => setOrders(data));
    return () => unsubscribe();
  }, []);

  const revenue = orders.reduce(
    (sum, order) => sum + (order.grandTotal || 0),
    0
  );

  const completed = orders.filter((o) => o.status === "Completed").length;
  const pending = orders.filter((o) => o.status !== "Completed").length;

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl";

  const btn =
    "px-3 py-2 rounded-xl font-semibold transition transform hover:scale-105 active:scale-95";

  const badge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-bold";
    switch (status) {
      case "Preparing":
        return `${base} bg-yellow-500/20 text-yellow-300 border border-yellow-400`;
      case "Be Ready":
        return `${base} bg-blue-500/20 text-blue-300 border border-blue-400`;
      case "Take From Counter":
        return `${base} bg-purple-500/20 text-purple-300 border border-purple-400`;
      case "Completed":
        return `${base} bg-green-500/20 text-green-300 border border-green-400`;
      default:
        return `${base} bg-gray-500/20 text-gray-300 border border-gray-400`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">

      {/* HEADER */}
      <div className={`${glass} p-6 text-center`}>
        <h1 className="text-3xl font-extrabold">
          ⚡ Smart Queue Admin Panel
        </h1>
        <p className="text-gray-400 mt-1">
          Live Orders • Control System • Real-time Dashboard
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <div className={`${glass} p-5 hover:shadow-cyan-500/20`}>
          <h2 className="text-gray-400">Revenue</h2>
          <p className="text-2xl font-bold text-green-400">
            ₹{revenue}
          </p>
        </div>

        <div className={`${glass} p-5`}>
          <h2 className="text-gray-400">Completed</h2>
          <p className="text-2xl font-bold text-blue-400">
            {completed}
          </p>
        </div>

        <div className={`${glass} p-5`}>
          <h2 className="text-gray-400">Pending</h2>
          <p className="text-2xl font-bold text-orange-400">
            {pending}
          </p>
        </div>

      </div>

      {/* ACTIONS */}
      <div className={`${glass} mt-6 p-4 flex flex-wrap gap-3 justify-center`}>

        <button
          className={`${btn} bg-white text-black`}
          onClick={() => navigate("/analytics")}
        >
          📊 Analytics
        </button>

        <button
          className={`${btn} bg-gray-800 border border-white/30`}
          onClick={() => navigate("/completed")}
        >
          ✅ Completed
        </button>

        <button
          className={`${btn} bg-gradient-to-r from-cyan-500 to-blue-500`}
          onClick={() =>
            navigate("/take-order", { state: { autoPrint } })
          }
        >
          ➕ New Order
        </button>

      </div>

      {/* LIVE QUEUE */}
      <div className="mt-8">

        <h2 className="text-2xl font-bold mb-4">
          🔴 Live Queue
        </h2>

        {orders.filter((o) => o.status !== "Completed").length === 0 ? (
          <div className={`${glass} p-6 text-center text-gray-400`}>
            No Active Orders 🚀
          </div>
        ) : (
          orders
            .filter((o) => o.status !== "Completed")
            .sort((a, b) => a.token - b.token)
            .map((order) => (
              <div
                key={order.id}
                className={`${glass} p-5 mb-4 hover:shadow-cyan-500/20 transition`}
              >

                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg">
                    Token #{order.token}
                  </h2>

                  <span className={badge(order.status)}>
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-300 mt-2">
                  👤 {order.customer}
                </p>

                <p className="text-gray-300">
                  💳 {order.payment}
                </p>

                {order.jalebi && (
                  <p>🍯 {order.jalebi}</p>
                )}

                {order.dahi && (
                  <p>🥛 {order.dahi}</p>
                )}

                <p className="font-bold mt-2 text-green-400">
                  💰 ₹{order.grandTotal}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-2 mt-4">

                  <button
                    className="px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-400 text-yellow-300"
                    onClick={() =>
                      updateOrderStatus(order.id, "Preparing")
                    }
                  >
                    Preparing
                  </button>

                  <button
                    className="px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-400 text-blue-300"
                    onClick={() =>
                      updateOrderStatus(order.id, "Be Ready")
                    }
                  >
                    Ready
                  </button>

                  <button
                    className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-400 text-purple-300"
                    onClick={() =>
                      updateOrderStatus(order.id, "Take From Counter")
                    }
                  >
                    Counter
                  </button>

                  <button
                    className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-400 text-green-300"
                    onClick={() =>
                      updateOrderStatus(order.id, "Completed")
                    }
                  >
                    Done
                  </button>

                </div>

              </div>
            ))
        )}
      </div>

    </div>
  );
}