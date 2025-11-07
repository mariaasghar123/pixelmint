"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUsers, FaThLarge } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, pixelsSold: 0, purchasedPixels: 0, });

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // ✅ Auth check
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/admin/login");
      return;
    }

    async function fetchStats() {
      const API_URL =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_API_URL
          : "http://localhost:3000";
      try {
        const userRes = await fetch(
          `${API_URL}/user/admin/users/count`
        );
        const pixelRes = await fetch(
          `${API_URL}/user/admin/pixels/sold`
        );
        const purchasesRes = await fetch(`${API_URL}/admin/total-sold`);

        const users = await userRes.json();
        const pixels = await pixelRes.json();
        const purchases = await purchasesRes.json();

        setStats({
          users: users.count,
          pixelsSold: pixels.total,
          purchasedPixels: purchases.totalPixels,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    fetchStats();
  }, [router]);
  // 🌀 Stylish Animated Loading Screen
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#001f1a] via-[#002d22] to-[#001915] text-white">
        <motion.div
          className="w-16 h-16 border-4 border-t-4 border-t-green-400 border-gray-700 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        ></motion.div>
        <motion.p
          className="mt-6 text-lg font-semibold tracking-wide text-green-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.2,
          }}
        >
          Loading...
        </motion.p>
      </div>
    );
  }


  // ✅ Don't render anything while checking auth
  // if (isCheckingAuth) {
  //   return (
  //     <div className="min-h-screen flex justify-center items-center bg-[#001f1a] text-white">
  //       <p className="text-lg">Loading...</p>
  //     </div>
  //   );
  // }

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
            <FaThLarge className="text-[#19f58a]" /> Total Reserved Pixels
          </h2>
          <p className="text-4xl font-extrabold mt-4 text-[#19f58a]">{stats.pixelsSold}</p>
        </motion.div>
        <motion.div
  whileHover={{ scale: 1.05 }}
  className="bg-[#053428]/70 border border-[#0a5c41] backdrop-blur-xl rounded-2xl shadow-lg p-6 hover:shadow-[#19f58a]/30 hover:shadow-lg transition"
>
  <h2 className="text-lg font-semibold">💰 Total Purchased Pixels</h2>
  <p className="text-4xl font-extrabold mt-4 text-[#19f58a]">
    {stats.purchasedPixels}
  </p>
</motion.div>


        {/* Example extra card for future stats */}
        {/* <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#053428]/70 border border-[#0a5c41] backdrop-blur-xl rounded-2xl shadow-lg p-6 hover:shadow-[#19f58a]/30 hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold">🟢 Active Ads</h2>
          <p className="text-4xl font-extrabold mt-4 text-gray-400">Coming Soon</p>
        </motion.div> */}
      </div>
    </div>
  );
}
