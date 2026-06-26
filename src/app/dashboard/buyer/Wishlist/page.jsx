"use client";

import React, { useEffect, useState } from "react";
import { Heart, Trash2, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. http://localhost:5000

const conditionColor = (condition) => {
  switch (condition) {
    case "Like New": return "bg-emerald-950/30 border-emerald-800/40 text-emerald-400";
    case "Refurbished": return "bg-blue-950/30 border-blue-800/40 text-blue-400";
    default: return "bg-amber-950/30 border-amber-800/40 text-amber-400";
  }
};

export default function BuyerWishlistPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    if (!user?.email) return;
    try {
      setLoadingWishlist(true);
      const res = await fetch(`${API_URL}/api/wishlist/${user.email}`);
      const data = await res.json();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlist([]);
    } finally {
      setLoadingWishlist(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const handleRemove = async (productId) => {
    if (!user?.email) return;
    try {
      setRemovingId(productId);
      await fetch(`${API_URL}/api/wishlist/${user.email}/${productId}`, {
        method: "DELETE",
      });
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending || loadingWishlist) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-sm font-medium">
        Loading your wishlist...
      </div>
    );
  }

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
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null; // product deleted from DB but wishlist entry remains

              const productId = item.productId;
              const image = product.images?.[0] || "/placeholder.png";
              const sellerName = product.sellerInfo?.name || "N/A";
              const isSold = product.status !== "available";
              const isRemoving = removingId === productId;

              return (
                <div
                  key={item._id}
                  className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-44 object-cover"
                    />
                    {/* Sold Overlay */}
                    {isSold && (
                      <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
                        <span className="text-sm font-bold text-red-400 border border-red-900/60 bg-red-950/40 px-4 py-1.5 rounded-full">
                          Sold Out
                        </span>
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(productId)}
                      disabled={isRemoving}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-950/70 border border-zinc-800 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col gap-3 p-4 flex-1">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-sm text-zinc-100 leading-snug">
                        {product.title}
                      </h3>
                      <span className="text-xs text-zinc-500">{product.category}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-extrabold text-zinc-100">
                        ৳{Number(product.price).toLocaleString()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${conditionColor(product.condition)}`}>
                        {product.condition}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500">
                      Seller: <span className="text-zinc-300 font-medium">{sellerName}</span>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <Link
                        href={`/products/${productId}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition active:scale-95"
                      >
                        <Eye className="size-3.5" />
                        View Details
                      </Link>
                      <button
                        onClick={() => handleRemove(productId)}
                        disabled={isRemoving}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer disabled:opacity-50"
                      >
                        <Heart className="size-4 fill-current" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
