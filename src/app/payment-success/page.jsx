"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, Home, Receipt } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const transactionId = searchParams.get("transactionId") || "N/A";

  const paymentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full flex flex-col gap-6">

        {/* Success Icon */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
            <div className="relative z-10 h-24 w-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="size-12 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-100">
              Payment Successful!
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Your order has been placed successfully.
            </p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/60">
            <Receipt className="size-4 text-purple-400" />
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
              Order Summary
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Order ID</span>
              <span className="text-xs font-mono text-cyan-400">
                #{orderId?.slice(0, 12) || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Transaction ID</span>
              <span className="text-xs font-mono text-zinc-300">
                {transactionId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Payment Date</span>
              <span className="text-xs text-zinc-300">{paymentDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Payment Status</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/30 border border-emerald-900/60 text-emerald-400">
                ✓ Paid
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
              <span className="text-sm font-bold text-zinc-200">Total Paid</span>
              <span className="text-xl font-extrabold text-purple-400">
                ৳{Number(amount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard/buyer/my-orders")}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20"
          >
            <ShoppingBag className="size-5" />
            View My Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium rounded-xl transition-all"
          >
            <Home className="size-5" />
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}