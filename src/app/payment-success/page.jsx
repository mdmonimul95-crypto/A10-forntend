"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, Home, Receipt, Sun, Moon, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

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
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 sm:p-6 transition-colors">
      <div className="max-w-md w-full flex flex-col gap-5 sm:gap-6 relative">

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute -top-2 right-0 sm:top-0 sm:right-0 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>

        {/* Success Icon */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center pt-8 sm:pt-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
            <div className="relative z-10 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="size-10 sm:size-12 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Payment Successful!
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Your order has been placed successfully.
            </p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800/60">
            <Receipt className="size-4 text-purple-500 dark:text-purple-400" />
            <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">
              Order Summary
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-500">Order ID</span>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 break-all">
                #{orderId?.slice(0, 12) || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-500">Transaction ID</span>
              <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300 break-all">
                {transactionId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-500">Payment Date</span>
              <span className="text-xs text-zinc-700 dark:text-zinc-300">{paymentDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-500">Payment Status</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                ✓ Paid
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800/60">
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Total Paid</span>
              <span className="text-lg sm:text-xl font-extrabold text-purple-600 dark:text-purple-400">
                ৳{Number(amount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard/buyer/my-orders")}
            className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20 text-sm sm:text-base"
          >
            <ShoppingBag className="size-4 sm:size-5" />
            View My Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium rounded-xl transition-all text-sm sm:text-base"
          >
            <Home className="size-4 sm:size-5" />
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

function PaymentSuccessFallback() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center transition-colors">
      <Loader2 className="size-6 animate-spin text-purple-500 dark:text-purple-400" />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}