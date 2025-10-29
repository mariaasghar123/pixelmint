"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#002420] w-full h-auto text-green-400 flex justify-between items-center px-4 py-3 font-mono relative overflow-hidden">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        {/* Desktop Logo */}
        <div className="flex items-center justify-center w-[60px] h-[70px] overflow-hidden hidden sm:flex">
          <img
            src="/images/MyPixelMint1.svg"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
        {/* Mobile Logo */}
        <div className="sm:hidden flex items-center gap-2">
          <img
            src="/images/Group.png"
            alt="Logo"
            className="w-[40px] h-[45px] object-contain"
          />
          <span className="font-custom text-lg">
            <span className="text-[#1E894B] font-custom">my</span> PixelMint
          </span>
        </div>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="#"
          className="border-4 font-custom border-green-500 px-4 py-2 rounded-sm hover:bg-green-900 transition"
        >
          About
        </Link>
        <Link
          href="#"
          className="border-4 font-custom border-green-500 px-4 py-2 rounded-sm hover:bg-green-900 transition"
        >
          Litepaper
        </Link>
        <Link
          href="#"
          className="bg-[#98F08C] font-custom text-black px-4 py-3 rounded-sm hover:bg-green-400 transition"
        >
          Become Affiliate
        </Link>
        <Link
          href="#"
          className="bg-[#98F08C] font-custom text-black px-4 py-3 rounded-sm hover:bg-green-300 transition"
        >
          Connect Wallet
        </Link>
      </div>

      {/* Hamburger Button (Mobile Only) */}
      <button
        className="md:hidden z-50"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          className="text-green-300"
          viewBox="0 0 24 24"
        >
          {menuOpen ? (
            //  Close Icon (Cross)
            <path
              strokeLinecap="round"
              strokeWidth="3"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            //  Hamburger Icon (3 lines)
            <>
              <path strokeLinecap="round" strokeWidth="3" d="M4 6h16" />
              <path strokeLinecap="round" strokeWidth="3" d="M4 12h16" />
              <path strokeLinecap="round" strokeWidth="3" d="M4 18h16" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-[370px] bg-[#0B3C31] p-0 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          height: "auto",
          maxHeight: "90vh",
          borderBottomRightRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* 🔹 Top Logo Section */}
        <div className="flex w-full  gap-2 mb-4 bg-[#002420] p-4 rounded-tr-md">
          <img
            src="/images/Group.png"
            alt="Logo"
            className="w-[40px] h-[45px] object-contain"
          />
          <span className="font-custom text-lg text-green-100">
            <span className="text-[#1E894B] font-custom">my</span>{" "}
            <span className="text-[#99F18D]">PixelMint</span>
          </span>
        </div>

        {/* 🔹 Links Section */}
        <div className="px-6 pb-6 flex flex-col gap-4 w-[300px] justify-center items-center mx-auto">
          <Link
            href="#"
            className="border font-custom border-green-500 text-green-100 px-4 py-2 rounded-sm hover:bg-green-900 w-full text-center"
          >
            About
          </Link>

          <Link
            href="#"
            className="border font-custom border-green-500 text-green-100 px-4 py-2 rounded-sm hover:bg-green-900 w-full text-center"
          >
            Litepaper
          </Link>

          <Link
            href="#"
            className="bg-[#98F08C] font-custom text-black px-4 py-3 rounded-sm hover:bg-green-400 w-full text-center"
          >
            Become Affiliate
          </Link>

          <Link
            href="#"
            className="bg-[#98F08C] font-custom text-black px-4 py-3 rounded-sm hover:bg-green-300 w-full text-center"
          >
            Connect Wallet
          </Link>
        </div>
      </div>

      {/* Overlay (click outside to close) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
