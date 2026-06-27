"use client";

import React, { useState } from "react";
import { Upload, PlusCircle, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { useTheme } from "next-themes";

export default function SellerAddProductPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Use next-themes hook
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electronics",
    condition: "Used",
    price: "",
    stock: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload PNG, JPG, or WEBP image");
        return;
      }

      setThumbnail(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      return toast.error("Please fill in all required fields.");
    }
    if (!thumbnail) {
      return toast.error("Please upload a product image.");
    }
    if (!user) {
      return toast.error("You must be logged in to add a product.");
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image to ImgBB first, get hosted URL
      const imageUrl = await uploadImageToImgBB(thumbnail);

      // 2. Build the full product object matching the backend's expected shape
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock) || 1,
        images: [imageUrl],
        sellerInfo: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        },
        location: user.location || "Dhaka, Bangladesh",
      };

      // 3. Send to backend
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Server responded with an error");
      }

      toast.success("Product listed successfully! Waiting for admin approval.");
      router.push("/dashboard/seller/my-products");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 flex justify-center items-start transition-colors duration-300`}>
      <div className={`w-full max-w-2xl ${cardBgClass} ${cardBorderClass} rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-xs transition-colors duration-300`}>

        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${textClass}`}>Add New Product</h1>
          <p className={`text-xs sm:text-sm ${textSecondaryClass} mt-1`}>Fill in the details to list your product on ReSell Hub.</p>
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

          {/* Thumbnail Upload */}
          <div className="flex flex-col gap-2">
            <label className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${labelClass}`}>
              Product Image <span className="text-red-500">*</span>
            </label>
            
            {thumbnailPreview ? (
              <div className={`relative w-full ${inputBgClass} ${inputBorderClass} rounded-xl p-3 sm:p-4 flex items-center gap-4 transition-colors`}>
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                  <img 
                    src={thumbnailPreview} 
                    alt="Product preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${textClass} truncate`}>{thumbnail.name}</p>
                  <p className={`text-xs ${textMutedClass}`}>
                    {(thumbnail.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className={`p-1.5 rounded-lg ${isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
                >
                  <X className="size-4 text-red-400" />
                </button>
              </div>
            ) : (
              <label className={`w-full border-2 border-dashed ${inputBorderClass} hover:border-purple-500/50 rounded-xl p-6 sm:p-8 ${inputBgClass} text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group`}>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="p-3 rounded-full bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                  <Upload className="size-6" />
                </div>
                <span className={`text-sm font-bold ${textClass} group-hover:text-purple-400 transition-colors`}>
                  Click to upload product image
                </span>
                <span className={`text-xs ${textMutedClass}`}>
                  PNG, JPG, or WEBP (Max 2MB)
                </span>
              </label>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 px-4 rounded-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-900/10 disabled:opacity-60 disabled:cursor-not-allowed text-sm`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Listing Product...</span>
              </>
            ) : (
              <>
                <PlusCircle className="size-4" />
                <span>List Product</span>
              </>
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className={`w-full ${cardBgClass} ${borderClass} ${textSecondaryClass} hover:${textClass} font-medium py-2.5 px-4 rounded-xl transition-all text-sm`}
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  );
}