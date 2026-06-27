"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Package, ArrowUpRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const statusStyles = {
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Accepted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Shipped: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function BuyerHomePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoadingData(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const [ordersRes, wishlistRes] = await Promise.all([
          fetch(`${baseUrl}/api/orders/buyer/${user.email}`),
          fetch(`${baseUrl}/api/wishlist/${user.email}`),
        ]);

        const [ordersData, wishlistData] = await Promise.all([
          ordersRes.json(),
          wishlistRes.json(),
        ]);

        setOrders(ordersData);
        setWishlistCount(wishlistData.length);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [user?.email]);

  if (isPending || isLoadingData) {
    return (
      <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-purple-400" />
      </div>
    );
  }

  // Recent Purchases = only orders that were actually paid for
  // (per doc wording: "Latest purchased products" — not pending/cancelled orders)
  const recentPurchases = [...orders]
    .filter((order) => order.paymentStatus === "paid")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const overviewCards = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      iconBg: "bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      label: "Wishlist Count",
      value: wishlistCount,
      icon: Heart,
      iconBg: "bg-pink-500/10 border-pink-500/20",
      iconColor: "text-pink-400",
    },
  ];

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Welcome back, {user?.name?.split(" ")[0] || "Buyer"}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Here's a summary of your activity on ReSell Hub.
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

        {recentPurchases.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">
            You haven't completed any purchases yet.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-800/60">
            {recentPurchases.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 shrink-0">
                    <Package className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {order.productTitle || `Order #${order._id?.slice(-6)}`}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {order.price && (
                    <span className="text-sm font-bold text-zinc-100">
                      ৳{Number(order.price).toLocaleString()}
                    </span>
                  )}
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                      statusStyles[order.orderStatus] || statusStyles.Pending
                    }`}
                  >
                    {order.orderStatus || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}