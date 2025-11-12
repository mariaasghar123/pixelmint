"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface TopbarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuToggle, isMenuOpen, onLogout }) => {
  return (
    <div className="w-full flex items-center justify-between bg-[#013220] p-4 text-white shadow-md fixed top-0 left-0 z-30 lg:hidden">
      {/* Hamburger */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onMenuToggle}
        className="bg-green-600 p-2 rounded-lg"
      >
        {isMenuOpen ? "✕" : "☰"}
      </motion.button>

      {/* Logo / Title */}
      <Link href="/">
        <h1 className="text-lg font-bold text-[#00ff88]">
          PixelMint Dashboard
        </h1>
      </Link>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-500 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
