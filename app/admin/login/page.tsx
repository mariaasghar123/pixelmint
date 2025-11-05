"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("https://pixelmint-backend.onrender.com/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save token or admin status
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminToken", data.token); // Optional if JWT is sent
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-2 mb-3 rounded bg-gray-700"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-gray-700"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-500 p-2 rounded hover:bg-green-600">Login</button>
      </form>
    </div>
  );
}
