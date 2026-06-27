"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  AlertCircle, 
  Check, 
  X, 
  Truck, 
  Package, 
  CheckCircle, 
  Loader2,
  ShoppingBag,
  Clock,
  TrendingUp,
  Eye
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import Link from "next/link";

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

const statusFlow = ["Pending", "Accepted", "Processing", "Shipped", "Delivered"];

export default function SellerManageOrdersPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/orders/seller/${user?.email}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email, API_BASE_URL]);

  useEffect(() => {
    if (!user?.email) return;
    fetchOrders();
  }, [user?.email, fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    return idx !== -1 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="size-3.5" />;
      case "Accepted": return <Check className="size-3.5" />;
      case "Processing": return <Package className="size-3.5" />;
      case "Shipped": return <Truck className="size-3.5" />;
      case "Delivered": return <CheckCircle className="size-3.5" />;
      case "Cancelled": return <X className="size-3.5" />;
      default: return null;
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Pending",
      value: orders.filter(o => o.orderStatus === "Pending").length,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "In Progress",
      value: orders.filter(o => ["Accepted", "Processing", "Shipped"].includes(o.orderStatus)).length,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Delivered",
      value: orders.filter(o => o.orderStatus === "Delivered").length,
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

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
  };

  if (loading) {
    return (
      <div className={`w-full min-h-screen ${themeStyles.bg} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${themeStyles.textSecondary}`}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${themeStyles.bg} ${themeStyles.text} p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Manage Orders</h1>
          <p className={`text-sm ${themeStyles.textSecondary} mt-1`}>
            Manage and track all your incoming orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-5 transition-all hover:shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${themeStyles.textSecondary}`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold ${themeStyles.text}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl p-12 text-center`}>
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${themeStyles.cardBg} ${themeStyles.border} border`}>
                <Package className="size-10 text-zinc-500" />
              </div>
              <h3 className="text-lg font-semibold">No Orders Yet</h3>
              <p className={`text-sm ${themeStyles.textSecondary} max-w-sm`}>
                You haven't received any orders yet. When customers place orders, they'll appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${themeStyles.border} ${themeStyles.tableHeader}`}>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden sm:table-cell">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {orders.map((order) => {
                    const nextStatus = getNextStatus(order.orderStatus);
                    const isCancelled = order.orderStatus === "Cancelled";
                    const isDelivered = order.orderStatus === "Delivered";
                    const isPending = order.orderStatus === "Pending";

                    return (
                      <tr key={order._id} className={`${themeStyles.hoverBg} transition-colors`}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-sm">{order.productTitle || "Product"}</p>
                            <p className={`text-xs ${themeStyles.textMuted}`}>#{order._id?.slice(-8)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div>
                            <p className="text-sm">{order.buyerInfo?.name || "N/A"}</p>
                            <p className={`text-xs ${themeStyles.textMuted}`}>{order.buyerInfo?.email || "N/A"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-emerald-400">
                          ৳{(order.price || order.amount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className={`text-sm ${themeStyles.textSecondary}`}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {order.paymentStatus || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Pending Actions */}
                            {isPending && (
                              <>
                                <button
                                  onClick={() => updateStatus(order._id, "Accepted")}
                                  disabled={updatingId === order._id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Check className="size-3.5" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateStatus(order._id, "Cancelled")}
                                  disabled={updatingId === order._id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <X className="size-3.5" />
                                  Reject
                                </button>
                              </>
                            )}

                            {/* Next Status */}
                            {!isPending && !isCancelled && !isDelivered && nextStatus && (
                              <button
                                onClick={() => updateStatus(order._id, nextStatus)}
                                disabled={updatingId === order._id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {updatingId === order._id ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <>
                                    {getStatusIcon(nextStatus)}
                                    {nextStatus}
                                  </>
                                )}
                              </button>
                            )}

                            {/* View Details */}
                            <Link
                              href={`/dashboard/seller/order/${order._id}`}
                              className="p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors"
                            >
                              <Eye className="size-4 text-zinc-400 hover:text-zinc-200" />
                            </Link>

                            {/* Completed/Cancelled Status */}
                            {isDelivered && (
                              <span className="text-xs font-medium text-emerald-400">✓ Completed</span>
                            )}
                            {isCancelled && (
                              <span className="text-xs font-medium text-red-400">✗ Cancelled</span>
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
        )}
      </div>
    </div>
  );
}