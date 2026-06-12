import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome Admin 🚀");
      navigate("/admin");
    } catch (err) {
      toast.error("Wrong Email or Password");
    }
  };

  const glass =
    "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl";

  const input =
    "w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400";

  const btn =
    "w-full p-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition active:scale-95";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-4">

      <div className={`${glass} w-full max-w-md p-8`}>

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">
            ⚡ Smart Queue System
          </h1>
          <p className="text-gray-400 mt-2">
            Admin Login Panel
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />

          <button type="submit" className={btn}>
            Login 🚀
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secure Firebase Authentication Enabled
        </p>

      </div>

    </div>
  );
}

export default Login;