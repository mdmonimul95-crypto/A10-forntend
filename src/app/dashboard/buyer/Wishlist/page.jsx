"use client";

import React, { useEffect, useState } from "react";
import { Heart, Trash2, Eye, AlertCircle, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const conditionColor = (condition) => {
  switch (condition) {
    case "Like New": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Refurbished": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "New": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
};

export default function BuyerWishlistPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const themeStyles = {
    bg: isDark ? "bg-zinc-950" : "bg-gray-50",
    text: isDark ? "text-zinc-100" : "text-gray-900",
    textSecondary: isDark ? "text-zinc-400" : "text-gray-500",
    textMuted: isDark ? "text-zinc-500" : "text-gray-400",
    border: isDark ? "border-zinc-800" : "border-gray-200",
    cardBg: isDark ? "bg-zinc-900/50" : "bg-white",
    cardBorder: isDark ? "border-zinc-800" : "border-gray-200",
    hoverBg: isDark ? "hover:bg-zinc-800/50" : "hover:bg-gray-50",
    emptyBg: isDark ? "bg-zinc-900/20 border-zinc-900" : "bg-gray-100/30 border-gray-200",
  };

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
      <div className={`w-full min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${themeStyles.textSecondary}`}>Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${themeStyles.bg} ${themeStyles.text} p-4 sm:p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Heart className="size-6 text-pink-400 fill-pink-400/20" />
              My Wishlist
            </h1>
            <p className={`text-sm ${themeStyles.textSecondary} mt-1`}>
              Products you saved for later. {wishlist.length > 0 && `(${wishlist.length} items)`}
            </p>
          </div>
          {wishlist.length > 0 && (
            <Link
              href="/products"
              className={`inline-flex items-center gap-2 px-4 py-2 ${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl text-sm font-medium ${themeStyles.textSecondary} hover:${themeStyles.text} transition-colors w-fit`}
            >
              <ShoppingBag className="size-4" />
              Browse More
            </Link>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className={`${themeStyles.emptyBg} border border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px] sm:min-h-[400px]`}>
            <div className={`p-4 rounded-full ${themeStyles.cardBg} ${themeStyles.border} border ${themeStyles.textMuted} mb-4`}>
              <Heart className="size-8" />
            </div>
            <h3 className={`text-lg font-bold ${themeStyles.text}`}>Wishlist is Empty</h3>
            <p className={`text-sm ${themeStyles.textMuted} max-w-sm mt-1.5 mb-6`}>
              You have not saved any products yet. Browse and add products to your wishlist!
            </p>
            <Link
              href="/products"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Product Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {wishlist.map((item) => {
              const product = item.product;
              if (!product) return null;

              const productId = item.productId;
              const image = product.images?.[0] || "/placeholder.png";
              const sellerName = product.sellerInfo?.name || "N/A";
              const isSold = product.status !== "available";
              const isRemoving = removingId === productId;

              return (
                <div
                  key={item._id}
                  className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col group`}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-zinc-800/30 overflow-hidden">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x300/1a1a2e/ffffff?text=No+Image";
                      }}
                    />
                    {/* Sold Overlay */}
                    {isSold && (
                      <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-sm font-bold text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-1.5 rounded-full">
                          Sold Out
                        </span>
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(productId)}
                      disabled={isRemoving}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-zinc-950/80 border border-zinc-700 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      {isRemoving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </button>
                    {/* Condition Badge */}
                    <span className={`absolute bottom-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium border ${conditionColor(product.condition)}`}>
                      {product.condition}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col gap-2 p-4 flex-1">
                    <div>
                      <h3 className={`font-semibold text-sm ${themeStyles.text} line-clamp-2`}>
                        {product.title}
                      </h3>
                      <p className={`text-xs ${themeStyles.textMuted} mt-0.5`}>
                        {product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className={`text-lg font-bold text-emerald-400`}>
                        ৳{Number(product.price).toLocaleString()}
                      </p>
                    </div>

                    <p className={`text-xs ${themeStyles.textMuted} truncate`}>
                      by <span className={`font-medium ${themeStyles.textSecondary}`}>{sellerName}</span>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/50">
                      <Link
                        href={`/products/${productId}`}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-xl transition-all duration-200 active:scale-95`}
                      >
                        <Eye className="size-3.5" />
                        View Details
                      </Link>
                      <button
                        onClick={() => handleRemove(productId)}
                        disabled={isRemoving}
                        className={`p-2 rounded-xl ${themeStyles.cardBg} ${themeStyles.border} border text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 disabled:opacity-50`}
                        title="Remove from wishlist"
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

        {/* Result Count */}
        {wishlist.length > 0 && (
          <p className={`text-xs ${themeStyles.textMuted} mt-6`}>
            Showing {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} in your wishlist
          </p>
        )}

      </div>
    </div>
  );
}