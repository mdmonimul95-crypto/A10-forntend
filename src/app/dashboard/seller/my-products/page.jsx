"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, AlertCircle, Eye, Edit, Trash2, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function SellerMyProductsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Use next-themes hook
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Theme classes
  const bgClass = isDark ? "bg-zinc-950" : "bg-gray-50";
  const textClass = isDark ? "text-zinc-100" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-zinc-400" : "text-gray-600";
  const textMutedClass = isDark ? "text-zinc-500" : "text-gray-500";
  const borderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const cardBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const cardBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const inputBgClass = isDark ? "bg-zinc-900/50" : "bg-white/50";
  const inputBorderClass = isDark ? "border-zinc-800" : "border-gray-200";
  const inputTextClass = isDark ? "text-zinc-200" : "text-gray-800";
  const inputPlaceholderClass = isDark ? "placeholder-zinc-600" : "placeholder-gray-400";
  const tableBgClass = isDark ? "bg-zinc-900/30" : "bg-white/30";
  const tableBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const hoverBgClass = isDark ? "hover:bg-zinc-900/10" : "hover:bg-gray-100/20";
  const selectBgClass = isDark ? "bg-zinc-900/50" : "bg-white/50";
  const selectTextClass = isDark ? "text-zinc-300" : "text-gray-700";
  const emptyBgClass = isDark ? "bg-zinc-900/20 border-zinc-900" : "bg-gray-100/30 border-gray-200";

  const fetchProducts = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/api/products/seller/${user?.email}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email, API_BASE_URL]);

  useEffect(() => {
    if (!user?.email) return;
    fetchProducts();
  }, [user?.email, fetchProducts]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      setDeletingId(id);
      const res = await fetch(
        `${API_BASE_URL}/api/products/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter & Search
  const filtered = products.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchCondition =
      filterCondition === "all" || p.condition === filterCondition;
    const matchStatus =
      filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchCondition && matchStatus;
  });

  // Status badge styles
  const getStatusBadge = (status) => {
    const styles = {
      available: "bg-emerald-950/30 border-emerald-900/60 text-emerald-400",
      pending: "bg-amber-950/30 border-amber-900/60 text-amber-400",
      sold: "bg-zinc-900/60 border-zinc-700/60 text-zinc-400",
      rejected: "bg-red-950/30 border-red-900/60 text-red-400",
    };
    const labels = {
      available: "✓ Available",
      pending: "⏳ Pending",
      sold: "✗ Sold",
      rejected: "✗ Rejected",
    };
    return { className: styles[status] || styles.pending, label: labels[status] || status };
  };

  // Condition badge styles
  const getConditionBadge = (condition) => {
    const styles = {
      "Like New": "bg-emerald-950/30 border-emerald-800/40 text-emerald-400",
      "Refurbished": "bg-blue-950/30 border-blue-800/40 text-blue-400",
      "Used": "bg-amber-950/30 border-amber-800/40 text-amber-400",
      "New": "bg-purple-950/30 border-purple-800/40 text-purple-400",
    };
    return styles[condition] || styles.Used;
  };

  if (loading) {
    return (
      <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 flex items-center justify-center transition-colors duration-300`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${textMutedClass}`}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${textClass}`}>
              My Products
            </h1>
            <p className={`text-xs sm:text-sm ${textSecondaryClass} mt-1`}>
              Manage your listed products, edit details, and track orders.
            </p>
          </div>
          <Link
            href="/dashboard/seller/add-product"
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0 self-start sm:self-center"
          >
            <Plus className="size-4" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${textMutedClass}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category..."
              className={`w-full ${inputBgClass} ${inputBorderClass} ${inputTextClass} ${inputPlaceholderClass} rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all`}
            />
          </div>

          {/* Condition Filter */}
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className={`${selectBgClass} ${inputBorderClass} ${selectTextClass} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer transition-all w-full sm:w-auto`}
          >
            <option value="all">All Conditions</option>
            <option value="Used">Used</option>
            <option value="Like New">Like New</option>
            <option value="Refurbished">Refurbished</option>
            <option value="New">New</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`${selectBgClass} ${inputBorderClass} ${selectTextClass} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer transition-all w-full sm:w-auto`}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className={`w-full ${emptyBgClass} border border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px] sm:min-h-[400px]`}>
            <div className={`p-4 rounded-full ${cardBgClass} ${borderClass} ${textMutedClass} mb-4 shadow-inner`}>
              <AlertCircle className="size-8" />
            </div>
            <h3 className={`text-lg font-bold ${textClass} tracking-wide`}>
              {products.length === 0 ? "No Products Found" : "No Results Found"}
            </h3>
            <p className={`text-sm ${textMutedClass} max-w-sm mt-1.5 mb-6`}>
              {products.length === 0
                ? "You have not listed any products yet."
                : "Try changing your search or filter."}
            </p>
            {products.length === 0 && (
              <Link
                href="/dashboard/seller/add-product"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                List First Product
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className={`w-full ${tableBgClass} ${tableBorderClass} rounded-2xl overflow-hidden shadow-xl overflow-x-auto transition-colors duration-300`}>
              <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-[800px]">
                <thead>
                  <tr className={`border-b ${isDark ? "border-zinc-800/60" : "border-gray-200/60"} ${isDark ? "bg-zinc-900/10" : "bg-gray-50/10"} text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${textMutedClass}`}>
                    <th className="py-3 sm:py-4 px-3 sm:px-5">Product</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 hidden sm:table-cell">Condition</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4">Price</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 hidden md:table-cell">Status</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-4 text-center hidden lg:table-cell">Stock</th>
                    <th className="py-3 sm:py-4 px-3 sm:px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-zinc-900/60" : "divide-gray-200/60"}`}>
                  {filtered.map((product) => {
                    const status = getStatusBadge(product.status);
                    const conditionBadge = getConditionBadge(product.condition);
                    
                    return (
                      <tr
                        key={product._id}
                        className={`${hoverBgClass} transition-colors`}
                      >
                        {/* Title & Category */}
                        <td className="py-3 sm:py-4 px-3 sm:px-5">
                          <div className="flex flex-col gap-0.5">
                            <span className={`font-bold text-xs sm:text-sm ${textClass} tracking-wide line-clamp-1`}>
                              {product.title}
                            </span>
                            <span className={`text-[10px] sm:text-xs ${textMutedClass}`}>
                              {product.category}
                            </span>
                          </div>
                        </td>

                        {/* Condition Badge - Hidden on mobile */}
                        <td className="py-3 sm:py-4 px-3 sm:px-4 hidden sm:table-cell">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${conditionBadge}`}>
                            {product.condition}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-xs sm:text-sm ${textClass}">
                          ৳{product.price?.toLocaleString()}
                        </td>

                        {/* Status Badge - Hidden on tablet */}
                        <td className="py-3 sm:py-4 px-3 sm:px-4 hidden md:table-cell">
                          <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold border ${status.className}`}>
                            {status.label}
                          </span>
                        </td>

                        {/* Stock - Hidden on mobile */}
                        <td className="py-3 sm:py-4 px-3 sm:px-4 text-center font-bold text-xs sm:text-sm ${textClass} hidden lg:table-cell">
                          {product.stock || 0}
                        </td>

                        {/* Actions */}
                        <td className="py-3 sm:py-4 px-3 sm:px-5">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Link
                              href={`/products/${product._id}`}
                              className={`p-1.5 sm:p-2 rounded-lg ${cardBgClass} ${borderClass} ${textMutedClass} hover:${textClass} transition cursor-pointer`}
                              title="View Product"
                            >
                              <Eye className="size-3.5 sm:size-4" />
                            </Link>
                            <Link
                              href={`/dashboard/seller/edit-product/${product._id}`}
                              className={`p-1.5 sm:p-2 rounded-lg ${cardBgClass} ${borderClass} ${textMutedClass} hover:${textClass} transition cursor-pointer`}
                              title="Edit Product"
                            >
                              <Edit className="size-3.5 sm:size-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              disabled={deletingId === product._id}
                              className={`p-1.5 sm:p-2 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                              title="Delete Product"
                            >
                              {deletingId === product._id ? (
                                <Loader2 className="size-3.5 sm:size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-3.5 sm:size-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Result Count */}
            <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>
              Showing {filtered.length} of {products.length} products
            </p>
          </>
        )}
      </div>
    </div>
  );
}