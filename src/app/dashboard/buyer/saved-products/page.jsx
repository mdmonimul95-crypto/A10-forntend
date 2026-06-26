"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Star, ShieldCheck } from "lucide-react";
import { Button } from "@heroui/react";
import { toast } from "sonner";

const initialWishlist = [
  {
    id: "product001",
    title: "Used Dell Inspiron 15 Laptop",
    category: "Electronics",
    condition: "Good",
    price: 35000,
    location: "Dhaka, Bangladesh",
    rating: 4.9,
    seller: "Nusrat Jahan",
    verifiedSeller: true,
  },
  {
    id: "product003",
    title: "iPhone 12, 128GB, Blue",
    category: "Mobile Phones",
    condition: "Good",
    price: 38000,
    location: "Dhaka, Bangladesh",
    rating: 5.0,
    seller: "Dev Jhon",
    verifiedSeller: false,
  },
  {
    id: "product005",
    title: "Leather Jacket, Size L",
    category: "Fashion",
    condition: "Like New",
    price: 1800,
    location: "Dhaka, Bangladesh",
    rating: 4.9,
    seller: "Anika Roy",
    verifiedSeller: true,
  },
];

export default function BuyerWishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (productId, title) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    toast.success(`Removed "${title}" from wishlist.`);
  };

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            My Wishlist
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Products you have saved for later. {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved.
          </p>
        </div>

        {wishlist.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl">
            <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
              <Heart className="size-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-1">Your wishlist is empty</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm">
              Browse products and tap the heart icon to save items you are interested in.
            </p>
            <Link href="/products">
              <Button className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-6 py-2.5 rounded-xl transition-all active:scale-95">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-zinc-900/40 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                      {product.condition}
                    </span>

                    {/* Remove from wishlist (filled heart toggle) */}
                    <button
                      onClick={() => handleRemove(product.id, product.title)}
                      title="Remove from wishlist"
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/40 transition-all"
                    >
                      <Heart className="size-4 fill-pink-500" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-purple-400 transition-colors mb-2 line-clamp-1">
                    {product.title}
                  </h3>

                  <p className="text-xs text-zinc-500 mb-1">
                    Category: <span className="text-zinc-400 font-medium">{product.category}</span>
                  </p>

                  <p className="text-xs text-zinc-500 mb-6 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {product.location}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 mb-4 text-xs text-zinc-400">
                    <span className="text-lg font-bold text-zinc-100">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-zinc-200">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-zinc-500 truncate flex items-center gap-1">
                      by <span className="text-zinc-400">{product.seller}</span>
                      {product.verifiedSeller && (
                        <ShieldCheck className="h-3 w-3 text-amber-400" />
                      )}
                    </span>

                    <Link href={`/products/${product.id}`}>
                      <Button className="text-xs font-semibold bg-zinc-800 hover:bg-purple-600 hover:text-white text-zinc-200 px-4 py-2 rounded-xl border border-zinc-700/60 hover:border-purple-500/50 transition-all active:scale-95 whitespace-nowrap">
                        View Details
                      </Button>
                    </Link>
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