"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AlertCircle, Check, X, Truck, Package, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
// import { toast } from "react-hot-toast";

const statusColor = (status) => {
  switch (status) {
    case "Pending": return "bg-amber-950/30 border-amber-900/60 text-amber-400";
    case "Accepted": return "bg-blue-950/30 border-blue-900/60 text-blue-400";
    case "Processing": return "bg-purple-950/30 border-purple-900/60 text-purple-400";
    case "Shipped": return "bg-cyan-950/30 border-cyan-900/60 text-cyan-400";
    case "Delivered": return "bg-emerald-950/30 border-emerald-900/60 text-emerald-400";
    case "Cancelled": return "bg-red-950/30 border-red-900/60 text-red-400";
    default: return "bg-zinc-900/60 border-zinc-700 text-zinc-400";
  }
};

const statusFlow = ["Pending", "Accepted", "Processing", "Shipped", "Delivered"];

export default function SellerManageOrdersPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

const fetchOrders = useCallback(async () => {
  if (!user?.email) return;
  try {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller/${user?.email}`
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
}, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    fetchOrders();
  }, [user?.email, fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`,
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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col gap-4 p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-zinc-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Manage Orders
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Accept, reject, and update delivery status of incoming orders.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="w-full bg-zinc-900/20 border border-dashed border-zinc-900 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 mb-4">
              <AlertCircle className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200">No Orders Yet</h3>
            <p className="text-sm text-zinc-500 max-w-sm mt-1.5">
              You have not received any orders yet.
            </p>
          </div>
        ) : (
          <div className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/10 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-5">Product</th>
                  <th className="py-4 px-4">Buyer</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {orders.map((order) => {
                  const nextStatus = getNextStatus(order.orderStatus);
                  const isCancelled = order.orderStatus === "Cancelled";
                  const isDelivered = order.orderStatus === "Delivered";
                  const isPending = order.orderStatus === "Pending";

                  return (
                    <tr key={order._id} className="hover:bg-zinc-900/10 transition-colors">

                      {/* Product */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-sm text-zinc-100">
                            {order.productTitle || "Product"}
                          </span>
                          <span className="text-xs text-zinc-500">
                            ID: {order._id?.slice(-6)}
                          </span>
                        </div>
                      </td>

                      {/* Buyer */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-zinc-200">
                            {order.buyerInfo?.name}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {order.buyerInfo?.email}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-bold text-sm text-zinc-200">
                        ৳{(order.price || 0).toLocaleString()}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-sm text-zinc-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-400"
                            : "bg-amber-950/30 border-amber-900/60 text-amber-400"
                        }`}>
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-2">

                          {/* Pending — Accept or Reject */}
                          {isPending && (
                            <>
                              <button
                                onClick={() => updateStatus(order._id, "Accepted")}
                                disabled={updatingId === order._id}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/60 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                              >
                                <Check className="size-3.5" />
                                Accept
                              </button>
                              <button
                                onClick={() => updateStatus(order._id, "Cancelled")}
                                disabled={updatingId === order._id}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                              >
                                <X className="size-3.5" />
                                Reject
                              </button>
                            </>
                          )}

                          {/* Next Status Button */}
                          {!isPending && !isCancelled && !isDelivered && nextStatus && (
                            <button
                              onClick={() => updateStatus(order._id, nextStatus)}
                              disabled={updatingId === order._id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                            >
                              {nextStatus === "Shipped" ? (
                                <Truck className="size-3.5" />
                              ) : nextStatus === "Delivered" ? (
                                <CheckCircle className="size-3.5" />
                              ) : (
                                <Package className="size-3.5" />
                              )}
                              {nextStatus}
                            </button>
                          )}

                          {/* Delivered */}
                          {isDelivered && (
                            <span className="text-xs text-emerald-400 font-bold">
                              ✓ Completed
                            </span>
                          )}

                          {/* Cancelled */}
                          {isCancelled && (
                            <span className="text-xs text-red-400 font-bold">
                              ✗ Cancelled
                            </span>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}