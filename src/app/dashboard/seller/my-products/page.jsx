"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, AlertCircle, Eye, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SellerMyProductsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchProducts = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/seller/${user?.email}`
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
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    fetchProducts();
  }, [user?.email, fetchProducts]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
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
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              My Products
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Manage your listed products, edit details, and track orders.
            </p>
          </div>
          <Link
            href="/dashboard/seller/add-product"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-medium text-sm rounded-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0 self-start sm:self-center"
          >
            <Plus className="size-4" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category..."
              className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Condition Filter */}
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer transition-all"
          >
            <option value="all">All Conditions</option>
            <option value="Used">Used</option>
            <option value="Like New">Like New</option>
            <option value="Refurbished">Refurbished</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-900/50 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 cursor-pointer transition-all"
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
          <div className="w-full bg-zinc-900/20 border border-zinc-900 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 mb-4 shadow-inner">
              <AlertCircle className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 tracking-wide">
              {products.length === 0 ? "No Products Found" : "No Results Found"}
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm mt-1.5 mb-6">
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
          <div className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/10 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-5">Product</th>
                  <th className="py-4 px-4">Condition</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Stock</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {filtered.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-zinc-900/10 transition-colors"
                  >
                    {/* Title & Category */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm text-zinc-100 tracking-wide">
                          {product.title}
                        </span>
                        <span className="text-xs text-zinc-500">
                          Category: {product.category}
                        </span>
                      </div>
                    </td>

                    {/* Condition Badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        product.condition === "Like New"
                          ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-400"
                          : product.condition === "Refurbished"
                          ? "bg-blue-950/30 border-blue-800/40 text-blue-400"
                          : "bg-amber-950/30 border-amber-800/40 text-amber-400"
                      }`}>
                        {product.condition}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-sm text-zinc-200">
                      ৳{product.price?.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        product.status === "available"
                          ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-400"
                          : product.status === "pending"
                          ? "bg-amber-950/30 border-amber-900/60 text-amber-400"
                          : product.status === "sold"
                          ? "bg-zinc-900/60 border-zinc-700/60 text-zinc-400"
                          : "bg-red-950/30 border-red-900/60 text-red-400"
                      }`}>
                        {product.status === "available" ? "✓ Available"
                          : product.status === "pending" ? "⏳ Pending"
                          : product.status === "sold" ? "✗ Sold"
                          : "✗ Rejected"}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="py-4 px-4 text-center font-bold text-sm text-zinc-200">
                      {product.stock || 0}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <Link
                          href={`/dashboard/seller/edit-product/${product._id}`}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                        >
                          <Edit className="size-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Result Count */}
        {products.length > 0 && (
          <p className="text-xs text-zinc-500">
            Showing {filtered.length} of {products.length} products
          </p>
        )}

      </div>
    </div>
  );
}