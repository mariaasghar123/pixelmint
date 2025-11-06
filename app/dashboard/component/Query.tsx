import React, { useState } from "react";

interface QueryComponentProps {
  onQuery: (query: string) => void;
}

const QueryComponent: React.FC<QueryComponentProps> = ({ onQuery }) => {
  const [input, setInput] = useState("");

  return (
    <div className="p-6 text-white">
      {/* Header Section */}
      <div className="bg-[#00382A] p-5 rounded-lg mb-6">
        <h1 className="text-xl font-bold">Query</h1>
        <p className="text-sm text-gray-300">Manage your Query</p>
      </div>

      {/* Main Content - Two Cards Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card (Unique Code / Query Box) */}
        <div className="bg-[#00382A] p-5 rounded-lg">
          <h2 className="text-lg font-semibold">Generate Unique Code</h2>
          <p className="text-sm text-gray-300 mb-4">
            You can use this unique code to message admin via Telegram.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              placeholder="Enter your 8-digit code here"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onQuery(input)}
              className="flex-1 bg-transparent border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:border-green-400"
            />
            <button
              onClick={() => onQuery(input)}
              className="bg-green-500 hover:bg-green-600 text-black font-medium px-4 py-2 rounded-lg"
            >
              Save code 
            </button>
          </div>
        </div>

        {/* Right Card (Support Section) */}
        <div className="bg-[#00382A] p-5 rounded-lg">
          <h2 className="text-lg font-semibold">Support</h2>
          <p className="text-sm text-gray-300 mb-4">
            Need help? Contact admin directly via Telegram.
          </p>

          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium">
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryComponent;
