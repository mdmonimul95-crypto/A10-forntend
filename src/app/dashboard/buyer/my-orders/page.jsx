"use client";

import React, { useEffect, useState } from "react";
import { Eye, XCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. http://localhost:5000

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

const cancellableStatuses = ["Pending", "Accepted"];

export default function BuyerMyOrdersPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (isPending || loadingOrders) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-sm font-medium">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">My Orders</h1>
          <p className="text-sm text-zinc-400 mt-1">
            View and manage all your orders. You can cancel before shipment.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="w-full bg-zinc-900/20 border border-dashed border-zinc-900 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 mb-4">
              <AlertCircle className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200">No Orders Yet</h3>
            <p className="text-sm text-zinc-500 max-w-sm mt-1.5 mb-6">
              You have not placed any orders yet. Browse products to get started!
            </p>
            <Link
              href="/products"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              Browse Products
            </Link>
          </div>
        ) : (

          <div className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/10 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-5">Product</th>
                  <th className="py-4 px-4">Seller</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
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
                    <tr key={order._id} className="hover:bg-zinc-900/10 transition-colors">

                      {/* Product */}
                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-sm text-zinc-100">{title}</span>
                          <span className="text-xs text-zinc-500">{category}</span>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="py-4 px-4 text-sm text-zinc-300">{seller}</td>

                      {/* Price */}
                      <td className="py-4 px-4 font-bold text-sm text-zinc-200">
                        ৳{Number(price).toLocaleString()}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-sm text-zinc-400">{date}</td>

                      {/* Payment Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                            paymentStatus === "paid"
                              ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-400"
                              : paymentStatus === "failed"
                              ? "bg-red-950/30 border-red-900/60 text-red-400"
                              : "bg-amber-950/30 border-amber-900/60 text-amber-400"
                          }`}
                        >
                          {paymentStatus}
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details */}
                          <Link
                            href={`/dashboard/buyer/my-orders/${order._id}`}
                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {/* Cancel Button — only for Pending/Accepted */}
                          {cancellableStatuses.includes(order.orderStatus) && (
                            cancelConfirmId === order._id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleCancel(order._id)}
                                  disabled={cancellingId === order._id}
                                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer disabled:opacity-60"
                                >
                                  {cancellingId === order._id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    "Confirm"
                                  )}
                                </button>
                                <button
                                  onClick={() => setCancelConfirmId(null)}
                                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setCancelConfirmId(order._id)}
                                className="p-2 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
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
        )}

        {/* Order Status Legend */}
        <div className="flex flex-wrap gap-3 mt-2">
          {["Pending", "Accepted", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <span key={s} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(s)}`}>
              {s}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
