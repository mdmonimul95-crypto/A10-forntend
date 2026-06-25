"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Receipt, User, Search, Wallet, TrendingUp, CreditCard } from "lucide-react";

const initialPayments = [
  {
    transactionId: "BKASH-TRX-987654321",
    buyerName: "Md. Rakib Hasan",
    buyerId: "user001",
    orderId: "order001",
    amountCharged: 35000,
    paymentMethod: "bKash",
    paymentStatus: "success",
    paymentDate: "19/06/2026, 11:04:20",
  },
  {
    transactionId: "BKASH-TRX-887211034",
    buyerName: "Nusrat Jahan",
    buyerId: "user002",
    orderId: "order002",
    amountCharged: 4500,
    paymentMethod: "Nagad",
    paymentStatus: "pending",
    paymentDate: "18/06/2026, 15:03:05",
  },
  {
    transactionId: "BKASH-TRX-774120983",
    buyerName: "Tanvir Ahmed",
    buyerId: "user003",
    orderId: "order003",
    amountCharged: 38000,
    paymentMethod: "Stripe Card",
    paymentStatus: "failed",
    paymentDate: "18/06/2026, 14:33:22",
  },
  {
    transactionId: "BKASH-TRX-665098213",
    buyerName: "Anika Roy",
    buyerId: "user004",
    orderId: "order004",
    amountCharged: 1800,
    paymentMethod: "Stripe Card",
    paymentStatus: "refunded",
    paymentDate: "18/06/2026, 11:15:40",
  },
];

const statusStyles = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const statusOptions = ["all", "success", "pending", "failed", "refunded"];

export default function AllPaymentsAdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtering logic (client-side for now — will move to API query params in Phase 8)
  const filteredPayments = useMemo(() => {
    return initialPayments.filter((item) => {
      const matchesSearch =
        item.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Revenue summary (only counts successful payments)
  const totalRevenue = useMemo(
    () =>
      initialPayments
        .filter((item) => item.paymentStatus === "success")
        .reduce((sum, item) => sum + item.amountCharged, 0),
    []
  );

  const successCount = initialPayments.filter((item) => item.paymentStatus === "success").length;

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
      {/* Header Title Section */}
      <div className="mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Payment Transactions Log
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Monitor all buyer payments and revenue across ReSell Hub.
        </p>
      </div>

      {/* Revenue Summary Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Wallet className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Revenue</p>
            <p className="text-xl font-bold text-zinc-100">৳{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Successful Payments</p>
            <p className="text-xl font-bold text-zinc-100">{successCount}</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-zinc-500/10 border border-zinc-500/20">
            <Receipt className="h-5 w-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Transactions</p>
            <p className="text-xl font-bold text-zinc-100">{initialPayments.length}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter Controls */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by transaction ID, buyer name, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50 transition-colors capitalize"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status} className="bg-zinc-900 capitalize">
              {status === "all" ? "All Statuses" : status}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container Wrapper */}
      <div className="max-w-7xl mx-auto overflow-hidden bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-xs shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/20">
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
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-6 text-center text-zinc-500 text-sm">
                    No transactions match your search/filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((item, index) => (
                  <tr 
                    key={index} 
                    className="transition-colors hover:bg-zinc-800/10"
                  >
                    {/* Transaction ID */}
                    <td className="py-4 px-6 font-semibold text-cyan-400/90 whitespace-nowrap tracking-wide">
                      {item.transactionId}
                    </td>

                    {/* Buyer Details (Icon + Name + ID) */}
                    <td className="py-4 px-6 min-w-[240px]">
                      <div className="flex items-start gap-2.5">
                        <User className="size-4 text-zinc-500 mt-0.5 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-zinc-200 tracking-wide break-all">
                            {item.buyerName}
                          </span>
                          <span className="text-xs text-zinc-500 mt-0.5 font-mono break-all">
                            ID: {item.buyerId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Receipt className="size-4 text-zinc-600 shrink-0" />
                        {item.orderId}
                      </div>
                    </td>

                    {/* Amount Charged */}
                    <td className="py-4 px-6 font-bold text-emerald-400 whitespace-nowrap tracking-wide text-base">
                      ৳{item.amountCharged.toLocaleString()}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4 text-zinc-600 shrink-0" />
                        {item.paymentMethod}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md border capitalize ${statusStyles[item.paymentStatus]}`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>

                    {/* Payment Date */}
                    <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                      <div className="flex items-start gap-2 text-xs">
                        <Calendar className="size-4 text-zinc-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">
                          {item.paymentDate.split(", ")[0]},
                          <br />
                          <span className="text-zinc-500">{item.paymentDate.split(", ")[1]}</span>
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