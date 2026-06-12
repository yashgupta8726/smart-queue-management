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
import domtoimage from "dom-to-image-more";
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

  // ---------------- ADD ----------------
  const addJalebi = () => {
    if (jKg === 0 && jG === 0) return;

    setTotalJKg((p) => p + jKg);
    setTotalJG((p) => p + jG);
  };

  const resetJalebi = () => {
    setTotalJKg(0);
    setTotalJG(0);
  };

  const addDahi = () => {
    if (dKg === 0 && dG === 0) return;

    setTotalDKg((p) => p + dKg);
    setTotalDG((p) => p + dG);
  };

  const resetDahi = () => {
    setTotalDKg(0);
    setTotalDG(0);
  };

  // ---------------- CHECK SELECTED ----------------
  const jalebiSelected = totalJKg > 0 || totalJG > 0;
  const dahiSelected = totalDKg > 0 || totalDG > 0;

  // ---------------- PRICE ----------------
  const jalebiPrice = jalebiSelected
    ? totalJKg * 120 + (totalJG / 1000) * 120
    : 0;

  const dahiPrice = dahiSelected
    ? totalDKg * 100 + (totalDG / 1000) * 100
    : 0;

  const grandTotal = jalebiPrice + dahiPrice;

  // ---------------- TOKEN ----------------
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

  // ---------------- ORDER ----------------
  const handleOrder = async () => {
    if (!name) {
      toast.error("Enter name");
      return;
    }

    const token = await generateToken();

    const order = {
      customer: name,
      payment,
      token,
      status: "Preparing",
      time: new Date().toLocaleTimeString(),
      grandTotal,
    };

    if (jalebiSelected) {
      order.jalebi = `${totalJKg} Kg ${totalJG} g`;
      order.jalebiPrice = jalebiPrice;
    }

    if (dahiSelected) {
      order.dahi = `${totalDKg} Kg ${totalDG} g`;
      order.dahiPrice = dahiPrice;
    }

    await addDoc(collection(db, "orders"), order);

    setTokenData(order);
    toast.success("Order Placed");

    if (autoPrint) {
      setTimeout(() => window.print(), 700);
    }
  };

  // ---------------- DOWNLOAD ----------------
  const downloadToken = async () => {
    const img = await domtoimage.toPng(slipRef.current);
    const a = document.createElement("a");
    a.href = img;
    a.download = "token.png";
    a.click();
  };

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center p-6">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Place Your Order
        </h1>

        {/* NAME */}
        <input
          className="border p-3 w-full mt-5"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* PAYMENT */}
        <h2 className="mt-5 font-bold">Payment</h2>

        <div className="flex gap-3 mt-2">
          <button className="border px-5 py-2" onClick={() => setPayment("CASH")}>
            Cash
          </button>
          <button className="border px-5 py-2" onClick={() => setPayment("ONLINE")}>
            Online
          </button>
        </div>

        {/* JALEBI */}
        <h2 className="mt-5 font-bold">Jalebi ₹120/kg</h2>

        <div className="flex gap-2">
          <select
            className="border p-2 w-1/2"
            value={jKg}
            onChange={(e) => setJKg(Number(e.target.value))}
          >
            <option value={0}>Kg</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} Kg
              </option>
            ))}
          </select>

          <select
            className="border p-2 w-1/2"
            value={jG}
            onChange={(e) => setJG(Number(e.target.value))}
          >
            <option value={0}>Gram</option>
            <option value={100}>100g</option>
            <option value={250}>250g</option>
            <option value={500}>500g</option>
            <option value={750}>750g</option>
          </select>
        </div>

        <button className="bg-green-500 text-white px-3 mt-3" onClick={addJalebi}>
          Add Jalebi
        </button>

        <button className="bg-red-500 text-white px-3 ml-2" onClick={resetJalebi}>
          Reset
        </button>

        {/* DAHI */}
        <h2 className="mt-5 font-bold">Dahi ₹100/kg</h2>

        <div className="flex gap-2">
          <select
            className="border p-2 w-1/2"
            value={dKg}
            onChange={(e) => setDKg(Number(e.target.value))}
          >
            <option value={0}>Kg</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} Kg
              </option>
            ))}
          </select>

          <select
            className="border p-2 w-1/2"
            value={dG}
            onChange={(e) => setDG(Number(e.target.value))}
          >
            <option value={0}>Gram</option>
            <option value={100}>100g</option>
            <option value={250}>250g</option>
            <option value={500}>500g</option>
            <option value={750}>750g</option>
          </select>
        </div>

        <button className="bg-green-500 text-white px-3 mt-3" onClick={addDahi}>
          Add Dahi
        </button>

        <button className="bg-red-500 text-white px-3 ml-2" onClick={resetDahi}>
          Reset
        </button>

        {/* SUMMARY */}
        <h2 className="mt-5 font-bold">Order Summary</h2>

        <p>Jalebi: {jalebiSelected ? `${totalJKg} Kg ${totalJG} g` : "Not Selected"}</p>
        <p>Dahi: {dahiSelected ? `${totalDKg} Kg ${totalDG} g` : "Not Selected"}</p>

        {jalebiSelected && (
          <p>Jalebi Total: ₹{jalebiPrice.toFixed(0)}</p>
        )}

        {dahiSelected && (
          <p>Dahi Total: ₹{dahiPrice.toFixed(0)}</p>
        )}

        <h2 className="font-bold text-lg mt-2">
          Grand Total: ₹{grandTotal.toFixed(0)}
        </h2>

        <button
          className="bg-orange-500 text-white w-full mt-5 p-3 rounded"
          onClick={handleOrder}
        >
          Place Order
        </button>

        {/* RECEIPT */}
        {tokenData && (
          <div ref={slipRef} className="border mt-5 p-4">

            <h2 className="font-bold text-center">
              Token #{tokenData.token}
            </h2>

            <p>Customer: {tokenData.customer}</p>

            {tokenData.jalebi && <p>Jalebi: {tokenData.jalebi}</p>}
            {tokenData.dahi && <p>Dahi: {tokenData.dahi}</p>}

            {tokenData.jalebiPrice && (
              <p>Jalebi ₹: {tokenData.jalebiPrice}</p>
            )}

            {tokenData.dahiPrice && (
              <p>Dahi ₹: {tokenData.dahiPrice}</p>
            )}

            <p className="font-bold">
              Total: ₹{tokenData.grandTotal.toFixed(0)}
            </p>

            <div className="flex justify-center mt-4">
              <QRCode value={window.location.origin + "/track"} size={120} />
            </div>

            <button
              onClick={downloadToken}
              className="bg-green-600 text-white w-full mt-3 p-2"
            >
              Download Token
            </button>
          </div>
        )}

      </div>
    </div>
  );
}