"use client";

import { useEffect, useState } from "react";

interface Purchase {
  id: string;
  pixels: number;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
}

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          setError("User not logged in");
          setLoading(false);
          return;
        }
        const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL // Render backend
    : "http://localhost:3000"; // Local NestJS backend

        const res = await fetch(
          `${API_URL}/payments/my-purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch purchases");
        }

        const data = await res.json();
        setPurchases(data);
      } catch (err: unknown ) {
        setError( "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) return <p className="text-gray-300">Loading purchases...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="bg-white/10 p-6 rounded-xl border border-gray-700 mt-6">
      <h2 className="text-2xl font-bold text-[#00ff88] mb-4">🧾 Your Purchase History</h2>

      {purchases.length === 0 ? (
        <p className="text-gray-400">No purchases yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-gray-400 uppercase border-b border-gray-600">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Pixels</th>
                <th className="px-4 py-2">Amount ($)</th>
                <th className="px-4 py-2">Currency</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b border-gray-700">
                  <td className="px-4 py-2">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{p.pixels}</td>
                  <td className="px-4 py-2">
                    {(p.amount_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{p.currency.toUpperCase()}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      p.status === "succeeded"
                        ? "text-green-400"
                        : p.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
