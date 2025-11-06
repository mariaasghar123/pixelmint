import React, { useRef } from "react";

interface AddAdsProps {
  close: () => void;
}

export default function AddAds({ close }: AddAdsProps) {
  // File input reference (for click or drag-n-drop)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dummy submit handler (replace with your logic)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#052e23] relative">
      <form
        className="w-full max-w-md bg-[#072e25] rounded-xl border border-green-600 shadow-lg p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-custom mb-2 text-white tracking-wider" style={{ fontFamily: "monospace" }}>
          Place Ad
        </h1>
        {/* AD TITLE */}
        <div>
          <label className="block text-gray-200 text-sm mb-1">Ad Title</label>
          <input
            type="text"
            placeholder="Your ad title"
            className="w-full rounded-md border border-[#3dd99d] bg-transparent text-white px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
        </div>
        {/* WEBSITE URL */}
        <div>
          <label className="block text-gray-200 text-sm mb-1">Website URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            className="w-full rounded-md border border-[#3dd99d] bg-transparent text-white px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
        </div>
        {/* TELEGRAM CONTACT */}
        <div>
          <label className="block text-gray-200 text-sm mb-1">
            Telegram Contact <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="@TelegramTag"
            className="w-full rounded-md border border-[#3dd99d] bg-transparent text-white px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>
        {/* UPLOAD IMAGE */}
        <div>
          <label className="block text-gray-200 text-sm mb-1 italic">Upload Image</label>
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-xl h-32 cursor-pointer bg-[#043625]/30 transition hover:border-green-400 mb-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" d="M12 5v14m7-7H5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-gray-400">Upload Image</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        {/* PLACE AD BUTTON */}
        <button
          type="submit"
          className="w-full py-2 mt-2 rounded-md font-bold text-lg text-black"
          style={{
            background: "linear-gradient(90deg, #65e898 0%, #16b98a 100%)",
          }}
        >
          Place Ad
        </button>
        <div className="pt-2 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a className="text-[#65e898] font-semibold cursor-pointer hover:underline" href="/login">
            Sign In
          </a>
        </div>
        <button
          type="button"
          className="absolute top-4 right-4 text-white bg-red-800/40 px-4 py-1 rounded transition hover:bg-red-700/70"
          onClick={close}
        >
          Close
        </button>
      </form>
    </div>
  );
}
