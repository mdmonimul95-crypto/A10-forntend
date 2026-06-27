"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, Share2, ShoppingCart, Star, MapPin, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load reviews");
    }
  }, [id]);

  const checkWishlist = useCallback(async () => {
    if (!user?.email || !id) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/check/${user.email}/${id}`
      );
      const data = await res.json();
      setIsWishlisted(data.inWishlist);
    } catch (error) {
      console.error("Failed to check wishlist");
    }
  }, [user?.email, id]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
    fetchReviews();
  }, [id, fetchProduct, fetchReviews]);

  useEffect(() => {
    if (!user?.email || !id) return;
    checkWishlist();
  }, [user?.email, id, checkWishlist]);

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to buy this product");
      router.push("/login");
      return;
    }
    router.push(`/checkout/${id}`);
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      if (isWishlisted) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${user.email}/${id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed to remove");
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buyerEmail: user.email, productId: id }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add");
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update wishlist");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const conditionColor = (condition) => {
    switch (condition) {
      case "Like New": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Refurbished": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-zinc-950 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-96 rounded-2xl bg-zinc-200 dark:bg-zinc-800/50 animate-pulse" />
          <div className="flex flex-col gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800/50 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        Product not found.
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image || "https://i.pravatar.cc/600"];

  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Images */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900/40">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-purple-500"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="flex flex-col gap-5">

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${conditionColor(product.condition)}`}>
                {product.condition}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.round(avgRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-zinc-300 dark:text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {avgRating} ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              ৳{product.price?.toLocaleString()}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>

            {/* Seller Info */}
            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Seller Information
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {product.sellerInfo?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold">
                    {product.sellerInfo?.name}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Star className="size-3 text-amber-400 fill-amber-400" />
                      4.3 rating
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {product.sellerInfo?.location || "Bangladesh"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20"
              >
                <ShoppingCart className="size-5" />
                Buy Now
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWishlisted
                    ? "bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400"
                    : "bg-zinc-100 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500/30"
                }`}
              >
                <Heart className={`size-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl border bg-zinc-100 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
              >
                <Share2 className="size-5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <ShieldCheck className="size-4 text-emerald-500 dark:text-emerald-400" />
                Buyer Protection
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Truck className="size-4 text-emerald-500 dark:text-emerald-400" />
                Fast Delivery
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <RotateCcw className="size-4 text-emerald-500 dark:text-emerald-400" />
                Easy Returns
              </span>
            </div>

          </div>
        </div>

        {/* Reviews */}
        <div className="w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-zinc-500">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/60 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        {review.reviewerInfo?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold">
                        {review.reviewerInfo?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-zinc-300 dark:text-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}