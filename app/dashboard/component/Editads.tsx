"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Ad {
  id: string;
  title: string;
  url: string;
  pixels: number;
  imageurl: string;
  status: string;
  ownerid?: string;
}

interface EditAdProps {
  ad: Ad;
  close: () => void;
  onUpdate: (updatedAd: Ad) => void;
}

export default function EditAd({ ad, close, onUpdate }: EditAdProps) {
  const [title, setTitle] = useState(ad.title);
  const [url, setUrl] = useState(ad.url);
  const [pixels, setPixels] = useState<number>(ad.pixels);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim() || !pixels) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("No JWT token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/ads/${ad.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...ad,
          title: title.trim(),
          url: url.trim(),
          pixels,
          imageurl: ad.imageurl || "/images/Rectangle.png",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update ad");
      }

      const updatedAd = await res.json();
      onUpdate(updatedAd);
      close();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Variants for smooth animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const inputVariants: Variants = {
    focus: {
      scale: 1.02,
      borderColor: "#10b981",
      boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      borderColor: "#374151",
      boxShadow: "none",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants: Variants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05, transition: { duration: 0.1 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        onClick={close}
      >
        <motion.div
          className="bg-gradient-to-br from-[#052e23] to-[#0a4d3e] rounded-2xl w-full max-w-md overflow-hidden border border-green-800/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.div className="bg-gradient-to-r from-green-900/50 to-emerald-900/30 p-6 border-b border-green-700/30">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
              Edit Ad
            </h2>
            <p className="text-green-200/80 text-sm mt-1">
              Update your ad details below
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-6 mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.div className="p-6 space-y-4">
            <motion.div>
              <label className="block text-green-200 text-sm font-medium mb-2">
                Ad Title
              </label>
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                whileHover={{ scale: 1.01 }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter advertisement title"
                className="w-full px-4 py-3 rounded-xl bg-[#062e25] text-white border border-gray-600 focus:outline-none placeholder-green-300/40"
                disabled={loading}
              />
            </motion.div>

            <motion.div>
              <label className="block text-green-200 text-sm font-medium mb-2">
                Target URL
              </label>
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                whileHover={{ scale: 1.01 }}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#062e25] text-white border border-gray-600 focus:outline-none placeholder-green-300/40"
                disabled={loading}
              />
            </motion.div>

            <motion.div>
              <label className="block text-green-200 text-sm font-medium mb-2">
                Pixels
              </label>
              <motion.input
                variants={inputVariants}
                whileFocus="focus"
                whileHover={{ scale: 1.01 }}
                type="number"
                value={pixels}
                onChange={(e) => setPixels(Number(e.target.value))}
                placeholder="Enter pixel count"
                min="1"
                className="w-full px-4 py-3 rounded-xl bg-[#062e25] text-white border border-gray-600 focus:outline-none placeholder-green-300/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={loading}
              />
            </motion.div>
          </motion.div>

          {/* Footer Buttons */}
          <motion.div className="px-6 pb-6 pt-4 bg-gradient-to-t from-black/20 to-transparent flex gap-3">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={close}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium border border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {loading ? "Updating..." : "Update Ad"}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
