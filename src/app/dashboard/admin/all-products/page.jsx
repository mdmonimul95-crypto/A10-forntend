"use client";

import React, { useEffect, useState } from "react";
import { Eye, Check, X, Trash2, Flag, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusStyles = {
  available: "bg-emerald-950/30 text-emerald-400 border-emerald-900/40",
  rejected: "bg-red-950/30 text-red-400 border-red-900/40",
  pending: "bg-amber-950/20 text-amber-500 border-amber-900/30",
};

export default function AllProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/admin/all`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");

      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, status: newStatus } : p))
      );
      toast.success(`Product ${newStatus === "available" ? "approved" : "rejected"}.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product status.");
    }
  };

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Product deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  };

  const handleView = (productId) => {
    toast.info(`Viewing product ${productId} (details page coming soon).`);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
      {/* Header Title Section */}
      <div className="mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Product Listings Moderation
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Approve listings, reject suspicious products, and monitor reported items.
        </p>
      </div>

      {/*  Container */}
      <div className="max-w-7xl mx-auto overflow-hidden bg-zinc-900/40 border border-zinc-800/80 rounded-2xl backdrop-blur-xs shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Head */}
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/20">
                <th className="py-4 px-6">Product Title</th>
                <th className="py-4 px-6">Seller</th>
                <th className="py-4 px-6 text-center">Condition</th>
                <th className="py-4 px-6 text-center">Price</th>
                <th className="py-4 px-6 text-center">Reports</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-zinc-800/60 text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-6 text-center text-zinc-500 text-sm">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="transition-colors hover:bg-zinc-800/10">
                    
                    {/* Product Title & Category */}
                    <td className="py-4 px-6 max-w-[220px]">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-zinc-100 tracking-wide break-words line-clamp-2">
                          {product.title}
                        </span>
                        <span className="text-xs text-zinc-500 mt-0.5">
                          Category: {product.category}
                        </span>
                      </div>
                    </td>

                    {/* Seller Info */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-300">{product.sellerInfo?.name}</span>
                        <span className="text-xs text-zinc-500">{product.sellerInfo?.email}</span>
                      </div>
                    </td>

                    {/* Condition Badge */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-purple-950/50 text-purple-400 border border-purple-900/40 tracking-wider">
                        {product.condition?.toUpperCase()}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 text-center font-medium text-zinc-300 whitespace-nowrap">
                      ৳{Number(product.price).toLocaleString()}
                    </td>

                    {/* Reported Count */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      {product.reportCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-950/30 border border-red-900/50 text-red-400">
                          <Flag className="size-3.5" />
                          {product.reportCount}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold border tracking-wider capitalize ${statusStyles[product.status] || statusStyles.pending}`}>
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleView(product._id)}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all"
                          title="View Product"
                        >
                          <Eye className="size-4" />
                        </button>

                        {/* Approve PENDING*/}
                        {product.status === "pending" && (
                          <button
                            onClick={() => handleStatusChange(product._id, "available")}
                            className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                            title="Approve Product"
                          >
                            <Check className="size-4" />
                          </button>
                        )}

                        {/* Reject */}
                        {product.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusChange(product._id, "rejected")}
                            className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            title="Reject Product"
                          >
                            <X className="size-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="size-4" />
                        </button>
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