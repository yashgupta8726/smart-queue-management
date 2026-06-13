import { useEffect, useMemo, useState } from "react";
import { getOrders } from "../services/orderService";

function Analytics() {
  const [orders, setOrders] = useState([]);
  const [range, setRange] = useState("week");

  useEffect(() => {
    const unsubscribe = getOrders(setOrders);
    return () => unsubscribe();
  }, []);

  const now = new Date();

  /* 📅 FILTER */
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.createdAt || Date.now());
      const diff = (now - d) / (1000 * 60 * 60 * 24);

      if (range === "week") return diff <= 7;
      if (range === "month") return diff <= 30;
      if (range === "6month") return diff <= 180;
      return diff <= 365;
    });
  }, [orders, range]);

  /* 💰 METRICS */
  const revenue = filtered.reduce(
    (s, o) => s + (o.grandTotal || 0),
    0
  );

  const completed = filtered.filter(
    (o) => o.status === "Completed"
  ).length;

  /* 📊 GROUP DATA */
  const chart = useMemo(() => {
    const map = {};

    filtered.forEach((o) => {
      const d = new Date(o.createdAt || Date.now());

      let key;
      if (range === "week") {
        key = d.toLocaleDateString("en-US", { weekday: "short" });
      } else if (range === "month") {
        key = d.getDate();
      } else {
        key = d.toLocaleDateString("en-US", { month: "short" });
      }

      map[key] = (map[key] || 0) + (o.grandTotal || 0);
    });

    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
    }));
  }, [filtered, range]);

  const max = Math.max(...chart.map((c) => c.value), 1);

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-5 md:p-10">

      {/* HEADER */}
      <div className={`${glass} p-6 text-center`}>
        <h1 className="text-3xl md:text-4xl font-bold">
          📊 Business Analytics
        </h1>
        <p className="text-gray-400 mt-1">
          Real-time Revenue Intelligence Dashboard
        </p>
      </div>

      {/* RANGE SELECT */}
      <div className="flex justify-center gap-3 mt-6 flex-wrap">

        {["week", "month", "6month", "year"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              range === r
                ? "bg-cyan-500 text-black"
                : "bg-white/10 text-white"
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <div className={`${glass} p-6`}>
          <p className="text-gray-400">Total Revenue</p>
          <h2 className="text-3xl font-bold text-green-400">
            ₹{revenue}
          </h2>
        </div>

        <div className={`${glass} p-6`}>
          <p className="text-gray-400">Orders</p>
          <h2 className="text-3xl font-bold text-blue-400">
            {filtered.length}
          </h2>
        </div>

        <div className={`${glass} p-6`}>
          <p className="text-gray-400">Completed</p>
          <h2 className="text-3xl font-bold text-yellow-400">
            {completed}
          </h2>
        </div>

      </div>

      {/* 🔥 PREMIUM GRAPH */}
      <div className={`${glass} mt-6 p-6`}>
        <h2 className="text-xl font-bold mb-5">
          📈 Revenue Performance
        </h2>

        <div className="flex items-end gap-3 h-64">

          {chart.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center flex-1 group"
            >

              {/* VALUE ON HOVER */}
              <div className="text-xs text-green-400 opacity-0 group-hover:opacity-100 transition">
                ₹{c.value}
              </div>

              {/* BAR */}
              <div
                className="w-full bg-white/10 rounded-xl relative overflow-hidden"
                style={{ height: "200px" }}
              >

                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-400 to-blue-600 rounded-xl transition-all duration-700"
                  style={{
                    height: `${(c.value / max) * 100}%`,
                  }}
                />
              </div>

              {/* LABEL */}
              <span className="text-xs mt-2 text-gray-400">
                {c.label}
              </span>

            </div>
          ))}

        </div>

      </div>

      {/* INSIGHTS */}
      <div className={`${glass} mt-6 p-6`}>
        <h2 className="text-xl font-bold mb-3">📌 Insights</h2>

        <div className="text-gray-300 space-y-2">

          <p>✔ Avg Order Value: ₹{(revenue / (filtered.length || 1)).toFixed(0)}</p>

          <p>
            ✔ Completion Rate:{" "}
            {filtered.length
              ? ((completed / filtered.length) * 100).toFixed(1)
              : 0}
            %
          </p>

          <p>✔ Best Performing Period: {range.toUpperCase()}</p>

        </div>
      </div>

      {/* FOOTER */}
      <p className="text-center mt-6 text-gray-500 text-sm">
        Built for Smart Queue System ⚡
      </p>

    </div>
  );
}

export default Analytics;