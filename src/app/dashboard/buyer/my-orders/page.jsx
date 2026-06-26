"use client";

import React, { useState } from "react";
import { Eye, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

// TODO: replace with real data from API
const initialOrders = [
  {
    id: "order001",
    title: "Used Dell Inspiron 15 Laptop",
    category: "Electronics",
    price: 35000,
    quantity: 1,
    orderStatus: "Pending",
    paymentStatus: "paid",
    date: "2025-06-20",
    seller: "Nusrat Jahan",
  },
  {
    id: "order002",
    title: "Wooden Study Table",
    category: "Furniture",
    price: 8000,
    quantity: 1,
    orderStatus: "Processing",
    paymentStatus: "paid",
    date: "2025-06-18",
    seller: "Karim Uddin",
  },
  {
    id: "order003",
    title: "Samsung Galaxy A52",
    category: "Mobile Phones",
    price: 22000,
    quantity: 1,
    orderStatus: "Shipped",
    paymentStatus: "paid",
    date: "2025-06-15",
    seller: "Tasnim Akter",
  },
  {
    id: "order004",
    title: "Nike Running Shoes",
    category: "Fashion",
    price: 4500,
    quantity: 1,
    orderStatus: "Delivered",
    paymentStatus: "paid",
    date: "2025-06-10",
    seller: "Rafiq Islam",
  },
  {
    id: "order005",
    title: "Honda CB150R",
    category: "Vehicles",
    price: 180000,
    quantity: 1,
    orderStatus: "Cancelled",
    paymentStatus: "paid",
    date: "2025-06-05",
    seller: "Sabbir Ahmed",
  },
];

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
  const [orders, setOrders] = useState(initialOrders);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  const handleCancel = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, orderStatus: "Cancelled" } : order
      )
    );
    setCancelConfirmId(null);
  };

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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-900/10 transition-colors">

                    {/* Product */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm text-zinc-100">{order.title}</span>
                        <span className="text-xs text-zinc-500">{order.category}</span>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className="py-4 px-4 text-sm text-zinc-300">{order.seller}</td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-sm text-zinc-200">
                      ৳{order.price.toLocaleString()}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-sm text-zinc-400">{order.date}</td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-950/30 border-emerald-900/60 text-emerald-400 uppercase">
                        {order.paymentStatus}
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
                          href={`/dashboard/buyer/my-orders/${order.id}`}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                        >
                          <Eye className="size-4" />
                        </Link>

                        {/* Cancel Button — only for Pending/Accepted */}
                        {cancellableStatuses.includes(order.orderStatus) && (
                          cancelConfirmId === order.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCancel(order.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer"
                              >
                                Confirm
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
                              onClick={() => setCancelConfirmId(order.id)}
                              className="p-2 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                            >
                              <XCircle className="size-4" />
                            </button>
                          )
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
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