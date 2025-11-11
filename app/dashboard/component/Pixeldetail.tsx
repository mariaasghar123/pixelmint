"use client";

import React from "react";
import { motion } from "framer-motion";

interface Pixel {
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl?: string;
}

interface PixelDetailsModalProps {
  pixel: Pixel | null;
  onClose: () => void;
}

const PixelDetailsModal: React.FC<PixelDetailsModalProps> = ({ pixel, onClose }) => {
  if (!pixel) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#012b21] p-6 rounded-2xl w-[90%] max-w-md border border-[#00ff88]/40 shadow-2xl text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-[#00ff88] text-lg"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[#00ff88]">Pixel Details</h2>

        {pixel.imageUrl && (
          <img
            src={pixel.imageUrl}
            alt="Pixel"
            className="w-full h-48 object-cover rounded-lg border border-gray-700 mb-4"
          />
        )}

        <div className="space-y-2 text-gray-300">
          <p><span className="font-semibold text-gray-400">X:</span> {pixel.x}</p>
          <p><span className="font-semibold text-gray-400">Y:</span> {pixel.y}</p>
          <p><span className="font-semibold text-gray-400">Width:</span> {pixel.width}</p>
          <p><span className="font-semibold text-gray-400">Height:</span> {pixel.height}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PixelDetailsModal;
