import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

function CompletedOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = getOrders(setOrders);
    return () => unsubscribe();
  }, []);

  const completed = orders.filter(
    (order) => order.status === "Completed"
  );

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-10">

      {/* HEADER */}
      <div className={`${glass} p-6 text-center`}>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          ✅ Completed Orders
        </h1>
        <p className="text-gray-400 mt-1">
          Order History Archive
        </p>
      </div>

      {/* EMPTY STATE */}
      {completed.length === 0 ? (
        <div className={`${glass} p-6 mt-6 text-center text-gray-400`}>
          No Completed Orders Yet 🚀
        </div>
      ) : (
        <div className="mt-6 space-y-4">

          {completed.map((order) => (
            <div
              key={order.id}
              className={`${glass} p-5 hover:shadow-cyan-500/20 transition`}
            >

              {/* TOP ROW */}
              <div className="flex justify-between items-center">

                <h2 className="text-lg font-bold text-green-400">
                  Token #{order.token}
                </h2>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-300 border border-green-400">
                  Completed
                </span>

              </div>

              {/* DETAILS */}
              <div className="mt-3 text-gray-300 space-y-1">

                <p>👤 {order.customer}</p>

                {order.jalebi && <p>🍯 {order.jalebi}</p>}
                {order.dahi && <p>🥛 {order.dahi}</p>}

                <p>💳 {order.payment}</p>

                <p className="text-green-300 font-bold mt-2">
                  💰 ₹{order.grandTotal}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default CompletedOrders;