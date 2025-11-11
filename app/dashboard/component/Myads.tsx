"use client";

import React, { useState, useEffect } from "react";
import AddAds from "./Addads";
import EditAd from "./Editads";

interface Ad {
  id: string;
  title: string;
  url: string;
  pixels: number;
  imageurl: string;
  status: string;
  ownerid?: string; // 👈 added small 'i'
}
interface MyAdsProps {
  onAdded?: () => void;
}
export default function MyAds({ onAdded }: MyAdsProps) {
  const [showAddAds, setShowAddAds] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [userId, setUserId] = useState<string>("");


    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";


  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
  try {
    const token = localStorage.getItem("jwt");

    const res = await fetch(`${API_URL}/ads`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ token bhejna zaroori hai
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ads: ${res.status}`);
    }

    const data = await res.json();
    setAds(data);
  } catch (err) {
    console.error("Failed to fetch ads:", err);
  }
};


  const handleAddAd = async (newAd: Partial<Ad>) => {
    try {
      const res = await fetch(`${API_URL}/ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAd,
          imageUrl: "/images/Rectangle.png",
          status: "Active",
          ownerid: newAd.ownerid, // 👈 small 'i'
        }),
      });
      const data = await res.json();
      setAds((prev) => [...prev, data]);
    } catch (err) {
      console.error("Failed to add ad:", err);
    }
  };

 const handleEditAd = async (updatedAd: Ad) => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("No JWT token found");

    const res = await fetch(`${API_URL}/ads/${updatedAd.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ token sent correctly
      },
      body: JSON.stringify({
        ...updatedAd,
        ownerid: updatedAd.ownerid,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to update ad");
    }

    const data = await res.json();
    setAds((prev) => prev.map((ad) => (ad.id === data.id ? data : ad)));
    setEditingAd(null);
  } catch (err: unknown) {
    if (err instanceof Error)
    console.error("Failed to update ad:", err.message || err);
  }
};



 const handleDeleteAd = async (id: string) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await fetch(`${API_URL}/ads/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ token is important
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete ad: ${res.status}`);
    }

    // Only update state if backend actually deleted
    setAds((prev) => prev.filter((ad) => ad.id !== id));
  } catch (err) {
    console.error("Failed to delete ad:", err);
  }
};

  // render
if (editingAd) {
  return (
    <EditAd
      ad={editingAd}
      close={() => setEditingAd(null)}
      onUpdate={handleEditAd} 
    />
  );
}

  // Render Add/Edit Modal
  if (showAddAds || editingAd) {
    return (
      <AddAds
        close={() => {
          setShowAddAds(false);
          setEditingAd(null);
        }}
        onAdded={editingAd ? handleEditAd : handleAddAd}
                    userId={userId} // ✅ yeh add karo

      />
    );
  }

  return (
    <div className="bg-[#052e23] min-h-screen py-8 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-[#053928] rounded-lg p-4">
        <div className="mb-3 md:mb-0">
          <h1 className="text-xl font-bold text-white">Buy Pixels</h1>
          <p className="text-gray-300 text-sm">Purchase pixels to display your ad</p>
        </div>
        <button
          onClick={() => setShowAddAds(true)}
          className="bg-[#65e898] hover:bg-[#38d69f] text-black font-semibold px-5 py-2 rounded-lg transition w-full md:w-auto"
        >
          Add Ads
        </button>
      </div>

      {/* Ads List */}
      <div className="bg-[#053928] rounded-lg p-5 overflow-x-auto">
        <h2 className="text-lg font-bold text-white mb-4">Active Advertisements</h2>
        <div className="flex flex-col gap-5">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 bg-[#062e25] rounded-lg p-4 shadow transition"
            >
              <img
                src={ad.imageurl || "/images/Rectangle.png"}
                alt={ad.title}
                className="w-full sm:w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex flex-col flex-1">
                <span className="font-bold text-white text-lg">{ad.title}</span>
                <span className="text-green-300 text-sm break-all">{ad.url}</span>
                <span className="text-gray-300 text-sm">{ad.pixels} Pixels</span>
              </div>

              <span
                className={`px-4 py-1 rounded-lg font-medium text-sm ${
                  ad.status === "Active" ? "bg-green-700 text-green-200" : "bg-gray-700 text-gray-300"
                }`}
              >
                {ad.status}
              </span>

              {/* Edit/Delete */}
              <div className="flex gap-2 items-center mt-2 sm:mt-0">
                <button
                  onClick={() => setEditingAd(ad)}
                  title="Edit"
                  className="bg-gray-700 hover:bg-[#00ff88] p-2 rounded-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAd(ad.id)}
                  title="Delete"
                  className="bg-gray-700 hover:bg-red-700 p-2 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
