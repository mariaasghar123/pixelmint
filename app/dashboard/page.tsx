"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";
// import { Link } from "lucide-react";
import Link from "next/link";

interface User {
  full_name: string;
  email: string;
  username: string;
  phone?: string;
  pixelsBought?: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pixels, setPixels] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return router.push("/login");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return router.push("/login");
      const data = await res.json();
      setUser(data);

      // ✅ Now fetch user's pixels
    const pixelRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pixels/my-pixels`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pixelData = await pixelRes.json();
    setPixels(pixelData); // Save pixels from DB ✅
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/login");
  };

  if (loading)
    return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#013220] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="relative">
        {/* Hamburger button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-4 left-4 text-white z-50 bg-black/40 p-2 rounded-lg backdrop-blur-md"
        >
          ☰
        </button>

        <aside
          className={`fixed md:static top-0 left-0 h-full w-64 bg-[#013220]/90 backdrop-blur-md border-r border-gray-700 
          p-6 flex flex-col text-white shadow-xl transform transition-transform duration-300 z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <img
            src="/images/MyPixelMint1.svg"
            className="w-20 mx-auto hover:scale-110 transition-transform duration-300"
          />

          <div className="bg-white/10 p-4 rounded-xl text-center mt-6 shadow-lg hover:shadow-xl transition-all">
            <img
              src="/images/card.png"
              className="w-16 h-16 rounded-full border-2 border-[#00ff88] mx-auto shadow-md"
            />
            <h2 className="text-lg font-bold mt-2">{user?.full_name}</h2>
          </div>

          <nav className="mt-6 flex flex-col gap-3">
            {[
              { label: "👤 Profile", click: () => setShowProfile(true) },
              { label: "🎨 Your Pixels", click: () => setShowProfile(false) },
              { label: "📊 My Ads", click: () => {} },
              { label: "❓ Query", click: () => {} },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.click}
                className="hover:text-[#00ff88] px-2 py-2 rounded-lg text-left transition-all hover:bg-white/10"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-auto bg-red-900 text-white hover:text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 text-white">
        {showProfile ? (
          <div className="w-full max-w-md mx-auto mt-20 bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4 border-b border-gray-700 pb-4 mb-4">
              <img
                src="/images/card.png"
                className="w-16 h-16 rounded-full border-2 border-[#00ff88] shadow-md"
                alt="Profile"
              />
              <h2 className="text-2xl font-bold text-white">Profile Details</h2>
            </div>
            <div className="space-y-3 text-gray-200">
              <p className="flex justify-between">
                <span className="font-semibold text-gray-400">Name:</span>
                <span>{user?.full_name}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-400">Email:</span>
                <span>{user?.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-400">Username:</span>
                <span>{user?.username}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-semibold text-gray-400">Phone:</span>
                <span>{user?.phone || "Not Provided"}</span>
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full py-2 bg-[#00ff88] hover:bg-[#00e676] text-black font-semibold rounded-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <>
            {/* Pixel Page */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
              <div>
                <h1 className="text-3xl font-bold">Buy Pixels</h1>
                <p className="text-gray-300">Purchase pixels to display your ad</p>
              </div>
              <Link href="/">
              <button className="bg-[#00ff88] text-black px-6 py-2 rounded-lg font-bold mt-2 md:mt-0">
                Buy Pixels
              </button> </Link>
            </div>

            <div className="mt-8 bg-white/10 p-6 rounded-xl border border-gray-700">
  <h2 className="text-xl font-semibold">🎨 Your Pixels</h2>
  <p className="text-gray-300 mt-2">
    Total Pixels Bought:{" "}
    <span className="text-[#00ff88] font-bold">{pixels.length}</span>
  </p>

  {/* ✅ Pixel Details Table */}
  <div className="mt-4 overflow-x-auto">
    {pixels.length > 0 ? (
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-gray-400 uppercase border-b border-gray-600">
          <tr>
            <th className="px-4 py-2">X</th>
            <th className="px-4 py-2">Y</th>
            <th className="px-4 py-2">Width</th>
            <th className="px-4 py-2">Height</th>
            {/* <th className="px-4 py-2">Image</th> */}
          </tr>
        </thead>
        <tbody>
          {pixels.map((pixel: any, index: number) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="px-4 py-2">{pixel.x}</td>
              <td className="px-4 py-2">{pixel.y}</td>
              <td className="px-4 py-2">{pixel.width}</td>
              <td className="px-4 py-2">{pixel.height}</td>
              {/* <td className="px-4 py-2">
                {pixel.imageUrl ? (
                  <img src={pixel.imageUrl} className="w-10 h-10 rounded" />
                ) : (
                  "No Image"
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-400 mt-4">No pixels purchased yet.</p>
    )}
  </div>
</div>


            {/* <div className="mt-6 h-64 md:h-[400px] bg-[#012d23] rounded-xl border border-gray-700 flex items-center justify-center text-gray-500">
              Pixel Grid / Preview Area
            </div> */}
          </>
        )}
      </main>

      {/* Edit Modal */}
      {isEditing && user && (
        <EditProfileModal
          user={user}
          close={(updatedUser) => {
            setIsEditing(false);
            if (updatedUser) setUser({ ...user, ...updatedUser });
          }}
        />
      )}
    </div>
  );
}
