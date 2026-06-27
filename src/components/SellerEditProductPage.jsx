"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function SellerEditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Use next-themes hook
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electronics",
    condition: "Used",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Theme classes
  const bgClass = isDark ? "bg-zinc-950" : "bg-gray-50";
  const textClass = isDark ? "text-zinc-100" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-zinc-400" : "text-gray-600";
  const textMutedClass = isDark ? "text-zinc-500" : "text-gray-500";
  const borderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const cardBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const cardBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const inputBgClass = isDark ? "bg-zinc-950/60" : "bg-white/60";
  const inputBorderClass = isDark ? "border-zinc-800" : "border-gray-200";
  const inputTextClass = isDark ? "text-zinc-200" : "text-gray-800";
  const inputPlaceholderClass = isDark ? "placeholder-zinc-600" : "placeholder-gray-400";
  const labelClass = isDark ? "text-zinc-400" : "text-gray-600";
  const selectBgClass = isDark ? "bg-zinc-950/60" : "bg-white/60";
  const selectTextClass = isDark ? "text-zinc-300" : "text-gray-700";
  const buttonBgClass = isDark ? "bg-zinc-900 border-zinc-800" : "bg-gray-200 border-gray-300";

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "Electronics",
        condition: data.condition || "Used",
        price: data.price || "",
        stock: data.stock || "",
        imageUrl: data.images?.[0] || data.image || "",
      });
      setImageError(false);
    } catch (error) {
      toast.error("Failed to load product");
      router.push("/dashboard/seller/my-products");
    } finally {
      setLoading(false);
    }
  }, [id, router, API_BASE_URL]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id, fetchProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      return toast.error("Please fill in all required fields.");
    }

    setIsSubmitting(true);

    try {
      const updatedProduct = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };

      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Product updated successfully!");
      router.push("/dashboard/seller/my-products");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 flex items-center justify-center transition-colors duration-300`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${textMutedClass}`}>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 flex justify-center items-start transition-colors duration-300`}>
      <div className={`w-full max-w-2xl ${cardBgClass} ${cardBorderClass} rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-xs transition-colors duration-300`}>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-xl ${buttonBgClass} ${borderClass} ${textMutedClass} hover:${textClass} transition-colors`}
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${textClass}`}>
              Edit Product
            </h1>
            <p className={`text-xs sm:text-sm ${textSecondaryClass} mt-0.5`}>
              Update your product details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">

          {/* Product Title */}
          <div className="flex flex-col gap-2">
            <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${labelClass}`}>
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Used Dell Inspiron 15 Laptop"
              required
              maxLength={100}
              className={`w-full ${inputBgClass} ${inputBorderClass} ${inputTextClass} ${inputPlaceholderClass} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
            />
            <p className={`text-[10px] ${textMutedClass} text-right`}>
              {formData.title.length}/100
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${labelClass}`}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the product condition, specifications, usage history, etc."
              required
              maxLength={1000}
              className={`w-full ${inputBgClass} ${inputBorderClass} ${inputTextClass} ${inputPlaceholderClass} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none leading-relaxed text-sm`}
            />
            <p className={`text-[10px] ${textMutedClass} text-right`}>
              {formData.description.length}/1000
            </p>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${labelClass}`}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full ${selectBgClass} ${inputBorderClass} ${selectTextClass} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 cursor-pointer transition-all text-sm`}
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Fashion">Fashion</option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${labelClass}`}>
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={`w-full ${selectBgClass} ${inputBorderClass} ${selectTextClass} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 cursor-pointer transition-all text-sm`}
              >
                <option value="Used">Used</option>
                <option value="Like New">Like New</option>
                <option value="Refurbished">Refurbished</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${labelClass}`}>
                Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 35000"
                required
                min={0}
                step="0.01"
                className={`w-full ${inputBgClass} ${inputBorderClass} ${inputTextClass} ${inputPlaceholderClass} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${labelClass}`}>
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 1"
                required
                min={1}
                className={`w-full ${inputBgClass} ${inputBorderClass} ${inputTextClass} ${inputPlaceholderClass} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-2">
            <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${labelClass}`}>
              Image URL <span className={`text-[10px] font-normal normal-case ${textMutedClass}`}>(Optional)</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className={`w-full ${inputBgClass} ${inputBorderClass} ${inputTextClass} ${inputPlaceholderClass} rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm`}
            />
            {formData.imageUrl && !imageError && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border ${inputBorderClass} mt-1">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
            {imageError && (
              <div className={`w-full h-48 rounded-xl ${cardBgClass} ${borderClass} flex flex-col items-center justify-center gap-2 mt-1`}>
                <ImageIcon className={`size-8 ${textMutedClass}`} />
                <p className={`text-sm ${textMutedClass}`}>Image not available</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 px-4 rounded-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-900/10 disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className={`flex-1 ${cardBgClass} ${borderClass} ${textSecondaryClass} hover:${textClass} font-medium py-3.5 px-4 rounded-xl transition-all text-sm`}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}