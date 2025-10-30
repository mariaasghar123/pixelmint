"use client";

import React from "react";
import { Shield, Zap } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#002b23] flex flex-col items-center justify-center text-white px-4 sm:px-6 md:px-0">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img
          src="/images/MyPixelMint1.svg"
          alt="Logo"
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 mx-auto"
        />
      </div>

      {/* Login Card */}
      <div className="bg-[#00302A4D] border border-green-600 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-[540px] text-center">
        {/* Wallet Image */}
        <div className="flex justify-center mb-5">
          <div className="p-3 rounded-full">
            <img
              src="/images/framer.png"
              alt="Wallet"
              className="w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>
        </div>

        {/* Headings */}
        <h2 className="text-base sm:text-lg md:text-xl mb-2 font-custom">
          Login with your crypto wallet
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mb-6">
          One Tap, No Passwords.
        </p>

        {/* Secure + Instant Section */}
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          {/* Secure */}
          <div className="flex flex-col items-center w-24 sm:w-auto">
            <div className="bg-[#98F08C1A] p-3 rounded-lg mb-1 flex items-center justify-center">
              <Shield
                className="w-8 h-8 sm:w-10 sm:h-10 text-green-400"
                fill="currentColor"
              />
            </div>
            <span className="text-sm text-white">Secure</span>
          </div>

          {/* Instant */}
          <div className="flex flex-col items-center w-24 sm:w-auto">
            <div className="bg-[#98F08C1A] p-3 rounded-lg mb-1 flex items-center justify-center">
              <Zap
                className="w-8 h-8 sm:w-10 sm:h-10 text-green-400"
                fill="currentColor"
              />
            </div>
            <span className="text-sm text-white">Instant</span>
          </div>
        </div>

        {/* Button */}
        <button className="w-full font-custom bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 text-black text-base sm:text-lg py-3 sm:py-4 rounded-lg transition-all">
          Connect Wallet
        </button>

        {/* Footer text */}
        <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
          Supports MetaMask, WalletConnect, and other Web3 wallets
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
