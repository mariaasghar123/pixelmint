"use client";
import React, { useState } from "react";

interface QueryComponentProps {
  onQuery: (query: string) => void;
}

const QueryComponent: React.FC<QueryComponentProps> = ({ onQuery }) => {
  const [input, setInput] = useState("");

  return (
    <div className="p-4 sm:p-6 md:p-10 text-white min-h-screen bg-gradient-to-br from-[#001f1a] via-[#002d22] to-[#001915]">
      {/* Header Section */}
      <div className="bg-[#00382A] p-4 sm:p-6 rounded-xl mb-8 shadow-lg border border-[#04624d]/50">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">💬 Query</h1>
        <p className="text-sm md:text-base text-gray-300 mt-1">
          Manage your queries and contact admin easily
        </p>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Card - Unique Code */}
        <div className="bg-[#00382A]/80 border border-[#0a5c41] backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-[#19f58a]/20 transition">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            🔑 Generate Unique Code
          </h2>
          <p className="text-sm text-gray-300 mb-5">
            Use this unique code to connect with admin via Telegram.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={input}
              placeholder="Enter your 8-digit code"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onQuery(input)}
              className="flex-1 bg-transparent border border-gray-500 rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-green-400 placeholder-gray-400"
            />
            <button
              onClick={() => onQuery(input)}
              className="bg-[#19f58a] hover:bg-[#17d67a] text-black font-semibold px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base transition"
            >
              Save Code
            </button>
          </div>
        </div>

        {/* Right Card - Support */}
        <div className="bg-[#00382A]/80 border border-[#0a5c41] backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-[#19f58a]/20 transition">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">🛠️ Support</h2>
          <p className="text-sm text-gray-300 mb-5">
            Need help? Reach out to admin instantly via Telegram.
          </p>

          <a
            href="https://t.me/yourtelegramlink" // ✅ Replace with your Telegram link
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg text-white font-medium text-sm sm:text-base transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9.036 14.453l-.376 5.297c.538 0 .768-.23 1.045-.507l2.505-2.398 5.196 3.806c.951.524 1.621.249 1.873-.884l3.395-15.93.001-.001c.302-1.407-.509-1.959-1.429-1.617L1.432 9.303C.058 9.867.066 10.665 1.178 11.01l5.92 1.846 13.72-8.64c.646-.423 1.24-.189.754.234l-11.536 9.96z" />
            </svg>
            Chat on Telegram
          </a>
        </div>
      </div>
    </div>
  );
};

export default QueryComponent;
