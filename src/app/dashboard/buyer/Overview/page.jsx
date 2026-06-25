"use client";

import React from "react";
import { ShoppingCart, Heart, CheckCircle2, Clock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";
import Link from "next/link";

export default function BuyerOverviewPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // TODO: replace with real data from API
  const stats = [
    {
      id: 1,
      title: "Total Orders",
      value: 12,
      icon: ShoppingCart,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      id: 2,
      title: "Wishlist",
      value: 5,
      icon: Heart,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      id: 3,
      title: "Completed",
      value: 9,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      id: 4,
      title: "Pending",
      value: 3,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  // TODO: replace with real recent purchases from API
  const recentPurchases = [
    {
      id: 1,
      title: "Used Dell Inspiron 15 Laptop",
      category: "Electronics",
      price: 35000,
      status: "Delivered",
      date: "2025-06-10",
    },
    {
      id: 2,
      title: "Wooden Study Table",
      category: "Furniture",
      price: 8000,
      status: "Processing",
      date: "2025-06-18",
    },
    {
      id: 3,
      title: "Samsung Galaxy A52",
      category: "Mobile Phones",
      price: 22000,
      status: "Pending",
      date: "2025-06-20",
    },
  ];

  if (isPending) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-sm font-medium">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-zinc-950 text-zinc-100 min-h-screen">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Welcome back, {user?.name?.split(" ")[0] || "Buyer"} 👋
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Here is a summary of your activity on ReSell Hub.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900/40 px-4 py-2.5 rounded-xl border border-zinc-800/60 self-start sm:self-center">
          <Avatar className="h-9 w-9 border border-zinc-700">
            <Avatar.Image alt="Profile" src={user?.image} />
            <Avatar.Fallback className="bg-purple-500/10 text-purple-400 font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "B"}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-zinc-200 truncate">{user?.name}</span>
            <span className="text-xs text-rose-400 font-medium capitalize">{user?.role || "buyer"}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-3"
          >
            <div className={`p-2 rounded-lg ${stat.bg} w-fit`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {stat.title}
              </span>
              <span className="text-3xl font-extrabold text-zinc-100">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Purchases */}
      <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">

        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <h2 className="text-base font-bold text-zinc-100">Recent Purchases</h2>
          <Link
            href="/dashboard/buyer/my-orders"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900/10">
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60">
              {recentPurchases.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-zinc-100">{item.title}</span>
                      <span className="text-xs text-zinc-500">{item.category}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-zinc-200">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-zinc-400">
                    {item.date}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === "Delivered"
                        ? "bg-emerald-950/30 border-emerald-900/60 text-emerald-400"
                        : item.status === "Processing"
                        ? "bg-blue-950/30 border-blue-900/60 text-blue-400"
                        : "bg-amber-950/30 border-amber-900/60 text-amber-400"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}