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

interface AddAdsProps {
  close: () => void;
  onAdded: (ad: Ad) => Promise<void>;
  userId: string;
}

export default function AddAds({ close, onAdded, userId }: AddAdsProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [pixels, setPixels] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim() || !pixels) {
      setError("All fields are required");
      return;
    }

    if (pixels < 1) {
      setError("Pixels must be greater than 0");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("jwt");

    try {
      const res = await fetch(`${API_URL}/ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          url: url.trim(),
          pixels,
          imageurl: "/images/Rectangle.png",
          status: "Active",
          ownerid: userId,
        }),
      });

      const addedAd = await res.json();

      if (!res.ok) {
        throw new Error(addedAd.message || "Failed to add ad");
      }

      // Success animation ke liye thoda wait karo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onAdded) await onAdded(addedAd);
      
      // Smooth exit
      close();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#10b981",
      boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      borderColor: "#374151",
      boxShadow: "none",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.1 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4"
        onClick={close}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-gradient-to-br from-[#052e23] to-[#0a4d3e] rounded-2xl w-full max-w-md overflow-hidden border border-green-800/30 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-green-900/50 to-emerald-900/30 p-6 border-b border-green-700/30"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
                  Create New Ad
                </h2>
                <p className="text-green-200/80 text-sm mt-1">Fill in the details for your advertisement</p>
              </div>
            </div>
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
                <div className="flex items-center gap-2 text-red-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.div variants={containerVariants} className="p-6 space-y-4">
            {/* Title Input */}
            <motion.div variants={itemVariants}>
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

            {/* URL Input */}
            <motion.div variants={itemVariants}>
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

            {/* Pixels Input */}
            <motion.div variants={itemVariants}>
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

            {/* Preview */}
            <motion.div 
              variants={itemVariants}
              className="p-4 bg-[#062e25]/50 rounded-xl border border-green-800/30"
            >
              <h4 className="text-green-300 text-sm font-medium mb-2">Preview</h4>
              <div className="flex items-center gap-3 p-3 bg-[#052e23] rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {title || "Your Ad Title"}
                  </p>
                  <p className="text-green-300 text-sm truncate">
                    {url || "https://example.com"}
                  </p>
                  <p className="text-green-400/80 text-xs">
                    {pixels || "0"} Pixels • Active
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer Buttons */}
          <motion.div 
            variants={itemVariants}
            className="px-6 pb-6 pt-4 bg-gradient-to-t from-black/20 to-transparent"
          >
            <div className="flex gap-3">
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
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Creating...
                  </motion.div>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Ad
                  </motion.span>
                )}
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}