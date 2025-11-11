"use client";

import { useState } from "react";
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
  onAdded: (ad: Ad) => Promise<void>; // ✅ make sure it's 'onAdded'
  // onAdded?: () => void; // frontend update callback
  userId: string; // logged-in user id
}

export default function AddAds({ close, onAdded, userId }: AddAdsProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [pixels, setPixels] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleSubmit = async () => {
    if (!title || !url || !pixels) {
      setError("All fields are required");
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
          title,
          url,
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

      // ✅ Success
      setTitle("");
      setUrl("");
      setPixels("");
      if (onAdded) await onAdded(addedAd); // ✅ pass new ad as argument
      close();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#052e23] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-white text-xl font-bold mb-4">Add New Ad</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full mb-3 p-2 rounded bg-[#062e25] text-white border border-gray-600"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="w-full mb-3 p-2 rounded bg-[#062e25] text-white border border-gray-600"
        />
        <input
          type="number"
          value={pixels}
          onChange={(e) => setPixels(Number(e.target.value))}
          placeholder="Pixels"
          className="w-full mb-3 p-2 rounded bg-[#062e25] text-white border border-gray-600"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={close}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Ad"}
          </button>
        </div>
      </div>
    </div>
  );
}
