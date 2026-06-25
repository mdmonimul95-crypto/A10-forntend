"use client";

import React, { useState } from "react";
import { Plus, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const initialProducts = [
  {
    id: 1,
    title: "Used Dell Inspiron 15 Laptop",
    category: "Electronics",
    condition: "Good",
    price: 35000,
    status: "available",
    orderCount: 2,
    rating: "4.5",
  },
  {
    id: 2,
    title: "Wooden Study Table",
    category: "Furniture",
    condition: "Like New",
    price: 8000,
    status: "sold",
    orderCount: 1,
    rating: "5.0",
  },
];

export default function SellerMyProductsPage() {
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

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

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="w-full bg-zinc-900/20 border border-zinc-900 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 mb-4 shadow-inner">
              <AlertCircle className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 tracking-wide">
              No Products Found
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm mt-1.5 mb-6">
              You have not listed any products yet. Start selling your pre-owned items!
            </p>
            <Link
              href="/dashboard/seller/add-product"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              List First Product
            </Link>
          </div>
        ) : (

          /* Table */
          <div className="w-full bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/10 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="py-4 px-5">Product</th>
                  <th className="py-4 px-4">Condition</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-center">Orders</th>
                  <th className="py-4 px-4 text-center">Rating</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {products.map((product) => (
                  <tr
                    key={product.id}
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
                      ৳{product.price.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        product.status === "available"
                          ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-400"
                          : product.status === "sold"
                          ? "bg-zinc-900/60 border-zinc-700/60 text-zinc-400"
                          : "bg-red-950/30 border-red-900/60 text-red-400"
                      }`}>
                        {product.status === "available" ? "✓ Available" : product.status === "sold" ? "✗ Sold" : "✗ Rejected"}
                      </span>
                    </td>

                    {/* Order Count */}
                    <td className="py-4 px-4 text-center font-bold text-sm text-zinc-200">
                      {product.orderCount}
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4 text-center font-medium text-sm text-zinc-300">
                      ★ {product.rating}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer">
                          <Eye className="size-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer">
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
      </div>
    </div>
  );
}