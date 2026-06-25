"use client";

import React, { useState } from "react";
import { Upload, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SellerAddProductPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electronics",
    condition: "Used",
    price: "",
    stock: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      return toast.error("Please fill in all required fields.");
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sellerInfo: {
          userId: user?._id,
          name: user?.name,
          email: user?.email,
          phone: user?.phone || "",
        },
        status: "available",
      };

      // TODO: POST to your API
      // await fetch("/api/products", { method: "POST", body: JSON.stringify(productData) })

      console.log("Product Data:", productData);
      console.log("Thumbnail:", thumbnail);

      toast.success("Product listed successfully!");
      router.push("/dashboard/seller/my-products");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen flex justify-center items-start">
      <div className="w-full max-w-2xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-xs">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Add New Product</h1>
          <p className="text-sm text-zinc-400 mt-1">Fill in the details to list your product on ReSell Hub.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">

          {/* Product Title */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Used Dell Inspiron 15 Laptop"
              required
              className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the product condition, specifications, usage history, etc."
              required
              className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 cursor-pointer transition-all"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Fashion">Fashion</option>
                <option value="Mobile Phones">Mobile Phones</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 cursor-pointer transition-all"
              >
                <option value="Used">Used</option>
                <option value="Like New">Like New</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
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
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
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
                className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Product Image <span className="text-red-500">*</span>
            </label>
            <label className="w-full border-2 border-dashed border-zinc-800 hover:border-purple-500/50 rounded-xl p-6 bg-zinc-950/20 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="size-6 text-zinc-500 group-hover:text-purple-400 transition-colors" />
              <span className="text-zinc-200 font-bold tracking-wide">
                {thumbnail ? thumbnail.name : "Click to upload product image"}
              </span>
              <span className="text-xs text-zinc-500">
                Supports PNG, JPG, or WEBP (Max 2MB)
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-purple-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-900/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <PlusCircle className="size-4" />
            <span>{isSubmitting ? "Listing Product..." : "List Product"}</span>
          </button>

        </form>
      </div>
    </div>
  );
}