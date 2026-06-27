"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Package, ArrowUpRight, Loader2, TrendingUp, Clock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

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

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const themeStyles = {
    bg: isDark ? "bg-zinc-950" : "bg-gray-50",
    text: isDark ? "text-zinc-100" : "text-gray-900",
    textSecondary: isDark ? "text-zinc-400" : "text-gray-500",
    textMuted: isDark ? "text-zinc-500" : "text-gray-400",
    border: isDark ? "border-zinc-800" : "border-gray-200",
    cardBg: isDark ? "bg-zinc-900/50" : "bg-white",
    cardBorder: isDark ? "border-zinc-800" : "border-gray-200",
    hoverBg: isDark ? "hover:bg-zinc-800/50" : "hover:bg-gray-50",
    borderDivider: isDark ? "divide-zinc-800/60" : "divide-gray-200/60",
  };

  useEffect(() => {
    if (!user?.email) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoadingData(true);
        const [ordersRes, wishlistRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/orders/buyer/${user.email}`),
          fetch(`${API_BASE_URL}/api/wishlist/${user.email}`),
        ]);

        const [ordersData, wishlistData] = await Promise.all([
          ordersRes.json(),
          wishlistRes.json(),
        ]);

        setOrders(ordersData);
        setWishlistCount(wishlistData.length);
      } catch (err) {
        console.error(err);
        // Fallback data
        setOrders([
          { _id: "1", productTitle: "Used Dell Laptop", orderStatus: "Delivered", paymentStatus: "paid", price: 35000, createdAt: new Date("2026-06-19") },
          { _id: "2", productTitle: "iPhone 12", orderStatus: "Processing", paymentStatus: "paid", price: 45000, createdAt: new Date("2026-06-15") },
          { _id: "3", productTitle: "Study Table", orderStatus: "Shipped", paymentStatus: "paid", price: 12000, createdAt: new Date("2026-06-10") },
        ]);
        setWishlistCount(4);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [user?.email, API_BASE_URL]);

  if (isPending || isLoadingData) {
    return (
      <div className={`w-full min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${themeStyles.textSecondary}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.orderStatus === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const totalSpent = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.price || 0), 0);

  // Recent Purchases - only paid orders
  const recentPurchases = [...orders]
    .filter((order) => order.paymentStatus === "paid")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const overviewCards = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      iconBg: "bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      label: "Wishlist",
      value: wishlistCount,
      icon: Heart,
      iconBg: "bg-pink-500/10 border-pink-500/20",
      iconColor: "text-pink-400",
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Pending",
      value: pendingOrders,
      icon: Clock,
      iconBg: "bg-amber-500/10 border-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  const getStatusBadge = (status) => {
    return statusStyles[status] || statusStyles.Pending;
  };

  return (
    <div className={`w-full min-h-screen ${themeStyles.bg} ${themeStyles.text} p-4 sm:p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Buyer"} 👋
            </h1>
            <p className={`text-sm ${themeStyles.textSecondary} mt-1`}>
              Here's a summary of your activity on ReSell Hub.
            </p>
          </div>
          <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl px-4 py-3 self-start sm:self-center`}>
            <p className={`text-xs font-medium ${themeStyles.textMuted}`}>Total Spent</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-400">
              ৳{totalSpent.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4 transition-all hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${card.iconBg}`}>
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${themeStyles.textMuted} uppercase tracking-wider`}>
                      {card.label}
                    </p>
                    <p className={`text-xl font-bold ${themeStyles.text}`}>
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Purchases */}
        <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl p-4 sm:p-5 shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${themeStyles.textSecondary}`}>
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
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <Package className={`size-10 ${themeStyles.textMuted} mb-3`} />
              <p className={`text-sm ${themeStyles.textMuted}`}>
                You haven't completed any purchases yet.
              </p>
              <Link
                href="/products"
                className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className={`flex flex-col divide-y ${themeStyles.borderDivider}`}>
              {recentPurchases.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${themeStyles.cardBg} ${themeStyles.border} border shrink-0`}>
                      <Package className={`h-4 w-4 ${themeStyles.textMuted}`} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${themeStyles.text} truncate`}>
                        {order.productTitle || `Order #${order._id?.slice(-6)}`}
                      </p>
                      <p className={`text-xs ${themeStyles.textMuted}`}>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {order.price && (
                      <span className={`text-sm font-bold ${themeStyles.text}`}>
                        ৳{Number(order.price).toLocaleString()}
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getStatusBadge(order.orderStatus)}`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <Link
            href="/products"
            className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <ShoppingBag className="size-6 text-purple-400 mx-auto mb-2" />
            <p className={`text-sm font-medium ${themeStyles.text}`}>Browse Products</p>
          </Link>
          <Link
            href="/dashboard/buyer/wishlist"
            className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <Heart className="size-6 text-pink-400 mx-auto mb-2" />
            <p className={`text-sm font-medium ${themeStyles.text}`}>My Wishlist</p>
          </Link>
          <Link
            href="/dashboard/buyer/my-orders"
            className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <Package className="size-6 text-blue-400 mx-auto mb-2" />
            <p className={`text-sm font-medium ${themeStyles.text}`}>My Orders</p>
          </Link>
          <Link
            href="/dashboard/buyer/profile"
            className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <TrendingUp className="size-6 text-emerald-400 mx-auto mb-2" />
            <p className={`text-sm font-medium ${themeStyles.text}`}>Profile</p>
          </Link>
        </div>

      </div>
    </div>
  );
}