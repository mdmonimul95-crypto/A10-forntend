"use client";

import React, { useState, useMemo } from "react";
import { Search, Eye, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import { toast } from "sonner";

const initialOrders = [
  {
    id: "order001",
    buyerName: "Md. Rakib Hasan",
    sellerName: "Nusrat Jahan",
    productTitle: "Used Dell Inspiron 15 Laptop",
    paymentStatus: "paid",
    orderStatus: "Processing",
    isDisputed: false,
    orderDate: "19/06/2026",
  },
  {
    id: "order002",
    buyerName: "Tanvir Ahmed",
    sellerName: "Sumi Khan",
    productTitle: "Wooden Study Table with Chair",
    paymentStatus: "paid",
    orderStatus: "Shipped",
    isDisputed: true,
    orderDate: "15/06/2026",
  },
  {
    id: "order003",
    buyerName: "Anika Roy",
    sellerName: "Dev Jhon",
    productTitle: "iPhone 12, 128GB, Blue",
    paymentStatus: "pending",
    orderStatus: "Pending",
    isDisputed: false,
    orderDate: "10/06/2026",
  },
];

const orderStatusFlow = ["Pending", "Accepted", "Processing", "Shipped", "Delivered", "Cancelled"];
const statusFilterOptions = ["all", ...orderStatusFlow];

const orderStatusStyles = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Accepted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Shipped: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const paymentStatusStyles = {
  paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminManageOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filtering (client-side for now — will move to API query params in Phase 8)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.productTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    toast.success(`Order ${orderId} status updated to "${newStatus}".`);
  };

  const handleResolveDispute = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isDisputed: false } : o))
    );
    toast.success(`Dispute resolved for order ${orderId}.`);
  };

  const handleView = (orderId) => {
    toast.info(`Viewing details for order ${orderId}.`);
  };

  const disputedCount = orders.filter((o) => o.isDisputed).length;

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Manage Orders
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Track order status, update progress, and resolve disputes across the platform.
        </p>
      </div>

      {/* Dispute Summary Banner */}
      {disputedCount > 0 && (
        <div className="max-w-7xl mx-auto mb-4 p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-center gap-2.5 text-sm text-red-400">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            {disputedCount} order{disputedCount !== 1 ? "s" : ""} currently disputed and require attention.
          </span>
        </div>
      )}

      {/* Search + Filter Controls */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by order ID, buyer, seller, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50 transition-colors"
        >
          {statusFilterOptions.map((status) => (
            <option key={status} value={status} className="bg-zinc-900">
              {status === "all" ? "All Statuses" : status}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto overflow-hidden bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-xs shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/20">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Buyer / Seller</th>
                <th className="py-4 px-6 text-center">Payment</th>
                <th className="py-4 px-6">Order Status</th>
                <th className="py-4 px-6 text-center">Dispute</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 px-6 text-center text-zinc-500 text-sm">
                    No orders match your search/filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-zinc-800/10">
                    {/* Order ID */}
                    <td className="py-4 px-6 font-semibold text-cyan-400/90 whitespace-nowrap">
                      {order.id}
                    </td>

                    {/* Product */}
                    <td className="py-4 px-6 max-w-[200px]">
                      <span className="text-zinc-200 font-medium line-clamp-2">
                        {order.productTitle}
                      </span>
                    </td>

                    {/* Buyer / Seller */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex flex-col text-xs">
                        <span className="text-zinc-300">Buyer: <span className="text-zinc-100 font-medium">{order.buyerName}</span></span>
                        <span className="text-zinc-500 mt-0.5">Seller: <span className="text-zinc-400 font-medium">{order.sellerName}</span></span>
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border capitalize ${paymentStatusStyles[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status (editable) */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border cursor-pointer focus:outline-none ${orderStatusStyles[order.orderStatus]}`}
                      >
                        {orderStatusFlow.map((status) => (
                          <option key={status} value={status} className="bg-zinc-900 text-zinc-200">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Dispute Indicator */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      {order.isDisputed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-950/30 border border-red-900/50 text-red-400">
                          <AlertTriangle className="size-3.5" />
                          Disputed
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3.5 text-zinc-600" />
                        {order.orderDate}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(order.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all"
                          title="View Order Details"
                        >
                          <Eye className="size-4" />
                        </button>

                        {order.isDisputed && (
                          <button
                            onClick={() => handleResolveDispute(order.id)}
                            className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                            title="Resolve Dispute"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                        )}
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