"use client";

import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

export default function AnimatedWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-6"
    >
      {/* ✅ Toast Notification Client Side */}
      <Toaster position="top-right" />

      {/* ✅ Main Content */}
      {children}
    </motion.div>
  );
}
