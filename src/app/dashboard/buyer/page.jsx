"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Package, ArrowUpRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

// Mock data — will be replaced with real API calls once backend is ready
const overviewCards = [
  {
    label: "Total Orders",
    value: 12,
    icon: ShoppingBag,
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    label: "Wishlist Count",
    value: 3,
    icon: Heart,
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
  },
];

const recentPurchases = [
  {
    id: "order001",
    title: "Used Dell Inspiron 15 Laptop",
    price: 35000,
    status: "Delivered",
    date: "19/06/2026",
  },
  {
    id: "order002",
    title: "Wooden Study Table with Chair",
    price: 4500,
    status: "Processing",
    date: "15/06/2026",
  },
  {
    id: "order003",
    title: "iPhone 12, 128GB, Blue",
    price: 38000,
    status: "Shipped",
    date: "10/06/2026",
  },
];

const statusStyles = {
  Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Processing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function BuyerHomePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen">
        <p className="text-zinc-500 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Welcome back, {user?.name?.split(" ")[0] || "Buyer"}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Here is a summary of your activity on ReSell Hub.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl border ${card.iconBg}`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-xl font-bold text-zinc-100">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Purchases */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Recent Purchases
          </h3>
          <Link
            href="/dashboard/buyer/my-orders"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-zinc-800/60">
          {recentPurchases.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 shrink-0">
                  <Package className="h-4 w-4 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {order.title}
                  </p>
                  <p className="text-xs text-zinc-500">{order.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-zinc-100">
                  ৳{order.price.toLocaleString()}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}