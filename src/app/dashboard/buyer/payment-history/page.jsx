"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, AlertCircle, Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const statusColor = (status) => {
  switch (status) {
    case "success":
      return "bg-emerald-950/30 border-emerald-900/60 text-emerald-400";
    case "failed":
      return "bg-red-950/30 border-red-900/60 text-red-400";
    case "pending":
      return "bg-amber-950/30 border-amber-900/60 text-amber-400";
    default:
      return "bg-zinc-900/60 border-zinc-700 text-zinc-400";
  }
};

export default function BuyerPaymentHistoryPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/buyer/${user.email}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data = await res.json();
        setPayments(data);
      } catch (error) {
        toast.error("Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const filtered = payments.filter(
    (p) =>
      p.product?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = payments
    .filter((p) => p.paymentStatus === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
        <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <CreditCard className="size-6 text-purple-400" />
              Payment History
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              All your transaction records on ReSell Hub.
            </p>
          </div>

          {/* Total Spent */}
          <div className="flex flex-col bg-zinc-900/40 border border-zinc-800/60 rounded-xl px-5 py-3 self-start sm:self-center">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Total Spent
            </span>
            <span className="text-2xl font-extrabold text-emerald-400">
              ৳{totalSpent.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or transaction ID..."
            className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>
        {/* Loading */}
        {loading ? (
          <div className="w-full flex items-center justify-center py-20">
            <span className="text-zinc-400 text-sm">
              Loading payment history...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full bg-zinc-900/20 border border-dashed border-zinc-900 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 mb-4">
              <AlertCircle className="size-8" />
            </div>

            <h3 className="text-lg font-bold text-zinc-200">
              No Transactions Found
            </h3>

            <p className="text-sm text-zinc-500 max-w-sm mt-1.5">
              No payment records match your search.
            </p>
          </div>
        ) : (
                    <div className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/10 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-5">Transaction ID</th>
                  <th className="py-4 px-4">Product</th>
                  <th className="py-4 px-4">Method</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-900/60">
                {filtered.map((payment) => (
                  <tr
                    key={payment._id || payment.id}
                    className="hover:bg-zinc-900/10 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <span className="text-xs font-mono text-zinc-400 truncate block max-w-[180px]">
                        {payment.transactionId}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm text-zinc-100">
                          {payment.product}
                        </span>
                        <span className="text-xs text-zinc-500">
                          Order: {payment.orderId}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-purple-950/30 border-purple-900/60 text-purple-400">
                        {payment.paymentMethod}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-sm text-zinc-200">
                      ৳{Number(payment.amount).toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-sm text-zinc-400">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : payment.date}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusColor(
                          payment.paymentStatus
                        )}`}
                      >
                        {payment.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         )}

      </div>
    </div>
  );
}                 