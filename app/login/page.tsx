"use client";

import React, { useState } from "react";
import { Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false); // ✅ Show/Hide Login Form
  const router = useRouter();

const handleLogin = async () => {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok && data.access_token) {
    // ✅ Token Save
    localStorage.setItem("jwt", data.access_token); // <- key match karo dashboard ke saath
    localStorage.setItem("email", email);

    router.push("/dashboard");
  } else {
    setMessage(data.error || "Login failed ❌");
  }
};



  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 sm:px-6 md:px-0 bg-[#002b23]">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img
          src="/images/MyPixelMint1.svg"
          alt="Logo"
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 mx-auto"
        />
      </div>

      <div className="bg-[#00302A4D] border border-green-600 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-[540px] text-center">
        
        {/* 👇 Condition: Wallet Login OR Email Form */}
        {!showForm ? (
          <>
            {/* Wallet Image */}
            <div className="flex justify-center mb-5">
              <div className="p-3 rounded-full">
                <img src="/images/framer.png" alt="Wallet" className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>
            </div>

            {/* Headings */}
            <h2 className="text-base sm:text-lg md:text-xl mb-2 font-custom">
              Login with your crypto wallet
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mb-6">
              One Tap, No Passwords.
            </p>

            {/* Secure + Instant Section */}
            <div className="flex justify-center gap-6 mb-6 flex-wrap">
              <div className="flex flex-col items-center w-24 sm:w-auto">
                <div className="bg-[#98F08C1A] p-3 rounded-lg mb-1">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="currentColor" />
                </div>
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex flex-col items-center w-24 sm:w-auto">
                <div className="bg-[#98F08C1A] p-3 rounded-lg mb-1">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="currentColor" />
                </div>
                <span className="text-sm">Instant</span>
              </div>
            </div>

            {/* Connect Wallet Button */}
            <button
              className="w-full font-custom bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 text-black text-base sm:text-lg py-3 sm:py-4 rounded-lg transition-all"
            >
              Connect Wallet
            </button>

            {/* Login / Signup Toggle */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowForm(true)}
                className="text-xs sm:text-sm text-green-400 hover:underline"
              >
                Login with Email
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => router.push("/signup")}
                className="text-xs sm:text-sm text-green-400 hover:underline"
              >
                Signup
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ✅ Email/Password Login Form */}
            <h2 className="text-lg mb-4 font-custom">Login with Email</h2>

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-all"
            >
              Login
            </button>

            {message && <p className="mt-3 text-sm text-red-400">{message}</p>}

            {/* Back to Wallet */}
            <button
              onClick={() => setShowForm(false)}
              className="text-xs mt-4 text-gray-300 hover:underline"
            >
              ← Back to Wallet Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
