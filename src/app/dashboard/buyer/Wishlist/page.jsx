"use client";

import React, { useState } from "react";
import { Heart, Trash2, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";

// TODO: replace with real data from API
const initialWishlist = [
  {
    id: "product001",
    title: "Used Dell Inspiron 15 Laptop",
    category: "Electronics",
    condition: "Good",
    price: 35000,
    seller: "Nusrat Jahan",
    image: "https://i.pravatar.cc/300?img=1",
    status: "available",
  },
  {
    id: "product002",
    title: "Wooden Study Table",
    category: "Furniture",
    condition: "Like New",
    price: 8000,
    seller: "Karim Uddin",
    image: "https://i.pravatar.cc/300?img=2",
    status: "available",
  },
  {
    id: "product003",
    title: "Samsung Galaxy A52",
    category: "Mobile Phones",
    condition: "Refurbished",
    price: 22000,
    seller: "Tasnim Akter",
    image: "https://i.pravatar.cc/300?img=3",
    status: "sold",
  },
];

const conditionColor = (condition) => {
  switch (condition) {
    case "Like New": return "bg-emerald-950/30 border-emerald-800/40 text-emerald-400";
    case "Refurbished": return "bg-blue-950/30 border-blue-800/40 text-blue-400";
    default: return "bg-amber-950/30 border-amber-800/40 text-amber-400";
  }
};

export default function BuyerWishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <Heart className="size-6 text-pink-400" />
              My Wishlist
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Products you saved for later. {wishlist.length > 0 && `(${wishlist.length} items)`}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="w-full bg-zinc-900/20 border border-dashed border-zinc-900 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 mb-4">
              <AlertCircle className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200">Wishlist is Empty</h3>
            <p className="text-sm text-zinc-500 max-w-sm mt-1.5 mb-6">
              You have not saved any products yet. Browse and add products to your wishlist!
            </p>
            <Link
              href="/products"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              Browse Products
            </Link>
          </div>
        ) : (

          /* Product Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-44 object-cover"
                  />
                  {/* Sold Overlay */}
                  {item.status === "sold" && (
                    <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
                      <span className="text-sm font-bold text-red-400 border border-red-900/60 bg-red-950/40 px-4 py-1.5 rounded-full">
                        Sold Out
                      </span>
                    </div>
                  )}
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-950/70 border border-zinc-800 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-3 p-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-sm text-zinc-100 leading-snug">
                      {item.title}
                    </h3>
                    <span className="text-xs text-zinc-500">{item.category}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-zinc-100">
                      ৳{item.price.toLocaleString()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${conditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500">
                    Seller: <span className="text-zinc-300 font-medium">{item.seller}</span>
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <Link
                      href={`/products/${item.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition active:scale-95"
                    >
                      <Eye className="size-3.5" />
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                    >
                      <Heart className="size-4 fill-current" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}