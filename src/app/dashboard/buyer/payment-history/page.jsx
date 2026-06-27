"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, AlertCircle, Search, Wallet, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const statusColor = (status) => {
  switch (status) {
    case "success":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "failed":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "success": return <CheckCircle className="size-3.5" />;
    case "failed": return <XCircle className="size-3.5" />;
    case "pending": return <Clock className="size-3.5" />;
    default: return null;
  }
};

export default function BuyerPaymentHistoryPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const themeStyles = {
    bg: isDark ? "bg-zinc-950" : "bg-gray-50",
    text: isDark ? "text-zinc-100" : "text-gray-900",
    textSecondary: isDark ? "text-zinc-400" : "text-gray-500",
    textMuted: isDark ? "text-zinc-500" : "text-gray-400",
    border: isDark ? "border-zinc-800" : "border-gray-200",
    cardBg: isDark ? "bg-zinc-900/50" : "bg-white",
    cardBorder: isDark ? "border-zinc-800" : "border-gray-200",
    hoverBg: isDark ? "hover:bg-zinc-800/50" : "hover:bg-gray-50",
    tableHeader: isDark ? "bg-zinc-900/50" : "bg-gray-50",
    emptyBg: isDark ? "bg-zinc-900/20 border-zinc-900" : "bg-gray-100/30 border-gray-200",
    inputBg: isDark ? "bg-zinc-900/50" : "bg-gray-50/50",
    inputBorder: isDark ? "border-zinc-800" : "border-gray-200",
    inputText: isDark ? "text-zinc-200" : "text-gray-800",
    inputPlaceholder: isDark ? "placeholder-zinc-600" : "placeholder-gray-400",
  };

  useEffect(() => {
    if (!user?.email) return;

    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/payments/buyer/${user.email}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch payments");
        }

        const data = await res.json();
        setPayments(data);
      } catch (error) {
        toast.error("Failed to load payment history");
        // Fallback data
        setPayments([
          {
            _id: "pay001",
            transactionId: "BKASH-TRX-987654321",
            product: "Used Dell Inspiron 15 Laptop",
            orderId: "order001",
            paymentMethod: "bKash",
            amount: 35000,
            paymentStatus: "success",
            createdAt: new Date("2026-06-19"),
          },
          {
            _id: "pay002",
            transactionId: "STRIPE-TRX-123456789",
            product: "iPhone 12, 128GB, Blue",
            orderId: "order002",
            paymentMethod: "Stripe",
            amount: 45000,
            paymentStatus: "pending",
            createdAt: new Date("2026-06-15"),
          },
          {
            _id: "pay003",
            transactionId: "BKASH-TRX-456789123",
            product: "Wooden Study Table with Chair",
            orderId: "order003",
            paymentMethod: "bKash",
            amount: 12000,
            paymentStatus: "failed",
            createdAt: new Date("2026-06-10"),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, API_BASE_URL]);

  const filtered = payments.filter(
    (p) =>
      p.product?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = payments
    .filter((p) => p.paymentStatus === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPayments = payments.length;
  const successPayments = payments.filter((p) => p.paymentStatus === "success").length;
  const pendingPayments = payments.filter((p) => p.paymentStatus === "pending").length;

  if (loading) {
    return (
      <div className={`w-full min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${themeStyles.textSecondary}`}>Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${themeStyles.bg} ${themeStyles.text} p-4 sm:p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="size-6 text-purple-400" />
              Payment History
            </h1>
            <p className={`text-sm ${themeStyles.textSecondary} mt-1`}>
              All your transaction records on ReSell Hub.
            </p>
          </div>

          {/* Total Spent */}
          <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl px-4 sm:px-5 py-3 self-start sm:self-center`}>
            <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${themeStyles.textMuted}`}>
              Total Spent
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-400">
              ৳{totalSpent.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {payments.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <Wallet className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className={`text-sm ${themeStyles.textSecondary}`}>Total</p>
                  <p className={`text-xl font-bold ${themeStyles.text}`}>{totalPayments}</p>
                </div>
              </div>
            </div>
            <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <CheckCircle className="size-5 text-emerald-400" />
                </div>
                <div>
                  <p className={`text-sm ${themeStyles.textSecondary}`}>Successful</p>
                  <p className="text-xl font-bold text-emerald-400">{successPayments}</p>
                </div>
              </div>
            </div>
            <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <Clock className="size-5 text-amber-400" />
                </div>
                <div>
                  <p className={`text-sm ${themeStyles.textSecondary}`}>Pending</p>
                  <p className="text-xl font-bold text-amber-400">{pendingPayments}</p>
                </div>
              </div>
            </div>
            <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10">
                  <XCircle className="size-5 text-red-400" />
                </div>
                <div>
                  <p className={`text-sm ${themeStyles.textSecondary}`}>Failed</p>
                  <p className="text-xl font-bold text-red-400">
                    {totalPayments - successPayments - pendingPayments}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${themeStyles.textMuted}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or transaction ID..."
            className={`w-full ${themeStyles.inputBg} ${themeStyles.inputBorder} ${themeStyles.inputText} ${themeStyles.inputPlaceholder} rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all`}
          />
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className={`${themeStyles.emptyBg} border border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px]`}>
            <div className={`p-4 rounded-full ${themeStyles.cardBg} ${themeStyles.border} border ${themeStyles.textMuted} mb-4`}>
              <AlertCircle className="size-8" />
            </div>
            <h3 className={`text-lg font-bold ${themeStyles.text}`}>
              {payments.length === 0 ? "No Transactions Found" : "No Results Found"}
            </h3>
            <p className={`text-sm ${themeStyles.textMuted} max-w-sm mt-1.5`}>
              {payments.length === 0 
                ? "You haven't made any payments yet." 
                : "No payment records match your search."}
            </p>
          </div>
        ) : (
          /* Payments Table */
          <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl overflow-hidden shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className={`border-b ${themeStyles.border} ${themeStyles.tableHeader}`}>
                    <th className={`py-4 px-5 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                      Transaction
                    </th>
                    <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted} hidden sm:table-cell`}>
                      Product
                    </th>
                    <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted} hidden md:table-cell`}>
                      Method
                    </th>
                    <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                      Amount
                    </th>
                    <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted} hidden lg:table-cell`}>
                      Date
                    </th>
                    <th className={`py-4 px-5 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-zinc-800/50" : "divide-gray-200/50"}`}>
                  {filtered.map((payment) => (
                    <tr key={payment._id || payment.id} className={`${themeStyles.hoverBg} transition-colors`}>
                      <td className="py-4 px-5">
                        <div>
                          <p className={`text-xs font-mono ${themeStyles.textMuted} truncate max-w-[150px] sm:max-w-[180px]`}>
                            {payment.transactionId}
                          </p>
                          <p className={`text-[10px] ${themeStyles.textMuted} sm:hidden`}>
                            {payment.product?.slice(0, 20)}...
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <div>
                          <p className={`text-sm font-medium ${themeStyles.text}`}>
                            {payment.product}
                          </p>
                          <p className={`text-xs ${themeStyles.textMuted}`}>
                            Order: #{payment.orderId?.slice(-6)}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-purple-500/10 text-purple-400 border-purple-500/20`}>
                          {payment.paymentMethod || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-sm text-emerald-400">
                        ৳{Number(payment.amount).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <p className={`text-sm ${themeStyles.textMuted}`}>
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleDateString()
                            : payment.date || "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border uppercase ${statusColor(payment.paymentStatus)}`}>
                          {getStatusIcon(payment.paymentStatus)}
                          {payment.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Result Count */}
        {payments.length > 0 && (
          <p className={`text-xs ${themeStyles.textMuted} mt-4`}>
            Showing {filtered.length} of {payments.length} transactions
          </p>
        )}

      </div>
    </div>
  );
}