import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

function Analytics() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = getOrders(setOrders);
    return () => unsubscribe();
  }, []);

  const revenue = orders.reduce(
    (sum, o) => sum + (o.grandTotal || 0),
    0
  );

  const completed = orders.filter(
    (o) => o.status === "Completed"
  ).length;

  const pending = orders.filter(
    (o) => o.status !== "Completed"
  ).length;

  const totalOrders = orders.length;

  const jalebiCount = orders.filter((o) => o.jalebi).length;
  const dahiCount = orders.filter((o) => o.dahi).length;

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl";

  const card =
    "p-5 hover:scale-105 transition duration-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-10">

      {/* HEADER */}
      <div className={`${glass} p-6 text-center`}>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          📊 Analytics Dashboard
        </h1>
        <p className="text-gray-400 mt-1">
          Business Insights & Performance
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <div className={`${glass} ${card}`}>
          <p className="text-gray-400">Total Revenue</p>
          <h2 className="text-2xl font-bold text-green-400">
            ₹{revenue}
          </h2>
        </div>

        <div className={`${glass} ${card}`}>
          <p className="text-gray-400">Total Orders</p>
          <h2 className="text-2xl font-bold text-blue-400">
            {totalOrders}
          </h2>
        </div>

        <div className={`${glass} ${card}`}>
          <p className="text-gray-400">Pending Orders</p>
          <h2 className="text-2xl font-bold text-orange-400">
            {pending}
          </h2>
        </div>

        <div className={`${glass} ${card}`}>
          <p className="text-gray-400">Completed Orders</p>
          <h2 className="text-2xl font-bold text-green-300">
            {completed}
          </h2>
        </div>

        <div className={`${glass} ${card}`}>
          <p className="text-gray-400">Jalebi Orders</p>
          <h2 className="text-2xl font-bold text-yellow-300">
            {jalebiCount}
          </h2>
        </div>

        <div className={`${glass} ${card}`}>
          <p className="text-gray-400">Dahi Orders</p>
          <h2 className="text-2xl font-bold text-pink-300">
            {dahiCount}
          </h2>
        </div>

      </div>

      {/* INSIGHT BOX */}
      <div className={`${glass} p-6 mt-6`}>

        <h2 className="text-xl font-bold mb-2">
          📈 Business Insights
        </h2>

        <ul className="text-gray-300 space-y-2">

          <li>✔ Average Order Value: ₹{(revenue / (totalOrders || 1)).toFixed(0)}</li>

          <li>✔ Completion Rate: {totalOrders ? ((completed / totalOrders) * 100).toFixed(1) : 0}%</li>

          <li>✔ Most Sold Item: {jalebiCount >= dahiCount ? "🍯 Jalebi" : "🥛 Dahi"}</li>

        </ul>

      </div>

      {/* FOOTER */}
      <p className="text-center mt-6 text-gray-500 text-sm">
        Real-time analytics powered by Smart Queue System ⚡
      </p>

    </div>
  );
}

export default Analytics;