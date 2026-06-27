"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  X,
  RefreshCw,
  ChevronDown,
  Loader2,
  Package,
  Clock,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

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

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function AdminManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      // Better Auth — token নেই, সরাসরি fetch
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyerInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.sellerInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.productTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      toast.success(`Order status updated to "${newStatus}".`);
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleResolveDispute = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDisputed: false }),
      });
      if (!res.ok) throw new Error("Failed");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, isDisputed: false } : o))
      );
      toast.success("Dispute resolved successfully.");
    } catch (error) {
      toast.error("Failed to resolve dispute");
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const disputedCount = orders.filter((o) => o.isDisputed).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.price || o.amount || 0), 0);

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">

      {/* Header */}
      <div className="mb-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Manage Orders</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Track order status, update progress, and resolve disputes.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all disabled:opacity-50 w-fit"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Package className="size-4" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-bold text-zinc-100">{totalOrders}</p>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="size-4" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-amber-400">{pendingOrders}</p>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Disputed</p>
              <p className="text-2xl font-bold text-red-400">{disputedCount}</p>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="size-4" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Revenue</p>
              <p className="text-2xl font-bold text-emerald-400">৳{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Banner */}
      {disputedCount > 0 && (
        <div className="max-w-7xl mx-auto mb-4 p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-center gap-2.5 text-sm text-red-400">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{disputedCount} order{disputedCount !== 1 ? "s" : ""} currently disputed and require attention.</span>
        </div>
      )}

      {/* Search & Filter */}
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
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-8 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none min-w-[150px]"
          >
            {statusFilterOptions.map((status) => (
              <option key={status} value={status} className="bg-zinc-900">
                {status === "all" ? "All Statuses" : status}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-10 text-purple-500 animate-spin" />
            <p className="text-zinc-500 text-sm">Loading orders...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto overflow-hidden bg-zinc-900/40 border border-zinc-800/80 rounded-2xl shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/20">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Buyer / Seller</th>
                  <th className="py-4 px-6 text-center">Payment</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Dispute</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 px-6 text-center text-zinc-500">
                      No orders match your search/filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="transition-colors hover:bg-zinc-800/10">
                      <td className="py-4 px-6 font-semibold text-cyan-400/90 whitespace-nowrap">
                        #{order._id?.slice(0, 8)}
                      </td>
                      <td className="py-4 px-6 max-w-[200px]">
                        <span className="text-zinc-200 font-medium line-clamp-2">
                          {order.productTitle || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex flex-col text-xs">
                          <span className="text-zinc-300">Buyer: <span className="text-zinc-100 font-medium">{order.buyerInfo?.name || "N/A"}</span></span>
                          <span className="text-zinc-500 mt-0.5">Seller: <span className="text-zinc-400 font-medium">{order.sellerInfo?.name || "N/A"}</span></span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border capitalize ${paymentStatusStyles[order.paymentStatus] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border cursor-pointer focus:outline-none transition-all ${orderStatusStyles[order.orderStatus] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"} ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {orderStatusFlow.map((status) => (
                            <option key={status} value={status} className="bg-zinc-900 text-zinc-200">{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        {order.isDisputed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-950/30 border border-red-900/50 text-red-400">
                            <AlertTriangle className="size-3.5" /> Disputed
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-zinc-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="size-3.5 text-zinc-600" />
                          {formatDate(order.createdAt || order.orderDate)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(order)}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all"
                          >
                            <Eye className="size-4" />
                          </button>
                          {order.isDisputed && (
                            <button
                              onClick={() => handleResolveDispute(order._id)}
                              className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
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
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-zinc-100">Order Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Order ID</p>
                  <p className="text-sm font-mono text-cyan-400">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Date</p>
                  <p className="text-sm text-zinc-300">{formatDate(selectedOrder.createdAt || selectedOrder.orderDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Payment</p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md border capitalize mt-1 ${paymentStatusStyles[selectedOrder.paymentStatus] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>
                    {selectedOrder.paymentStatus || "pending"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Status</p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md border mt-1 ${orderStatusStyles[selectedOrder.orderStatus] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Buyer Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Name</p>
                    <p className="text-zinc-200">{selectedOrder.buyerInfo?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Email</p>
                    <p className="text-zinc-200">{selectedOrder.buyerInfo?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Seller Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Name</p>
                    <p className="text-zinc-200">{selectedOrder.sellerInfo?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Email</p>
                    <p className="text-zinc-200">{selectedOrder.sellerInfo?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="col-span-2">
                    <p className="text-xs text-zinc-500">Product</p>
                    <p className="text-zinc-200 font-medium">{selectedOrder.productTitle || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Amount</p>
                    <p className="text-zinc-200 font-bold">৳{(selectedOrder.price || selectedOrder.amount || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Dispute Status</h3>
                <div className="flex items-center gap-2">
                  {selectedOrder.isDisputed ? (
                    <>
                      <AlertTriangle className="size-5 text-red-400" />
                      <span className="text-red-400 font-medium">This order is disputed</span>
                      <button
                        onClick={() => { handleResolveDispute(selectedOrder._id); setShowDetailsModal(false); }}
                        className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Resolve Dispute
                      </button>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">No dispute on this order</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}