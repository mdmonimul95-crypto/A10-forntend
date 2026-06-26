"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SellerEditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electronics",
    condition: "Used",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
      );
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
    } catch (error) {
      toast.error("Failed to load product");
      router.push("/dashboard/seller/my-products");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

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
      <div className="w-full min-h-screen bg-zinc-950 p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-zinc-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen flex justify-center items-start">
      <div className="w-full max-w-2xl bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-xs">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Edit Product
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              Update your product details.
            </p>
          </div>
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
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Home & Garden">Home & Garden</option>
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

          {/* Image URL */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Image URL <span className="text-zinc-600 font-normal normal-case">(Optional)</span>
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl border border-zinc-800 mt-1"
                onError={(e) => e.target.classList.add("hidden")}
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-purple-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-900/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="size-4" />
            <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
          </button>

        </form>
      </div>
    </div>
  );
}