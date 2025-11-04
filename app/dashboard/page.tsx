"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditProfileModal from "./EditProfileModal";

type User = {
  id: string;
  full_name: string;
  Email: string;
  phone?: string;
  pixelsBought?: number;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      const token = localStorage.getItem("jwt"); // ya cookie
      if (!token) {
        setLoading(false);
        return router.push("/login");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setLoading(false);
        return router.push("/login");
      }

      const data = await res.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // token clear
    router.push("/login");
  };

  if (loading) return <p className="text-center text-white mt-10">Loading user...</p>;
  if (!user) return <p className="text-center text-white mt-10">No user data found.</p>;

  return (
    
  <div className="min-h-screen bg-[#002b23] flex flex-col items-center p-2">
    <div className="bg-white/10 backdrop-blur-2xl mt-20 border border-white/20 shadow-2xl rounded-3xl p-6 sm:p-10 w-full max-w-3xl text-white transition-all duration-500 hover:scale-[1.01]">
      
      {/* Logo */}
      <div className="mb-6">
        <img src="/images/MyPixelMint1.svg" alt="Logo" className="w-20 sm:w-28 mx-auto" />
      </div>

      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
        <img
          src="/images/card.png"
          alt="Profile Image"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-500 shadow-md hover:scale-105 transition-transform"
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">{user.full_name}</h1>
          <p className="text-gray-300 break-all">{user.Email}</p>
          <p className="text-gray-400 text-sm mt-1">📞 {user.phone || "No phone added"}</p>
        </div>
      </div>

      {/* Pixel Stats */}
      <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl text-center sm:text-left">
        <h2 className="text-lg font-semibold text-gray-200">🎨 Total Pixels Bought</h2>
        <p className="text-3xl font-bold text-blue-400 mt-2">
          {user.pixelsBought || 0} Pixels
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-lg transition-all duration-300 w-full sm:w-auto"
        >
          ✏️ Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg shadow-lg transition-all duration-300 w-full sm:w-auto"
        >
          🚪 Logout
        </button>
      </div>
    </div>

    {/* Edit Profile Modal */}
    {isEditing && (
      <EditProfileModal
        user={user}
        close={(updatedUser) => {
          if (updatedUser && user) {
            setUser({
              ...user,
              full_name: updatedUser.full_name || user.full_name,
              phone: updatedUser.phone || user.phone,
              Email: updatedUser.Email || user.Email,
            });
          }
          setIsEditing(false);
        }}
      />
    )}
  </div>
);
}
