"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type EditProfileModalProps = {
  user: {
    full_name?: string;
    phone?: string;
    Email?: string
  };
  close: (data?: { full_name?: string; phone?: string; Email?: string }) => void;
};

export default function EditProfileModal({ user, close }: EditProfileModalProps) {
  const [full_name, setFullName] = useState<string>(user.full_name || "");
  const [phone, setPhone] = useState<string>(user.phone || "");
  // const [Email, setEmail] = useState<string>(user.Email ||"");

 const handleSave = async () => {
  const updatedUser = { full_name, phone };

  const token = localStorage.getItem("jwt"); // dashboard ke token ke jaisa

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedUser),
  });

  if (!res.ok) {
    toast.success("Failed to update profile ❌");
    return;
  }

  const data = await res.json(); // ✅ backend se updated user milega
  toast.success("Profile Updated ✅");

  close(data); // ✅ Updated user ko parent (Dashboard) me bhej do
};


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-[90%] max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-gray-800 p-2 rounded mb-3"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-gray-800 p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={() => close()} className="px-4 py-2 bg-gray-600 rounded">            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
