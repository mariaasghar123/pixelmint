"use client";

import { useState, useEffect } from "react";

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
  ad: Ad; // Existing ad data
  close: () => void; // Close modal
  onUpdate: (updatedAd: Ad) => void; // Function to update ad in parent
}

export default function EditAd({ ad, close, onUpdate }: EditAdProps) {
  const [title, setTitle] = useState(ad.title);
  const [url, setUrl] = useState(ad.url);
  const [pixels, setPixels] = useState<number>(ad.pixels);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleSubmit = async () => {
  if (!title || !url || !pixels) {
    setError("All fields are required");
    return;
  }

  setLoading(true);
  setError("");

  const token = localStorage.getItem("jwt"); // ✅ get JWT token
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
        Authorization: `Bearer ${token}`, // ✅ add token here
      },
      body: JSON.stringify({
        ...ad,
        title,
        url,
        pixels,
        imageurl: ad.imageurl || "/images/Rectangle.png", // ⚠️ match backend
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to update ad");
    }

    const updatedAd = await res.json();

    // ✅ Call parent callback to update state
    onUpdate(updatedAd);
    close();
  } catch (err: unknown) {
    if (err instanceof Error)
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#052e23] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-white text-xl font-bold mb-4">Edit Ad</h2>
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
            {loading ? "Updating..." : "Update Ad"}
          </button>
        </div>
      </div>
    </div>
  );
}
