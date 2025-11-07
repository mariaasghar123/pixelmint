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
    setError("");

    try {
      const res = await fetch("https://pixelmint-backend.onrender.com/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminToken", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "❌ Invalid email or password");
      }
    } catch (err) {
      setError("⚠️ Server error, please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#002b23] px-4">
      {/* Logo Section */}
      <div className="mb-8">
        <img
          src="/images/MyPixelMint1.svg"
          alt="Logo"
          className="w-28 mx-auto"
        />
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="bg-[#00302A4D] p-8 rounded-2xl shadow-lg w-full max-w-md border border-green-700"
      >
        <h2 className="text-3xl font-custom text-white text-center mb-6">
          Admin Login
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="bg-gray-800 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-gray-800 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 transition-all font-semibold text-white py-2 rounded-lg"
          >
            Login
          </button>

          {error && (
            <p
              className={`text-center text-sm ${
                error.includes("❌") || error.includes("⚠️")
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {error}
            </p>
          )}
        </div>
      </form>

      {/* Footer or Back Link */}
      <p className="text-gray-400 text-sm mt-6">
        Not an admin?{" "}
        <span
          className="text-green-400 hover:underline cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Go to User Login
        </span>
      </p>
    </div>
  );
}
