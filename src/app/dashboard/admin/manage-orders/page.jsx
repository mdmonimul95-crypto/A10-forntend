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
import { useTheme } from "next-themes";

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

  // Use next-themes hook
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
      // Fallback data
      setOrders([
        {
          _id: "order001",
          buyerInfo: { name: "Md. Rakib Hasan", email: "rakib@gmail.com" },
          sellerInfo: { name: "Nusrat Jahan", email: "nusrat@gmail.com" },
          productTitle: "Used Dell Inspiron 15 Laptop",
          paymentStatus: "paid",
          orderStatus: "Processing",
          isDisputed: false,
          createdAt: new Date("2026-06-19"),
          amount: 35000,
        },
        {
          _id: "order002",
          buyerInfo: { name: "Tanvir Ahmed", email: "tanvir@gmail.com" },
          sellerInfo: { name: "Sumi Khan", email: "sumi@gmail.com" },
          productTitle: "Wooden Study Table with Chair",
          paymentStatus: "paid",
          orderStatus: "Shipped",
          isDisputed: true,
          createdAt: new Date("2026-06-15"),
          amount: 12000,
        },
        {
          _id: "order003",
          buyerInfo: { name: "Anika Roy", email: "anika@gmail.com" },
          sellerInfo: { name: "Dev Jhon", email: "dev@gmail.com" },
          productTitle: "iPhone 12, 128GB, Blue",
          paymentStatus: "pending",
          orderStatus: "Pending",
          isDisputed: false,
          createdAt: new Date("2026-06-10"),
          amount: 45000,
        },
      ]);
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
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/resolve-dispute`, {
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

  // Theme classes using next-themes
  const bgClass = isDark ? "bg-zinc-950" : "bg-gray-50";
  const textClass = isDark ? "text-zinc-100" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-zinc-400" : "text-gray-600";
  const textMutedClass = isDark ? "text-zinc-500" : "text-gray-500";
  const borderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const cardBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const inputBgClass = isDark ? "bg-zinc-900/60" : "bg-white/60";
  const inputBorderClass = isDark ? "border-zinc-800" : "border-gray-200";
  const tableBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const tableBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const modalBgClass = isDark ? "bg-zinc-900" : "bg-white";
  const modalBorderClass = isDark ? "border-zinc-800" : "border-gray-200";
  const hoverBgClass = isDark ? "hover:bg-zinc-800/10" : "hover:bg-gray-100/50";
  const selectBgClass = isDark ? "bg-zinc-900" : "bg-white";
  const statBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${bgClass} ${textClass} p-4 sm:p-6`}>

      {/* Header */}
      <div className="mb-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${textClass}`}>
              Manage Orders
            </h1>
            <p className={`text-sm ${textSecondaryClass} mt-1`}>
              Track order status, update progress, and resolve disputes.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className={`p-2 rounded-lg border transition-all disabled:opacity-50 w-fit ${cardBgClass} ${borderClass} ${textSecondaryClass} hover:${textClass}`}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
          <div className={`rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border transition-colors ${statBgClass} ${borderClass}`}>
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Package className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] sm:text-xs uppercase tracking-wider truncate ${textMutedClass}`}>
                Total Orders
              </p>
              <p className={`text-lg sm:text-2xl font-bold ${textClass}`}>{totalOrders}</p>
            </div>
          </div>
          
          <div className={`rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border transition-colors ${statBgClass} ${borderClass}`}>
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] sm:text-xs uppercase tracking-wider truncate ${textMutedClass}`}>
                Pending
              </p>
              <p className="text-lg sm:text-2xl font-bold text-amber-400">{pendingOrders}</p>
            </div>
          </div>
          
          <div className={`rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border transition-colors ${statBgClass} ${borderClass}`}>
            <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] sm:text-xs uppercase tracking-wider truncate ${textMutedClass}`}>
                Disputed
              </p>
              <p className="text-lg sm:text-2xl font-bold text-red-400">{disputedCount}</p>
            </div>
          </div>
          
          <div className={`rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border transition-colors ${statBgClass} ${borderClass}`}>
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] sm:text-xs uppercase tracking-wider truncate ${textMutedClass}`}>
                Revenue
              </p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-400">৳{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Banner */}
      {disputedCount > 0 && (
        <div className="max-w-7xl mx-auto mb-4 p-3 sm:p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-center gap-2.5 text-xs sm:text-sm text-red-400">
          <AlertTriangle className="size-4 shrink-0" />
          <span className="truncate">
            {disputedCount} order{disputedCount !== 1 ? "s" : ""} currently disputed and require attention.
          </span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textMutedClass}`} />
          <input
            type="text"
            placeholder="Search by order ID, buyer, seller, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm transition-colors focus:outline-none focus:border-purple-500/50 border ${inputBgClass} ${inputBorderClass} ${textClass} placeholder:${textMutedClass}`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${textMutedClass} hover:${textClass}`}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-auto">
          <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textMutedClass}`} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full sm:w-auto rounded-xl pl-10 pr-8 py-2.5 text-sm transition-colors focus:outline-none focus:border-purple-500/50 appearance-none min-w-[130px] sm:min-w-[150px] border ${inputBgClass} ${inputBorderClass} ${textClass}`}
          >
            {statusFilterOptions.map((status) => (
              <option key={status} value={status} className={selectBgClass}>
                {status === "all" ? "All Statuses" : status}
              </option>
            ))}
          </select>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${textMutedClass}`} />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-10 text-purple-500 animate-spin" />
            <p className={`text-sm ${textMutedClass}`}>Loading orders...</p>
          </div>
        </div>
      ) : (
        <div className={`max-w-7xl mx-auto overflow-hidden rounded-2xl shadow-xl border transition-colors ${tableBgClass} ${tableBorderClass}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-[900px]">
              <thead>
                <tr className={`border-b text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${textMutedClass} ${isDark ? "border-zinc-800/80 bg-zinc-900/20" : "border-gray-200/80 bg-gray-50/50"}`}>
                  <th className="py-3 sm:py-4 px-3 sm:px-6">Order ID</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6">Product</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">Buyer / Seller</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 text-center">Payment</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6">Status</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 text-center hidden sm:table-cell">Dispute</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">Date</th>
                  <th className="py-3 sm:py-4 px-3 sm:px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs sm:text-sm ${isDark ? "divide-zinc-800/60" : "divide-gray-200/60"}`}>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={`py-10 px-6 text-center ${textMutedClass}`}>
                      No orders match your search/filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className={`transition-colors ${hoverBgClass}`}>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-cyan-400/90 whitespace-nowrap text-xs sm:text-sm">
                        #{order._id?.slice(0, 8)}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 max-w-[120px] sm:max-w-[200px]">
                        <span className={`font-medium line-clamp-2 text-xs sm:text-sm ${textClass}`}>
                          {order.productTitle || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap hidden md:table-cell">
                        <div className="flex flex-col text-[10px] sm:text-xs">
                          <span className={textSecondaryClass}>
                            Buyer: <span className={`font-medium ${textClass}`}>{order.buyerInfo?.name || "N/A"}</span>
                          </span>
                          <span className={`mt-0.5 ${textMutedClass}`}>
                            Seller: <span className={`font-medium ${textSecondaryClass}`}>{order.sellerInfo?.name || "N/A"}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-center whitespace-nowrap">
                        <span className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-md border capitalize ${
                          paymentStatusStyles[order.paymentStatus] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }`}>
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating}
                          className={`text-[10px] sm:text-xs font-semibold rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 border cursor-pointer focus:outline-none transition-all max-w-[90px] sm:max-w-full ${
                            orderStatusStyles[order.orderStatus] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                          } ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {orderStatusFlow.map((status) => (
                            <option key={status} value={status} className={selectBgClass}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-center whitespace-nowrap hidden sm:table-cell">
                        {order.isDisputed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-red-950/30 border border-red-900/50 text-red-400 whitespace-nowrap">
                            <AlertTriangle className="size-3 sm:size-3.5" /> Disputed
                          </span>
                        ) : (
                          <span className={`text-xs ${textMutedClass}`}>—</span>
                        )}
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap hidden lg:table-cell">
                        <div className={`flex items-center gap-1.5 text-[10px] sm:text-xs ${textSecondaryClass}`}>
                          <Calendar className={`size-3 sm:size-3.5 ${textMutedClass}`} />
                          {formatDate(order.createdAt || order.orderDate)}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-3 sm:px-6 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleView(order)}
                            className={`p-1 sm:p-1.5 rounded-lg border transition-all ${cardBgClass} ${borderClass} ${textSecondaryClass} hover:${textClass}`}
                            title="View Order Details"
                          >
                            <Eye className="size-3.5 sm:size-4" />
                          </button>
                          {order.isDisputed && (
                            <button
                              onClick={() => handleResolveDispute(order._id)}
                              className="p-1 sm:p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                              title="Resolve Dispute"
                            >
                              <CheckCircle2 className="size-3.5 sm:size-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border transition-colors ${modalBgClass} ${modalBorderClass}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg sm:text-xl font-bold ${textClass}`}>Order Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className={`p-1.5 rounded-lg border transition-colors ${cardBgClass} ${borderClass} ${textSecondaryClass} hover:${textClass}`}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${textMutedClass}`}>Order ID</p>
                  <p className="text-xs sm:text-sm font-mono text-cyan-400 break-all">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${textMutedClass}`}>Date</p>
                  <p className={`text-xs sm:text-sm ${textSecondaryClass}`}>{formatDate(selectedOrder.createdAt || selectedOrder.orderDate)}</p>
                </div>
                <div>
                  <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${textMutedClass}`}>Payment</p>
                  <span className={`inline-block text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-md border capitalize mt-1 ${
                    paymentStatusStyles[selectedOrder.paymentStatus] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}>
                    {selectedOrder.paymentStatus || "pending"}
                  </span>
                </div>
                <div>
                  <p className={`text-[10px] sm:text-xs uppercase tracking-wider ${textMutedClass}`}>Status</p>
                  <span className={`inline-block text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-md border mt-1 ${
                    orderStatusStyles[selectedOrder.orderStatus] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>

              <div className={`rounded-xl p-3 sm:p-4 ${isDark ? "bg-zinc-800/30" : "bg-gray-100/50"}`}>
                <h3 className={`text-xs sm:text-sm font-semibold ${textSecondaryClass} mb-2`}>Buyer Information</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Name</p>
                    <p className={textClass}>{selectedOrder.buyerInfo?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Email</p>
                    <p className={`${textClass} break-all text-xs`}>{selectedOrder.buyerInfo?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-3 sm:p-4 ${isDark ? "bg-zinc-800/30" : "bg-gray-100/50"}`}>
                <h3 className={`text-xs sm:text-sm font-semibold ${textSecondaryClass} mb-2`}>Seller Information</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Name</p>
                    <p className={textClass}>{selectedOrder.sellerInfo?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Email</p>
                    <p className={`${textClass} break-all text-xs`}>{selectedOrder.sellerInfo?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-3 sm:p-4 ${isDark ? "bg-zinc-800/30" : "bg-gray-100/50"}`}>
                <h3 className={`text-xs sm:text-sm font-semibold ${textSecondaryClass} mb-2`}>Product Information</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="col-span-2">
                    <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Product</p>
                    <p className={`font-medium ${textClass}`}>{selectedOrder.productTitle || "N/A"}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Amount</p>
                    <p className={`font-bold ${textClass}`}>৳{(selectedOrder.price || selectedOrder.amount || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-3 sm:p-4 ${isDark ? "bg-zinc-800/30" : "bg-gray-100/50"}`}>
                <h3 className={`text-xs sm:text-sm font-semibold ${textSecondaryClass} mb-2`}>Dispute Status</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedOrder.isDisputed ? (
                    <>
                      <AlertTriangle className="size-4 sm:size-5 text-red-400" />
                      <span className="text-red-400 font-medium text-xs sm:text-sm">This order is disputed</span>
                      <button
                        onClick={() => { handleResolveDispute(selectedOrder._id); setShowDetailsModal(false); }}
                        className="ml-auto text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        Resolve Dispute
                      </button>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4 sm:size-5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium text-xs sm:text-sm">No dispute on this order</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-xl border transition-all text-xs sm:text-sm ${cardBgClass} ${borderClass} ${textSecondaryClass} hover:${textClass}`}
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