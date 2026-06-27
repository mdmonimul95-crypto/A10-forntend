"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Receipt,
  User,
  Search,
  Wallet,
  TrendingUp,
  CreditCard,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

const statusStyles = {
  success:
    "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20",
  paid:
    "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20",
  pending:
    "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/20",
  failed:
    "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/20",
  refunded:
    "bg-zinc-100 dark:bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-500/20",
};

const statusOptions = ["all", "success", "paid", "pending", "failed", "refunded"];

export default function AllPaymentsAdminPage() {
  const { theme, setTheme } = useTheme();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`);

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected /api/payments response:", data);
          throw new Error("Invalid payments data received");
        }

        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filtering (client-side for now — will move to API query params once volume grows)
  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const transactionId = item.transactionId || "";
      const buyerName = item.buyerName || item.buyerEmail || "";
      const orderId = item.orderId || "";

      const matchesSearch =
        transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orderId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  // Revenue summary (counts both "success" and "paid" as completed)
  const totalRevenue = useMemo(
    () =>
      payments
        .filter((item) => item.paymentStatus === "success" || item.paymentStatus === "paid")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [payments]
  );

  const successCount = payments.filter(
    (item) => item.paymentStatus === "success" || item.paymentStatus === "paid"
  ).length;

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 min-h-screen flex items-center justify-center transition-colors">
        <Loader2 className="size-6 animate-spin text-purple-500 dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-6 min-h-screen transition-colors">
      {/* Header Title Section */}
      <div className="mb-6 max-w-7xl mx-auto flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Payment Transactions Log
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Monitor all buyer payments and revenue across ReSell Hub.
          </p>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all shrink-0"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4 transition-colors">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20">
            <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Total Revenue</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">৳{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4 transition-colors">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/20">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Successful Payments</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{successCount}</p>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4 transition-colors">
          <div className="p-3 rounded-xl bg-zinc-200 dark:bg-zinc-500/10 border border-zinc-300 dark:border-zinc-500/20">
            <Receipt className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Total Transactions</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter Controls */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search by transaction ID, buyer, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-purple-500/50 transition-colors capitalize"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status} className="bg-white dark:bg-zinc-900 capitalize">
              {status === "all" ? "All Statuses" : status}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container Wrapper */}
      <div className="max-w-7xl mx-auto overflow-hidden bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl backdrop-blur-xs shadow-xl transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            {/* Table Head */}
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-100/60 dark:bg-zinc-900/20">
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Buyer Details</th>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Payment Date</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 text-sm">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-6 text-center text-zinc-400 dark:text-zinc-500 text-sm">
                    No transactions found yet.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((item) => (
                  <tr
                    key={item._id}
                    className="transition-colors hover:bg-zinc-100/60 dark:hover:bg-zinc-800/10"
                  >
                    {/* Transaction ID */}
                    <td className="py-4 px-6 font-semibold text-cyan-600 dark:text-cyan-400/90 whitespace-nowrap tracking-wide">
                      {item.transactionId || "—"}
                    </td>

                    {/* Buyer Details (Icon + Name + ID) */}
                    <td className="py-4 px-6 min-w-[240px]">
                      <div className="flex items-start gap-2.5">
                        <User className="size-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-zinc-800 dark:text-zinc-200 tracking-wide break-all">
                            {item.buyerName || item.buyerEmail || "Unknown"}
                          </span>
                          {item.buyerId && (
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono break-all">
                              ID: {item.buyerId}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Receipt className="size-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
                        {item.orderId || "—"}
                      </div>
                    </td>

                    {/* Amount Charged */}
                    <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap tracking-wide text-base">
                      ৳{Number(item.amount || 0).toLocaleString()}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
                        {item.paymentMethod || "—"}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border capitalize ${statusStyles[item.paymentStatus] || statusStyles.pending}`}
                      >
                        {item.paymentStatus || "pending"}
                      </span>
                    </td>

                    {/* Payment Date */}
                    <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                      <div className="flex items-start gap-2 text-xs">
                        <Calendar className="size-4 text-zinc-400 dark:text-zinc-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}