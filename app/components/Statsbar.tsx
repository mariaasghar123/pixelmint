"use client";
import React from "react";
import { FaUsers, FaDollarSign, FaTh } from "react-icons/fa";

const StatsBar = () => {
  return (
    <div
      className="
        flex flex-wrap justify-center md:justify-end 
        gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 py-4
      "
    >
      {/* Card 1 */}
      <div
        className="
          flex items-center gap-3 
          bg-[#003B35] rounded-lg px-4 sm:px-6 py-3 
          border border-green-700 
          w-full sm:w-auto sm:min-w-[180px] sm:justify-start
        "
      >
        <div className="p-3 rounded-full bg-[#B8FAE233] shadow-md flex items-start ">
          <FaTh className="text-xl" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[#98F08C] font-custom">69450</p>
          <p className="text-gray-400 text-xs">PIXELS SOLD</p>
        </div>
      </div>

      {/* Card 2 */}
      <div
        className="
          flex items-center gap-3 
          bg-[#003B35] rounded-lg px-4 sm:px-6 py-3 
          border border-green-700 
          w-full sm:w-auto sm:min-w-[180px]  sm:justify-start
        "
      >
        <div className="p-3 rounded-full bg-[#B8FAE233] shadow-md flex items-center justify-center">
          <FaDollarSign className="text-xl" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[#98F08C] font-custom">1 $USDT</p>
          <p className="text-gray-400 text-xs">PIXEL RATE</p>
        </div>
      </div>

      {/* Card 3 */}
      <div
        className="
          flex items-center gap-3 
          bg-[#003B35] rounded-lg px-4 sm:px-6 py-3 
          border border-green-700 
          w-full sm:w-auto sm:min-w-[180px] sm:justify-start
        "
      >
        <div className="p-3 rounded-full bg-[#B8FAE233] shadow-md flex items-center justify-center">
          <FaUsers className="text-xl" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[#98F08C] font-custom">10 × 10px</p>
          <p className="text-gray-400 text-xs">MINIMUM BUY</p>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
