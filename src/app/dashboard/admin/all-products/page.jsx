"use client";

import React from "react";
import { Eye, Check, X, Trash2, Flag } from "lucide-react";
import { toast } from "sonner";

const initialProducts = [
  {
    id: "product001",
    title: "Used Dell Inspiron 15 Laptop",
    category: "Electronics",
    condition: "Good",
    sellerName: "Nusrat Jahan",
    sellerEmail: "nusrat.jahan@gmail.com",
    price: 35000,
    status: "APPROVED",
    reportCount: 0,
  },
  {
    id: "product002",
    title: "Wooden Study Table with Chair",
    category: "Furniture",
    condition: "Like New",
    sellerName: "Sumi Khan",
    sellerEmail: "sumi.khan@gmail.com",
    price: 4500,
    status: "APPROVED",
    reportCount: 2,
  },
  {
    id: "product003",
    title: "iPhone 12, 128GB, Blue (Bulk Lot - Contact for Wholesale)",
    category: "Mobile Phones",
    condition: "Good",
    sellerName: "Robert Torres",
    sellerEmail: "robert_torres@protonmail.com",
    price: 38000,
    status: "PENDING",
    reportCount: 5,
  },
];

export default function AllProductsAdminPage() {

  const handleAction = (actionType, productId) => {
    toast.success(`Action: ${actionType} on Product ID: ${productId}`);
  };

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
              {initialProducts.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-zinc-800/10">
                  
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
                      <span className="font-medium text-zinc-300">{product.sellerName}</span>
                      <span className="text-xs text-zinc-500">{product.sellerEmail}</span>
                    </div>
                  </td>

                  {/* Condition Badge */}
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-purple-950/50 text-purple-400 border border-purple-900/40 tracking-wider">
                      {product.condition.toUpperCase()}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 text-center font-medium text-zinc-300 whitespace-nowrap">
                    ৳{product.price.toLocaleString()}
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
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold border tracking-wider ${
                      product.status === "APPROVED"
                        ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/40"
                        : product.status === "REJECTED"
                        ? "bg-red-950/30 text-red-400 border-red-900/40"
                        : "bg-amber-950/20 text-amber-500 border-amber-900/30"
                    }`}>
                      {product.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleAction("view", product.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all"
                        title="View Product"
                      >
                        <Eye className="size-4" />
                      </button>

                      {/* Approve PENDING*/}
                      {product.status === "PENDING" && (
                        <button
                          onClick={() => handleAction("approve", product.id)}
                          className="p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                          title="Approve Product"
                        >
                          <Check className="size-4" />
                        </button>
                      )}

                      {/* Reject */}
                      {product.status !== "REJECTED" && (
                        <button
                          onClick={() => handleAction("reject", product.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          title="Reject Product"
                        >
                          <X className="size-4" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleAction("delete", product.id)}
                        className="p-1.5 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Delete Product"
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
      </div>
    </div>
  );
}