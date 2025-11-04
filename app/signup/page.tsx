"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }
const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        username,
        email,
        phone,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Signup Successful! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMessage(data.error || "❌ Signup Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#002b23]">
      <div className="mb-6">
        <img src="/images/MyPixelMint1.svg" alt="Logo" className="w-28 mx-auto" />
      </div>

      <div className="bg-[#00302A4D] p-8 rounded-2xl shadow-lg w-full max-w-md border border-green-700">
        <h2 className="text-3xl font-custom text-white text-center mb-6">
          Create Wallet Account
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="bg-gray-800 p-3 rounded-lg text-white"
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Username"
            className="bg-gray-800 p-3 rounded-lg text-white"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="bg-gray-800 p-3 rounded-lg text-white"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="bg-gray-800 p-3 rounded-lg text-white"
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-gray-800 p-3 rounded-lg text-white"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="bg-gray-800 p-3 rounded-lg text-white"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="bg-green-500 hover:bg-green-600 transition-all font-semibold text-white py-2 rounded-lg"
          >
            Sign Up
          </button>

          {message && (
            <p
              className={`text-center text-sm ${
                message.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
