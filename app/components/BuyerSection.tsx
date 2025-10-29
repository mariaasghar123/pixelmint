"use client";
import React, { useRef, useState, useEffect } from "react";

export interface BuyerData {
  id: string;
  name: string;
  pixelsBought: string;
  position: string;
  logoUrl: string;
  tag?: string;
  rank?: 1 | 2 | 3 | null;
}

interface BuyerSectionProps {
  title: string;
  icon: React.ReactNode;
  data: BuyerData[];
}

// --- BuyerCard Component ---
const BuyerCard: React.FC<{ data: BuyerData }> = ({ data }) => {
  let rankIcon = null;
  let borderColor = "border-transparent";
  let gradientClass = "bg-gray-800";

  if (data.rank === 1) {
    rankIcon = <span className="text-xl">🏆</span>;
    borderColor = "border-yellow-500";
    gradientClass = "bg-gradient-to-br from-[#0e6c6c] to-[#024D45]";
  } else if (data.rank === 2) {
    rankIcon = <span className="text-xl text-gray-400">🥈</span>;
    borderColor = "border-gray-400";
    gradientClass = "bg-gradient-to-br from-[#105650] to-[#033E35]";
  } else if (data.rank === 3) {
    rankIcon = <span className="text-xl text-orange-500">🥉</span>;
    borderColor = "border-orange-500";
    gradientClass = "bg-gradient-to-br from-[#105650] to-[#033E35]";
  } else {
    rankIcon = (
      <span className="text-xl text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM4 16h16a3 3 0 00-3-3H7a3 3 0 00-3 3z"
          />
        </svg>
      </span>
    );
    borderColor = "border-transparent";
    gradientClass = "bg-[#024D45]";
  }

  return (
    <div
      className={`relative w-[240px] sm:w-[260px] md:w-[220px] lg:w-[240px] 
      h-[220px] p-4 rounded-xl shadow-xl transition-all duration-300 
      hover:shadow-2xl hover:scale-[1.02] border-2 ${borderColor} ${gradientClass} 
      snap-center flex-shrink-0 flex flex-col justify-between`}
    >
      <div className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black bg-opacity-30">
        {rankIcon}
      </div>

      <div className="flex flex-col">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-black rounded-lg overflow-hidden border border-gray-700 mb-3">
          <img
            src="/images/card.png"
            alt={data.name}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col">
          {data.tag && (
            <p className="text-xs font-medium text-[#98F08C] mb-1">{data.tag}</p>
          )}
          <p className="text-white font-bold text-base sm:text-lg mb-1">
            {data.name}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Bought: {data.pixelsBought}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            Position: {data.position}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- BuyerSection Component ---
const BuyerSection: React.FC<BuyerSectionProps> = ({ title, icon, data }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Scroll tracking logic ---
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full max-w-8xl mx-auto mb-12 mt-6 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-2">
      {/* Header */}
      <div className="flex items-center border border-b-0 p-4 bg-[#002320] border-b-2 border-[#0e6c6c] rounded-t-lg shadow-inner">
        <span className="mr-3 text-2xl text-[#98F08C]">{icon}</span>
        <h2 className="font-custom text-lg sm:text-xl md:text-2xl text-white font-mono">
          {title}
        </h2>
      </div>

      {/* Cards */}
      <div className="p-4 bg-[#003A36]  border border-green-900 rounded-b-lg shadow-2xl">
        <div
          ref={scrollRef}
          className="
            flex overflow-x-auto md:grid 
            md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
            gap-4 md:gap-6
            snap-x snap-mandatory
            scrollbar-hide
            scroll-smooth
          "
        >
          {data.map((card) => (
            <BuyerCard key={card.id} data={card} />
          ))}
        </div>

        {/* Dots Pagination (Only for mobile scroll view) */}
        <div className="flex justify-center mt-4 space-x-2 md:hidden">
          {data.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-[#98F08C] w-4" : "bg-gray-500"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuyerSection;
