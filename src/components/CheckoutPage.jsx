"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      toast.error("Failed to load product");
      router.push("/products");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id, fetchProduct]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Card number format
    if (name === "cardNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }

    // Expiry format
    if (name === "expiry") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      const formatted = cleaned.length > 2
        ? cleaned.slice(0, 2) + "/" + cleaned.slice(2)
        : cleaned;
      setFormData((prev) => ({ ...prev, expiry: formatted }));
      return;
    }

    // CVC
    if (name === "cvc") {
      const cleaned = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, cvc: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = product?.price || 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.address) {
      return toast.error("Please fill in all delivery information.");
    }
    if (!formData.cardNumber || !formData.expiry || !formData.cvc) {
      return toast.error("Please fill in all payment details.");
    }

    setIsSubmitting(true);

    try {
      // Create order
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            productTitle: product.title,
            price: total,
            buyerInfo: {
              userId: user?._id,
              name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
            },
            sellerInfo: product.sellerInfo,
            paymentStatus: "paid",
          }),
        }
      );

      if (!orderRes.ok) throw new Error("Failed to create order");
      const orderData = await orderRes.json();

      // Save payment
      const paymentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.insertedId,
            buyerEmail: formData.email,
            transactionId: `TRX-${Date.now()}`,
            amount: total,
            paymentStatus: "success",
            paymentMethod: "Card",
          }),
        }
      );

      if (!paymentRes.ok) throw new Error("Failed to save payment");

      toast.success("Payment successful!");
      router.push(`/payment-success?orderId=${orderData.insertedId}&amount=${total}`);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 rounded-2xl bg-zinc-800/50 animate-pulse" />
          <div className="h-96 rounded-2xl bg-zinc-800/50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-zinc-100">Checkout</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left — Forms */}
          <div className="flex flex-col gap-5">

            {/* Delivery Information */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider">
                Delivery Information
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-orange-400">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Chris Wang"
                    required
                    className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-orange-400">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 555 0201"
                    className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-orange-400">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="buyer@resellhub.com"
                  required
                  className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-orange-400">Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="New York, NY"
                  required
                  className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider">
                  Payment Details
                </h2>
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  Secured by SSL
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="4242 4242 4242 4242"
                    required
                    className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="12/26"
                    required
                    className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400">CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    placeholder="•••"
                    required
                    className="w-full bg-zinc-950/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              <p className="text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                This is a demo. No real payment will be processed.
              </p>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="flex flex-col gap-5">
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-5">
              <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
                Order Summary
              </h2>

              {/* Product */}
              {product && (
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/60">
                  <img
                    src={product.images?.[0] || product.image || "https://i.pravatar.cc/80"}
                    alt={product.title}
                    className="h-14 w-14 rounded-xl object-cover border border-zinc-800"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-zinc-100 truncate">
                      {product.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit mt-1 ${
                      product.condition === "Like New"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : product.condition === "Refurbished"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {product.condition}
                    </span>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-zinc-200 font-medium">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Tax (8%)</span>
                  <span className="text-red-400 font-medium">
                    ৳{tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Shipping</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
                  <span className="text-base font-bold text-zinc-100">Total</span>
                  <span className="text-xl font-extrabold text-purple-400">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShieldCheck className="size-5" />
                {isSubmitting ? "Processing..." : `Pay ৳${total.toLocaleString()}`}
              </button>

              {/* Cancel */}
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-2.5 text-sm text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <p className="text-[11px] text-zinc-600 text-center">
                By completing purchase you agree to our Terms of Service
              </p>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}