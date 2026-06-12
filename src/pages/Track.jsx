import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

function Track() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = getOrders((data) => setOrders(data));
    return () => unsubscribe();
  }, []);

  const queue = orders
    .filter((order) => order.status !== "Completed")
    .sort((a, b) => a.token - b.token);

  const current = queue[0];
  const next = queue[1];

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">

      {/* HEADER */}
      <div className={`${glass} p-6 text-center`}>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          📺 Live Queue Display
        </h1>
        <p className="text-gray-400 mt-1">
          Smart Order Tracking System
        </p>
      </div>

      {/* CURRENT + NEXT */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">

        {/* CURRENT */}
        <div className={`${glass} p-6 text-center`}>

          <h2 className="text-xl font-bold text-gray-300">
            🔴 Now Preparing
          </h2>

          {current ? (
            <>
              <div className="text-6xl md:text-7xl font-extrabold text-orange-400 mt-4">
                #{current.token}
              </div>

              <p className="mt-3 text-gray-300">
                👤 {current.customer}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Status: {current.status}
              </p>
            </>
          ) : (
            <p className="mt-4 text-gray-400">No Active Orders</p>
          )}

        </div>

        {/* NEXT */}
        <div className={`${glass} p-6 text-center`}>

          <h2 className="text-xl font-bold text-gray-300">
            🟡 Be Ready
          </h2>

          {next ? (
            <>
              <div className="text-5xl md:text-6xl font-extrabold text-yellow-400 mt-4">
                #{next.token}
              </div>

              <p className="mt-3 text-gray-300">
                👤 {next.customer}
              </p>
            </>
          ) : (
            <p className="mt-4 text-gray-400">No Next Order</p>
          )}

        </div>

      </div>

      {/* QUEUE LIST */}
      <div className={`${glass} mt-6 p-4 md:p-6`}>

        <h2 className="text-2xl font-bold mb-4">
          📋 Live Queue
        </h2>

        {queue.length === 0 ? (
          <p className="text-gray-400">No Orders</p>
        ) : (
          <div className="space-y-3">

            {queue.map((order) => (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center hover:bg-white/10 transition"
              >

                <div>
                  <h3 className="font-bold text-lg text-orange-300">
                    Token #{order.token}
                  </h3>

                  <p className="text-gray-300">
                    👤 {order.customer}
                  </p>

                  <p className="text-sm text-gray-400">
                    💳 {order.payment}
                  </p>
                </div>

                <div className="text-sm mt-2 md:mt-0 text-gray-300">
                  {order.jalebi && <p>🍯 {order.jalebi}</p>}
                  {order.dahi && <p>🥛 {order.dahi}</p>}
                </div>

                <div className="mt-2 md:mt-0">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-400">
                    {order.status}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* FOOTER */}
      <p className="text-center mt-6 text-gray-500 text-sm">
        Please wait for your token number 🙏
      </p>

    </div>
  );
}

export default Track;