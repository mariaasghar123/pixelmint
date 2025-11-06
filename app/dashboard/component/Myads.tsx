import React, { useState } from "react";
import AddAds from "./Addads";

// Dummy ad data
const ads = [
  { id: 1, title: "My Tech Blog", url: "https://myblog.com", pixels: 200, imageUrl: "/images/Rectangle.png", status: "Active" },
  { id: 2, title: "My Tech Blog", url: "https://myblog.com", pixels: 500, imageUrl: "/images/Rectangle.png", status: "Active" },
  { id: 3, title: "My Tech Blog", url: "https://myblog.com", pixels: 800, imageUrl: "/images/Rectangle.png", status: "Expired" },
];

export default function MyAds() {
  const [showAddAds, setShowAddAds] = useState(false);

  if (showAddAds) {
    return <AddAds close={() => setShowAddAds(false)} />;
  }

  return (
    <div className="bg-[#052e23] min-h-screen py-8 px-4 md:px-8">
      {/* Header section */}
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

      {/* Ads List Section */}
      <div className="bg-[#053928] rounded-lg p-5 overflow-x-auto">
        <h2 className="text-lg font-bold text-white mb-4">Active Advertisements</h2>
        <div className="flex flex-col gap-5">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 bg-[#062e25] rounded-lg p-4 shadow transition"
            >
              {/* Ad Image */}
              <img src={ad.imageUrl} alt={ad.title} className="w-full sm:w-14 h-14 rounded-lg object-cover" />

              {/* Ad Details */}
              <div className="flex flex-col flex-1">
                <span className="font-bold text-white text-lg">{ad.title}</span>
                <span className="text-green-300 text-sm break-all">{ad.url}</span>
                <span className="text-gray-300 text-sm">{ad.pixels} Pixels</span>
              </div>

              {/* Status */}
              <span
                className={`px-4 py-1 rounded-lg font-medium text-sm ${
                  ad.status === "Active"
                    ? "bg-green-700 text-green-200"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {ad.status}
              </span>

              {/* Edit & Delete Buttons */}
              <div className="flex gap-2 items-center mt-2 sm:mt-0">
                <button title="Edit" className="bg-gray-700 hover:bg-[#00ff88] p-2 rounded-md transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hover:text-white transition-colors duration-200"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>
                <button title="Delete" className="bg-gray-700 hover:bg-red-700 p-2 rounded-md transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hover:text-white transition-colors duration-200"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M8 6V4h8v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
