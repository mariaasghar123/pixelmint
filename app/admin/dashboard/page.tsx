"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, pixelsSold: 0 });

  useEffect(() => {
    // ✅ Agar Admin Login nahi to Redirect back to login
    if (localStorage.getItem("isAdmin") !== "true") {
      router.push("/admin/login");
    }

    // ✅ Fetch data from API or Supabase
    async function fetchStats() {
      try {
        const userRes = await fetch("http://localhost:3000/user/admin/users/count"); // total users
        const pixelRes = await fetch("http://localhost:3000/user/admin/pixels/sold"); // total sold pixels

        const users = await userRes.json();
        const pixels = await pixelRes.json();

        setStats({ users: users.count, pixelsSold: pixels.total });
      } catch (error) {
        console.log(error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 mt-10">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl">👤 Total Users</h2>
          <p className="text-4xl font-bold mt-2">{stats.users}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl">📦 Total Sold Pixels</h2>
          <p className="text-4xl font-bold mt-2">{stats.pixelsSold}</p>
        </div>
      </div>
    </div>
  );
}
