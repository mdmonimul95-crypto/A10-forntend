"use client";

import React, { useEffect, useState } from "react";
import { Eye, XCircle, AlertCircle, Loader2, ShoppingBag, Clock, CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statusColor = (status) => {
  switch (status) {
    case "Pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Accepted": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Processing": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Shipped": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    case "Delivered": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
    default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

const cancellableStatuses = ["Pending", "Accepted"];

export default function BuyerMyOrdersPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

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
  };

  const fetchOrders = async () => {
    if (!user?.email) return;
    try {
      setLoadingOrders(true);
      const res = await fetch(`${API_URL}/api/orders/buyer/${user.email}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch buyer orders:", error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.email]);

  const handleCancel = async (id) => {
    try {
      setCancellingId(id);
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "Cancelled" }),
      });
      await res.json();

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancellingId(null);
      setCancelConfirmId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="size-3.5" />;
      case "Accepted": return <CheckCircle className="size-3.5" />;
      case "Processing": return <Package className="size-3.5" />;
      case "Shipped": return <Package className="size-3.5" />;
      case "Delivered": return <CheckCircle className="size-3.5" />;
      case "Cancelled": return <XCircle className="size-3.5" />;
      default: return null;
    }
  };

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === "Pending").length;
  const deliveredOrders = orders.filter(o => o.orderStatus === "Delivered").length;
  const cancelledOrders = orders.filter(o => o.orderStatus === "Cancelled").length;

  if (isPending || loadingOrders) {
    return (
      <div className={`w-full min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${themeStyles.textSecondary}`}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${themeStyles.bg} ${themeStyles.text} p-4 sm:p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">My Orders</h1>
          <p className={`text-sm ${themeStyles.textSecondary} mt-1`}>
            View and manage all your orders. You can cancel before shipment.
          </p>
        </div>

        {/* Stats Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <ShoppingBag className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className={`text-sm ${themeStyles.textSecondary}`}>Total</p>
                  <p className={`text-xl font-bold ${themeStyles.text}`}>{totalOrders}</p>
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
                  <p className="text-xl font-bold text-amber-400">{pendingOrders}</p>
                </div>
              </div>
            </div>
            <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <CheckCircle className="size-5 text-emerald-400" />
                </div>
                <div>
                  <p className={`text-sm ${themeStyles.textSecondary}`}>Delivered</p>
                  <p className="text-xl font-bold text-emerald-400">{deliveredOrders}</p>
                </div>
              </div>
            </div>
            <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10">
                  <XCircle className="size-5 text-red-400" />
                </div>
                <div>
                  <p className={`text-sm ${themeStyles.textSecondary}`}>Cancelled</p>
                  <p className="text-xl font-bold text-red-400">{cancelledOrders}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className={`${themeStyles.emptyBg} border border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px] sm:min-h-[400px]`}>
            <div className={`p-4 rounded-full ${themeStyles.cardBg} ${themeStyles.border} border ${themeStyles.textMuted} mb-4`}>
              <AlertCircle className="size-8" />
            </div>
            <h3 className={`text-lg font-bold ${themeStyles.text}`}>No Orders Yet</h3>
            <p className={`text-sm ${themeStyles.textMuted} max-w-sm mt-1.5 mb-6`}>
              You have not placed any orders yet. Browse products to get started!
            </p>
            <Link
              href="/products"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Orders Table */}
            <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl overflow-hidden shadow-sm`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className={`border-b ${themeStyles.border} ${themeStyles.tableHeader}`}>
                      <th className={`py-4 px-5 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                        Product
                      </th>
                      <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted} hidden sm:table-cell`}>
                        Seller
                      </th>
                      <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                        Price
                      </th>
                      <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted} hidden md:table-cell`}>
                        Date
                      </th>
                      <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted} hidden lg:table-cell`}>
                        Payment
                      </th>
                      <th className={`py-4 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                        Status
                      </th>
                      <th className={`py-4 px-5 text-right text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-zinc-800/50" : "divide-gray-200/50"}`}>
                    {orders.map((order) => {
                      const title = order.productTitle || order.title || "Product";
                      const category = order.category || "N/A";
                      const price = order.price || order.amount || 0;
                      const seller = order.sellerInfo?.name || order.seller || "N/A";
                      const date = order.createdAt
                        ? new Date(order.createdAt).toISOString().split("T")[0]
                        : "N/A";
                      const paymentStatus = order.paymentStatus || "pending";

                      return (
                        <tr key={order._id} className={`${themeStyles.hoverBg} transition-colors`}>
                          <td className="py-4 px-5">
                            <div>
                              <p className={`font-medium text-sm ${themeStyles.text}`}>{title}</p>
                              <p className={`text-xs ${themeStyles.textMuted}`}>{category}</p>
                            </div>
                          </td>
                          <td className={`py-4 px-4 text-sm ${themeStyles.textSecondary} hidden sm:table-cell`}>
                            {seller}
                          </td>
                          <td className={`py-4 px-4 font-semibold text-sm text-emerald-400`}>
                            ৳{Number(price).toLocaleString()}
                          </td>
                          <td className={`py-4 px-4 text-sm ${themeStyles.textMuted} hidden md:table-cell`}>
                            {date}
                          </td>
                          <td className="py-4 px-4 hidden lg:table-cell">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              paymentStatus === "paid"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : paymentStatus === "failed"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}>
                              {paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor(order.orderStatus)}`}>
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/dashboard/buyer/my-orders/${order._id}`}
                                className={`p-2 rounded-lg ${themeStyles.cardBg} ${themeStyles.border} border ${themeStyles.textMuted} hover:${themeStyles.text} transition-colors`}
                                title="View Details"
                              >
                                <Eye className="size-4" />
                              </Link>

                              {cancellableStatuses.includes(order.orderStatus) && (
                                cancelConfirmId === order._id ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleCancel(order._id)}
                                      disabled={cancellingId === order._id}
                                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                                    >
                                      {cancellingId === order._id ? (
                                        <Loader2 className="size-3.5 animate-spin" />
                                      ) : (
                                        "Confirm"
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setCancelConfirmId(null)}
                                      className={`px-3 py-1.5 rounded-lg ${themeStyles.cardBg} ${themeStyles.border} border ${themeStyles.textSecondary} hover:${themeStyles.text} text-xs font-medium transition-colors`}
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setCancelConfirmId(order._id)}
                                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                    title="Cancel Order"
                                  >
                                    <XCircle className="size-4" />
                                  </button>
                                ) 

                                
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Status Legend */}
            <div className="flex flex-wrap gap-2 mt-4">
              <p className={`text-xs ${themeStyles.textMuted} w-full sm:w-auto`}>Status Legend:</p>
              {["Pending", "Accepted", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                <span key={s} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${statusColor(s)}`}>
                  {getStatusIcon(s)}
                  {s}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}