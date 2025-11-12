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
  imageurl?: string;
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
  const [isLargeScreen, setIsLargeScreen] = useState(false);
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
      const pixelRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pixels/my-pixels`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const pixelData = await pixelRes.json();
      setPixels(pixelData); // Save pixels from DB ✅
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Track screen size
useEffect(() => {
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth >= 1024);
    if (window.innerWidth >= 1024) setIsSidebarOpen(true); // always open on large screens
  };

  handleResize(); // initial check
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
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
      {/* <div className="relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-4 left-4 text-white z-50 bg-black/40 p-2 rounded-lg backdrop-blur-md"
        >
          ☰
        </button>

        <aside
          className={`fixed md:static top-0 left-0 h-full w-64 bg-[#013220]/90 backdrop-blur-md border-r border-gray-700 
          p-6 flex flex-col text-white shadow-xl transform transition-transform duration-300 z-40
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
        >
          <Link href="/">
            <img
              src="/images/MyPixelMint1.svg"
              className="w-20 mx-auto hover:scale-110 transition-transform duration-300"
            />{" "}
          </Link>

          <div className="bg-white/10 p-4 rounded-xl text-center mt-6 shadow-lg hover:shadow-xl transition-all">
            <img
              src="/images/card.png"
              className="w-16 h-16 rounded-full border-2 border-[#00ff88] mx-auto shadow-md"
            />
            <h2 className="text-lg font-bold mt-2">{user?.full_name}</h2>
          </div>

          <nav className="mt-6 flex flex-col gap-3">
            {[
              {
                key: "profile",
                label: "👤 Profile",
                click: () => setActivePage("profile"),
              },
              {
                key: "pixels",
                label: "🎨 Your Pixels",
                click: () => setActivePage("pixels"),
              },
              {
                key: "purchases",
                label: "💸 Purchases",
                click: () => setActivePage("purchases"),
              },
              {
                key: "myAds",
                label: "📊 My Ads",
                click: () => setActivePage("myAds"),
              },
              {
                key: "query",
                label: "❓ Query",
                click: () => setActivePage("query"),
              },
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
      </div> */}
      <div className="relative">
  {/* Enhanced Hamburger Button with Cross Animation */}
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    className="lg:hidden fixed top-6 left-6 text-white z-50 bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl shadow-2xl backdrop-blur-md border border-green-500/30"
    aria-label="Toggle Menu"
  >
    {/* Animated Hamburger to Cross */}
    <motion.div
      className="w-6 h-6 relative"
      animate={isSidebarOpen ? "open" : "closed"}
      variants={{
        open: { rotate: 180 },
        closed: { rotate: 0 }
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Top line */}
      <motion.span
        className="absolute top-1 left-0 w-6 h-0.5 bg-white rounded-full"
        variants={{
          open: { rotate: 45, y: 6 },
          closed: { rotate: 0, y: 0 }
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Middle line */}
      <motion.span
        className="absolute top-3 left-0 w-6 h-0.5 bg-white rounded-full"
        variants={{
          open: { opacity: 0, x: -10 },
          closed: { opacity: 1, x: 0 }
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Bottom line */}
      <motion.span
        className="absolute top-5 left-0 w-6 h-0.5 bg-white rounded-full"
        variants={{
          open: { rotate: -45, y: -6 },
          closed: { rotate: 0, y: 0 }
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  </motion.button>

  {/* Backdrop for mobile */}
  {isSidebarOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsSidebarOpen(false)}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
    />
  )}

  {/* Enhanced Sidebar - Always visible on large screens */}
  <motion.aside
    initial={false}
    animate={{
          x: isLargeScreen ? 0 : isSidebarOpen ? 0 : -280,
          // x: window.innerWidth >= 1024 ? 0 : isSidebarOpen ? 0 : -280,
      //  x: isSidebarOpen ? 0 : -280
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 30
    }}
    className="fixed lg:static top-0 left-0 h-full w-72 bg-gradient-to-b from-[#013220] via-[#002616] to-[#001a0f] backdrop-blur-2xl border-r border-green-800/40 
               p-6 flex flex-col text-white shadow-2xl z-40 overflow-hidden"
  >
    
    {/* Decorative Background Elements */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/5 rounded-full translate-y-20 -translate-x-20 blur-2xl"></div>

    {/* Logo Section */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="relative z-10"
    >
      <Link href="/" className="block">
        <motion.img
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 0.5 }}
          src="/images/MyPixelMint1.svg"
          alt="PixelMint Logo"
          className="w-24 mx-auto hover:drop-shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-all duration-300"
        />
      </Link>
    </motion.div>

    {/* User Profile Card */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 p-5 rounded-2xl text-center mt-8 
                 backdrop-blur-lg border border-green-500/20 shadow-2xl hover:shadow-3xl transition-all duration-300
                 hover:border-green-400/40 group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative"
      >
        <img
          src="/images/card.png"
          alt="User Avatar"
          className="w-20 h-20 rounded-full border-4 border-green-400/50 mx-auto shadow-2xl group-hover:border-green-300 transition-colors duration-300"
        />
        <div className="absolute bottom-0 right-1/2 translate-x-12 w-5 h-5 bg-green-400 rounded-full border-4 border-[#002616] shadow-lg"></div>
      </motion.div>
      
      <motion.h2 
        className="text-xl font-bold mt-4 bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
      >
        {user?.full_name || "User Name"}
      </motion.h2>
      <p className="text-green-300/80 text-sm mt-1">Premium Member</p>
    </motion.div>

    {/* Navigation Menu */}
    <motion.nav 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-8 flex flex-col gap-3 relative z-10"
    >
      {[
        {
          key: "profile",
          label: "Profile",
          icon: "👤",
          click: () => setActivePage("profile"),
        },
        {
          key: "pixels",
          label: "Your Pixels",
          icon: "🎨",
          click: () => setActivePage("pixels"),
        },
        {
          key: "purchases",
          label: "Purchases",
          icon: "💸",
          click: () => setActivePage("purchases"),
        },
        {
          key: "myAds",
          label: "My Ads",
          icon: "📊",
          click: () => setActivePage("myAds"),
        },
        {
          key: "query",
          label: "Query",
          icon: "❓",
          click: () => setActivePage("query"),
        },
      ].map((item, i) => (
        <motion.button
          key={item.key}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 * i }}
          whileHover={{ 
            x: 5,
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            item.click();
            // Mobile par sidebar auto close
            if (window.innerWidth < 1024) { // lg breakpoint
              setIsSidebarOpen(false);
            }
          }}
          className={`relative px-4 py-4 rounded-xl text-left transition-all duration-300 font-medium group
            flex items-center gap-4 overflow-hidden
            ${
              activePage === item.key
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-l-4 border-green-400 shadow-lg shadow-green-500/20"
                : "text-white/80 hover:text-green-300 hover:bg-white/5"
            }`}
        >
          {/* Active indicator */}
          {activePage === item.key && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          
          {/* Icon */}
          <span className="text-xl relative z-10 group-hover:scale-110 transition-transform duration-300">
            {item.icon}
          </span>
          
          {/* Label */}
          <span className="relative z-10 font-semibold text-sm tracking-wide">
            {item.label}
          </span>
          
          {/* Hover effect */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.button>
      ))}
    </motion.nav>

    {/* Logout Button */}
    <motion.button
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      whileHover={{ 
        scale: 1.02,
        x: 5
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className="mt-auto relative z-10 bg-gradient-to-r from-red-600/20 to-pink-600/20 text-white/90 
                 hover:from-red-600/30 hover:to-pink-600/30 hover:text-red-300 
                 border border-red-500/30 hover:border-red-400/50 px-4 py-4 rounded-xl 
                 transition-all duration-300 font-medium flex items-center gap-3 group"
    >
      <span className="text-xl group-hover:scale-110 transition-transform duration-300">🚪</span>
      <span className="font-semibold">Logout</span>
      
      {/* Hover arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
        </svg>
      </div>
    </motion.button>

    {/* Footer/Copyright */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="relative z-10 text-center mt-6 pt-4 border-t border-green-800/30"
    >
      <p className="text-green-400/60 text-xs font-medium">
        PixelMint v1.0
      </p>
      <p className="text-green-500/40 text-xs mt-1">
        Your Pixel Advertising Platform
      </p>
    </motion.div>
  </motion.aside>
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
                <h1 className="text-3xl font-bold text-[#00ff88]">
                  🎨 Your Purchased Pixels
                </h1>
                <p className="text-gray-300">
                  Click any row below to view full pixel details with image.
                </p>
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
                <span className="text-[#00ff88] font-bold">
                  {pixels.length}
                </span>
              </p>
            </div>

            {/* Table Section */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-700 shadow-md">
              {pixels.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-300 border-collapse">
                  <thead className="bg-[#013c2c] text-gray-200 uppercase text-xs">
                    <tr>
                      <th className="px-5 py-3 border-b border-gray-700">
                        Number
                      </th>
                      <th className="px-5 py-3 border-b border-gray-700">X</th>
                      <th className="px-5 py-3 border-b border-gray-700">Y</th>
                      <th className="px-5 py-3 border-b border-gray-700">
                        Width
                      </th>
                      <th className="px-5 py-3 border-b border-gray-700">
                        Height
                      </th>
                      {/* <th className="px-5 py-3 border-b border-gray-700">Preview</th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {pixels.map((pixel, index) => (
                      <tr
                        key={index}
                        onClick={() => setSelectedPixel(pixel)} // 👈 Opens modal
                        className="border-b border-gray-700 hover:bg-[#00ff8820] cursor-pointer transition-all"
                      >
                        <td className="px-5 py-3">{index + 1}</td>
                        <td className="px-5 py-3">{pixel.x}</td>
                        <td className="px-5 py-3">{pixel.y}</td>
                        <td className="px-5 py-3">{pixel.width}</td>
                        <td className="px-5 py-3">{pixel.height}</td>
                        {/* <td className="px-5 py-3">
                  {pixel.imageurl ? (
                    <img
                      src={pixel.imageurl}
                      alt="Pixel preview"
                      className="w-12 h-12 rounded-md object-cover border border-gray-600 hover:scale-110 transition-transform"
                    />
                  ) : (
                    <span className="text-gray-500 italic">No image</span>
                  )}
                </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 mt-6 text-center">
                  No pixels purchased yet.
                </p>
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

        {activePage === "myAds" && (
          <MyAds onAdded={() => console.log("Ad added!")} />
        )}

        {activePage === "query" && (
          <QueryComponent
            onQuery={(queryText) => {
              console.log("User query:", queryText);
              // You can also save the query to state or send it to backend
            }}
          />
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
