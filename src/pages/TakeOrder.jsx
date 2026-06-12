import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

export default function TakeOrder() {
  const location = useLocation();
  const autoPrint = location.state?.autoPrint || false;

  const [name, setName] = useState("");
  const [payment, setPayment] = useState("CASH");

  const [jKg, setJKg] = useState(0);
  const [jG, setJG] = useState(0);
  const [dKg, setDKg] = useState(0);
  const [dG, setDG] = useState(0);

  const [totalJKg, setTotalJKg] = useState(0);
  const [totalJG, setTotalJG] = useState(0);
  const [totalDKg, setTotalDKg] = useState(0);
  const [totalDG, setTotalDG] = useState(0);

  const [tokenData, setTokenData] = useState(null);
  const slipRef = useRef();

  // ---------- ADD ----------
  const addJalebi = () => {
    if (jKg === 0 && jG === 0) return toast.error("Select Jalebi");
    setTotalJKg((p) => p + jKg);
    setTotalJG((p) => p + jG);
  };

  const addDahi = () => {
    if (dKg === 0 && dG === 0) return toast.error("Select Dahi");
    setTotalDKg((p) => p + dKg);
    setTotalDG((p) => p + dG);
  };

  // ---------- RESET ----------
  const resetJalebi = () => {
    setTotalJKg(0);
    setTotalJG(0);
    setJKg(0);
    setJG(0);
  };

  const resetDahi = () => {
    setTotalDKg(0);
    setTotalDG(0);
    setDKg(0);
    setDG(0);
  };

  // ---------- PRICES ----------
  const jalebiPrice =
    totalJKg * 120 + (totalJG / 1000) * 120;

  const dahiPrice =
    totalDKg * 100 + (totalDG / 1000) * 100;

  const grandTotal = jalebiPrice + dahiPrice;

  // ---------- TOKEN ----------
  const generateToken = async () => {
    const ref = doc(db, "counters", "ordersCounter");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, { value: 1 });
      return 1;
    }

    const current = snap.data().value;
    await updateDoc(ref, { value: current + 1 });

    return current + 1;
  };

  // ---------- ORDER ----------
  const handleOrder = async () => {
    if (!name) return toast.error("Enter name");

    const token = await generateToken();

    const order = {
      customer: name,
      payment,
      token,
      status: "Preparing",
      time: new Date().toLocaleTimeString(),
      grandTotal,
    };

    if (totalJKg > 0 || totalJG > 0) {
      order.jalebi = `${totalJKg} Kg ${totalJG} g`;
      order.jalebiPrice = jalebiPrice;
    }

    if (totalDKg > 0 || totalDG > 0) {
      order.dahi = `${totalDKg} Kg ${totalDG} g`;
      order.dahiPrice = dahiPrice;
    }

    await addDoc(collection(db, "orders"), order);

    setTokenData(order);
    toast.success("Order Placed!");

    if (autoPrint) setTimeout(() => window.print(), 700);
  };

  const card =
    "bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl border border-white/30";

  const btn =
    "px-3 py-2 rounded-lg font-semibold";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 flex justify-center p-4">

      <div className="w-full max-w-md space-y-4">

        {/* HEADER */}
        <div className={`${card} p-5 text-center`}>
          <h1 className="text-2xl font-bold">🍩 Smart Order System</h1>
        </div>

        {/* NAME */}
        <div className={`${card} p-4`}>
          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* PAYMENT */}
        <div className={`${card} p-4 flex gap-2`}>
          <button
            className={`${btn} w-full ${payment === "CASH" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            onClick={() => setPayment("CASH")}
          >
            Cash
          </button>

          <button
            className={`${btn} w-full ${payment === "ONLINE" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setPayment("ONLINE")}
          >
            Online
          </button>
        </div>

        {/* ITEMS */}
        <div className={`${card} p-4 space-y-4`}>

          {/* JALebi */}
          <div>
            <h2 className="font-bold">🍯 Jalebi (₹120/kg)</h2>

            <div className="flex gap-2 mt-2">
              <select className="w-1/2 border p-2 rounded"
                onChange={(e) => setJKg(Number(e.target.value))}>
                <option value={0}>Kg</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select className="w-1/2 border p-2 rounded"
                onChange={(e) => setJG(Number(e.target.value))}>
                <option value={0}>Gram</option>
                <option value={100}>100g</option>
                <option value={250}>250g</option>
                <option value={500}>500g</option>
                <option value={750}>750g</option>
              </select>
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={addJalebi} className="bg-green-500 text-white px-3 py-1 rounded">
                Add
              </button>
              <button onClick={resetJalebi} className="bg-red-500 text-white px-3 py-1 rounded">
                Reset
              </button>
            </div>
          </div>

          {/* DAHI */}
          <div>
            <h2 className="font-bold">🥛 Dahi (₹100/kg)</h2>

            <div className="flex gap-2 mt-2">
              <select className="w-1/2 border p-2 rounded"
                onChange={(e) => setDKg(Number(e.target.value))}>
                <option value={0}>Kg</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select className="w-1/2 border p-2 rounded"
                onChange={(e) => setDG(Number(e.target.value))}>
                <option value={0}>Gram</option>
                <option value={100}>100g</option>
                <option value={250}>250g</option>
                <option value={500}>500g</option>
                <option value={750}>750g</option>
              </select>
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={addDahi} className="bg-green-500 text-white px-3 py-1 rounded">
                Add
              </button>
              <button onClick={resetDahi} className="bg-red-500 text-white px-3 py-1 rounded">
                Reset
              </button>
            </div>
          </div>

        </div>

        {/* TOTAL */}
        <div className={`${card} p-4`}>
          <h2 className="font-bold text-lg">
            Total: ₹{grandTotal.toFixed(0)}
          </h2>
        </div>

        {/* ORDER BUTTON */}
        <button
          onClick={handleOrder}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 rounded-xl font-bold"
        >
          Place Order 🚀
        </button>

        {/* RECEIPT */}
        {tokenData && (
          <div ref={slipRef} className={`${card} p-4 mt-4`}>
            <h2 className="text-center font-bold">TOKEN #{tokenData.token}</h2>

            <p><b>Customer:</b> {tokenData.customer}</p>
            <p><b>Payment:</b> {tokenData.payment}</p>

            <hr className="my-2" />

            <h3 className="font-bold">Items:</h3>

            {tokenData.jalebi && (
              <p>🍯 Jalebi → {tokenData.jalebi} (₹{tokenData.jalebiPrice.toFixed(0)})</p>
            )}

            {tokenData.dahi && (
              <p>🥛 Dahi → {tokenData.dahi} (₹{tokenData.dahiPrice.toFixed(0)})</p>
            )}

            <hr className="my-2" />

            <h2 className="font-bold text-lg">
              Total: ₹{tokenData.grandTotal.toFixed(0)}
            </h2>

            <div className="flex justify-center mt-3">
              <QRCode value={window.location.origin + "/track"} size={100} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}