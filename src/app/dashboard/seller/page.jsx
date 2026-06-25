"use client";

import React from "react";
import { ShoppingBag, Mail, Package, CheckCircle2, ShieldCheck, Star, PlusCircle } from "lucide-react";
import { Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function SellerHomePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const roleColor =
    user?.role === "admin"
      ? "text-red-400 border-red-900/50 bg-red-950/30"
      : user?.role === "seller"
      ? "text-emerald-400 border-emerald-900/50 bg-emerald-950/30"
      : "text-zinc-400 border-zinc-800 bg-zinc-900/50";

  if (isPending) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-sm font-medium">
        Loading seller profile...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-950 text-zinc-100 min-h-screen">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Seller Account Profile</h1>
          <p className="text-sm text-zinc-400 mt-1">Track your sales, manage products, and grow your store.</p>
        </div>

        <Link
          href="/dashboard/seller/add-product"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all active:scale-[0.98] shadow-md shadow-purple-900/20 w-fit self-start sm:self-center cursor-pointer"
        >
          <PlusCircle className="size-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Profile Main Card */}
      <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xs">

        {/* Profile Top Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-zinc-800/60">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md"></div>
            <Avatar className="h-20 w-20 border-2 border-purple-500/50 relative z-10 p-1 bg-zinc-900">
              <Avatar.Image alt="Seller Profile" src={user?.image} />
              <Avatar.Fallback className="bg-purple-500/10 text-purple-400 font-bold text-xl">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </Avatar.Fallback>
            </Avatar>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-zinc-100 tracking-wide truncate">
              {user?.name || "Seller"}
            </h2>

            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <Mail className="size-4 shrink-0 text-zinc-500" />
              <span className="truncate">{user?.email || "seller@resellhub.com"}</span>
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap justify-center sm:justify-start">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider ${roleColor}`}>
                Role: {user?.role || "Seller"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider bg-zinc-900/50 text-zinc-400 border-zinc-800">
                {user?.location || "Bangladesh"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 w-fit">
              <Package className="size-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-2">Total Products</span>
            <span className="text-3xl font-extrabold text-zinc-100">{user?.productCount || 0}</span>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit">
              <ShoppingBag className="size-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-2">Total Sales</span>
            <span className="text-3xl font-extrabold text-emerald-400">
              {user?.totalSales || 0}
            </span>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 w-fit">
              <Star className="size-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-2">Seller Rating</span>
            <span className="text-3xl font-extrabold text-amber-400">
              {user?.rating || "0.0"} ★
            </span>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="w-full p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 flex items-center gap-2.5 text-sm font-medium">
          <ShieldCheck className="size-5 shrink-0 text-emerald-400" />
          <span>Verified Seller Account — Your products are visible to all buyers on ReSell Hub.</span>
        </div>

      </div>
    </div>
  );
}