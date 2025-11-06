"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUsers, FaThLarge } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, pixelsSold: 0 });

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("isAdmin") !== "true") {
      router.push("/admin/login");
    }

    async function fetchStats() {
      try {
        const userRes = await fetch("https://pixelmint-backend.onrender.com/user/admin/users/count");
        const pixelRes = await fetch("https://pixelmint-backend.onrender.com/user/admin/pixels/sold");
        const users = await userRes.json();
        const pixels = await pixelRes.json();
        setStats({ users: users.count, pixelsSold: pixels.total });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f1a] via-[#002d22] to-[#001915] text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-wide">📊 Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            router.push("/admin/login");
          }}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mt-10 mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#053428]/70 border border-[#0a5c41] backdrop-blur-xl rounded-2xl shadow-lg p-6 hover:shadow-[#19f58a]/30 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaUsers className="text-[#19f58a]" /> Total Users
            </h2>
          </div>
          <p className="text-4xl font-extrabold mt-4 text-[#19f58a]">{stats.users}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#053428]/70 border border-[#0a5c41] backdrop-blur-xl rounded-2xl shadow-lg p-6 hover:shadow-[#19f58a]/30 hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaThLarge className="text-[#19f58a]" /> Total Sold Pixels
          </h2>
          <p className="text-4xl font-extrabold mt-4 text-[#19f58a]">{stats.pixelsSold}</p>
        </motion.div>

        {/* Example extra card for future stats */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#053428]/70 border border-[#0a5c41] backdrop-blur-xl rounded-2xl shadow-lg p-6 hover:shadow-[#19f58a]/30 hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold">🟢 Active Ads</h2>
          <p className="text-4xl font-extrabold mt-4 text-gray-400">Coming Soon</p>
        </motion.div>
      </div>
    </div>
  );
}
