"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";
import MyAds from "./component/Myads";
import QueryComponent from "./component/Query";
import PurchaseHistory from "./component/PurchasePixel";
import { motion } from "framer-motion";
import PixelDetailsModal from "./component/Pixeldetail";

// import { Link } from "lucide-react";
import Link from "next/link";

interface User {
  full_name: string;
  email: string;
  username: string;
  phone?: string;
  pixelsBought?: number;
}



interface Pixel {
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl?: string;
}

export default function Dashboard() {
    const [activePage, setActivePage] = useState("pixels"); // default page
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null);
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

  if (loading) {
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
          <Link href="/">
          <img
            src="/images/MyPixelMint1.svg"
            className="w-20 mx-auto hover:scale-110 transition-transform duration-300"
          /> </Link>

          <div className="bg-white/10 p-4 rounded-xl text-center mt-6 shadow-lg hover:shadow-xl transition-all">
            <img
              src="/images/card.png"
              className="w-16 h-16 rounded-full border-2 border-[#00ff88] mx-auto shadow-md"
            />
            <h2 className="text-lg font-bold mt-2">{user?.full_name}</h2>
          </div>

          <nav className="mt-6 flex flex-col gap-3">
            {[
  {key: "profile", label: "👤 Profile", click: () => setActivePage("profile") },
  {key: "pixels", label: "🎨 Your Pixels", click: () => setActivePage("pixels") },
  {key: "purchases", label: "💸 Purchases", click: () => setActivePage("purchases") },
  {key: "myAds", label: "📊 My Ads", click: () => setActivePage("myAds") },
  {key: "query", label: "❓ Query", click: () => setActivePage("query") },
].map((item, i) => (
  <button
    key={i}
      onClick={item.click}
      className={`px-3 py-2 rounded-lg text-left transition-all font-medium
        ${
          activePage === item.key
            ? "bg-[#00ff8840] text-[#00ff88] border-l-4 border-[#00ff88] shadow-md"
            : "text-white hover:text-[#00ff88] hover:bg-white/10"
        }`}
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
  {activePage === "profile" && (
    <div className="w-full max-w-md mx-auto mt-20 bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Profile content */}
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
  )}
  {activePage === "purchases" && <PurchaseHistory />}

  {activePage === "pixels" && (
  <div>
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[#00ff88]">🎨 Your Purchased Pixels</h1>
        <p className="text-gray-300">Click any row below to view full pixel details with image.</p>
      </div>
      <Link href="/">
        <button className="bg-[#00ff88] text-black px-6 py-2 rounded-lg font-bold hover:scale-105 transition">
          + Buy More Pixels
        </button>
      </Link>
    </div>

    {/* Summary */}
    <div className="mt-6 bg-white/10 p-5 rounded-xl border border-gray-700 shadow-lg">
      <p className="text-gray-300">
        Total Pixels Bought:{" "}
        <span className="text-[#00ff88] font-bold">{pixels.length}</span>
      </p>
    </div>

    {/* Table Section */}
    <div className="mt-6 overflow-x-auto rounded-xl border border-gray-700 shadow-md">
      {pixels.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-300 border-collapse">
          <thead className="bg-[#013c2c] text-gray-200 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 border-b border-gray-700">Number</th>
              <th className="px-5 py-3 border-b border-gray-700">X</th>
              <th className="px-5 py-3 border-b border-gray-700">Y</th>
              <th className="px-5 py-3 border-b border-gray-700">Width</th>
              <th className="px-5 py-3 border-b border-gray-700">Height</th>
              <th className="px-5 py-3 border-b border-gray-700">Preview</th>
            </tr>
          </thead>

          <tbody>
            {pixels.map((pixel, index) => (
              <tr
                key={index}
                onClick={() => setSelectedPixel(pixel)} // 👈 Opens modal
                className="border-b border-gray-700 hover:bg-[#00ff8820] cursor-pointer transition-all hover:scale-[1.01]"
              >
                <td className="px-5 py-3">{index + 1}</td>
                <td className="px-5 py-3">{pixel.x}</td>
                <td className="px-5 py-3">{pixel.y}</td>
                <td className="px-5 py-3">{pixel.width}</td>
                <td className="px-5 py-3">{pixel.height}</td>
                <td className="px-5 py-3">
                  {pixel.imageUrl ? (
                    <img
                      src={pixel.imageUrl}
                      alt="Pixel preview"
                      className="w-12 h-12 rounded-md object-cover border border-gray-600 hover:scale-110 transition-transform"
                    />
                  ) : (
                    <span className="text-gray-500 italic">No image</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 mt-6 text-center">No pixels purchased yet.</p>
      )}
    </div>

    {/* Pixel Detail Modal */}
    {selectedPixel && (
      <PixelDetailsModal
        pixel={selectedPixel}
        onClose={() => setSelectedPixel(null)}
      />
    )}
  </div>
)}

  {selectedPixel && (
  <PixelDetailsModal
    pixel={selectedPixel}
    onClose={() => setSelectedPixel(null)}
  />
)}


  {activePage === "myAds" && <MyAds onAdded={() => console.log("Ad added!")} />}

  {activePage === "query" && <QueryComponent onQuery={(queryText) => {
    console.log("User query:", queryText);
    // You can also save the query to state or send it to backend
  }} />}
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
