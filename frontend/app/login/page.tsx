"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "login.php" : "register.php";

    try {
      const res = await fetch(
        `http://localhost/ai_saas/backend/routes/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        if (isLogin) {
          // ✅ LOGIN → go to dashboard
          localStorage.setItem("userEmail", email);
          router.push("/dashboard"); 
        } else {
          // ✅ REGISTER → switch to login
          alert("Registration successful. Please login.");
          setIsLogin(true);
          setPassword("");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-black text-white relative overflow-hidden">
      
      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[150px] rounded-full -top-32 -left-32"></div>
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/30 blur-[150px] rounded-full -bottom-32 -right-32"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold">
            KC
          </div>
          <div>
            <h1 className="text-xl font-semibold">KeshavCore AI</h1>
            <p className="text-xs text-gray-400">Upgrade to Pro SaaS UI</p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex bg-white/10 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-sm transition ${
              isLogin ? "bg-indigo-600" : "hover:bg-white/10"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-sm transition ${
              !isLogin ? "bg-indigo-600" : "hover:bg-white/10"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login to KeshavCore AI"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
