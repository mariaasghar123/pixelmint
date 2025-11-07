import { useState } from "react";
import { X } from "lucide-react"; // ✅ close icon (install lucide-react if not already)

interface BuyPixelsFallbackProps {
  userId: string;
  pixels: number;
  price: number;
  onClose?: () => void; // ✅ callback to close popup
}

export default function BuyPixelsFallback({
  userId,
  pixels,
  price,
  onClose,
}: BuyPixelsFallbackProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pixels,
          currency: "usd",
          walletAddress: "dummy-wallet-address",
        }),
      });

      const data = await res.json();
      console.log("Stripe session:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to create payment intent");
      }

      // ✅ Save purchase
      const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/save-purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          pixels,
        }),
      });

      const saveData = await saveRes.json();
      console.log("Purchase saved:", saveData);

      setSuccess(true);
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success message UI
  if (success)
    return (
      <div className="bg-[#00291c] text-white p-6 rounded-2xl shadow-lg relative max-w-sm mx-auto text-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-green-400 text-xl font-bold mb-2">✅ Payment Successful!</h2>
        <p className="text-gray-300 mb-2">
          Your pixels have been reserved successfully.
        </p>
        <button
          onClick={onClose}
          className="mt-3 bg-[#00ff88] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00cc6e]"
        >
          Close
        </button>
      </div>
    );

  // ✅ Payment UI
  return (
    <div className="bg-[#00291c] text-white p-6 rounded-2xl shadow-lg w-[300px] sm:w-[600px]  mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Confirm Payment</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <p className="text-gray-300">Total Pixels: <span className="font-bold">{pixels}</span></p>
      <p className="text-gray-300 mb-4">Amount: <span className="font-bold">${price}</span></p>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-[#00ff88] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#00cc6e] disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
