"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, Heart, CheckCircle2, Clock, Package, TrendingUp, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";
import Link from "next/link";
import { useTheme } from "next-themes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BuyerOverviewPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  const themeStyles = {
    bg: isDark ? "bg-zinc-950" : "bg-gray-50",
    text: isDark ? "text-zinc-100" : "text-gray-900",
    textSecondary: isDark ? "text-zinc-400" : "text-gray-500",
    textMuted: isDark ? "text-zinc-500" : "text-gray-400",
    border: isDark ? "border-zinc-800" : "border-gray-200",
    cardBg: isDark ? "bg-zinc-900/50" : "bg-white",
    cardBorder: isDark ? "border-zinc-800" : "border-gray-200",
    hoverBg: isDark ? "hover:bg-zinc-800/50" : "hover:bg-gray-50",
    tableHeader: isDark ? "bg-zinc-900/50" : "bg-gray-50",
  };

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await fetch(`${API_URL}/api/orders/buyer/${user.email}`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch buyer orders:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        setLoadingWishlist(true);
        const res = await fetch(`${API_URL}/api/wishlist/${user.email}`);
        const data = await res.json();
        setWishlistCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setWishlistCount(0);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchOrders();
    fetchWishlist();
  }, [user?.email]);

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.orderStatus === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const processingOrders = orders.filter((o) => ["Accepted", "Processing", "Shipped"].includes(o.orderStatus)).length;

  const stats = [
    {
      id: 1,
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      id: 2,
      title: "Wishlist",
      value: wishlistCount,
      icon: Heart,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      id: 3,
      title: "Completed",
      value: completedOrders,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      id: 4,
      title: "In Progress",
      value: processingOrders,
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  const recentPurchases = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .map((order) => ({
      id: order._id,
      title: order.productTitle || order.title || "Product",
      category: order.category || "N/A",
      price: order.price || order.amount || 0,
      status: order.orderStatus || "Pending",
      date: order.createdAt
        ? new Date(order.createdAt).toISOString().split("T")[0]
        : "N/A",
    }));

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Accepted": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Processing": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Shipped": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Cancelled": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  if (isPending) {
    return (
      <div className={`w-full min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 sm:size-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className={`text-sm ${themeStyles.textSecondary}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
              Here is a summary of your activity on ReSell Hub.
            </p>
          </div>

          <div className={`flex items-center gap-3 ${themeStyles.cardBg} ${themeStyles.cardBorder} border px-4 py-2.5 rounded-xl self-start sm:self-center`}>
            <Avatar className="h-9 w-9 border border-zinc-700">
              <Avatar.Image alt="Profile" src={user?.image} />
              <Avatar.Fallback className="bg-purple-500/10 text-purple-400 font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "B"}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className={`text-sm font-semibold ${themeStyles.text} truncate`}>
                {user?.name}
              </span>
              <span className="text-xs text-rose-400 font-medium capitalize">
                {user?.role || "buyer"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isLoading = stat.title === "Wishlist" ? loadingWishlist : loadingOrders;
            return (
              <div
                key={stat.id}
                className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4 sm:p-5 transition-all hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${themeStyles.textSecondary}`}>
                      {stat.title}
                    </p>
                    <p className={`text-xl font-bold ${themeStyles.text}`}>
                      {isLoading ? "—" : stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Purchases */}
        <div className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-2xl overflow-hidden shadow-sm`}>
          <div className={`flex items-center justify-between px-4 sm:px-6 py-4 border-b ${themeStyles.border}`}>
            <h2 className="text-base font-bold">Recent Purchases</h2>
            <Link
              href="/dashboard/buyer/my-orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              View All
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-[600px]">
              <thead>
                <tr className={`border-b ${themeStyles.border} ${themeStyles.tableHeader}`}>
                  <th className={`py-3 px-4 sm:px-6 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                    Product
                  </th>
                  <th className={`py-3 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted} hidden sm:table-cell`}>
                    Category
                  </th>
                  <th className={`py-3 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                    Price
                  </th>
                  <th className={`py-3 px-4 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted} hidden md:table-cell`}>
                    Date
                  </th>
                  <th className={`py-3 px-4 sm:px-6 text-xs font-medium uppercase tracking-wider ${themeStyles.textMuted}`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-zinc-800/50" : "divide-gray-200/50"}`}>
                {loadingOrders ? (
                  <tr>
                    <td colSpan={5} className={`py-8 px-6 text-center text-sm ${themeStyles.textMuted}`}>
                      Loading recent purchases...
                    </td>
                  </tr>
                ) : recentPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={`py-8 px-6 text-center text-sm ${themeStyles.textMuted}`}>
                      No purchases yet. Start shopping!
                    </td>
                  </tr>
                ) : (
                  recentPurchases.map((item) => (
                    <tr key={item.id} className={`${themeStyles.hoverBg} transition-colors`}>
                      <td className="py-4 px-4 sm:px-6">
                        <div>
                          <p className={`font-medium text-sm ${themeStyles.text}`}>{item.title}</p>
                          <p className={`text-xs ${themeStyles.textMuted} sm:hidden`}>{item.category}</p>
                        </div>
                      </td>
                      <td className={`py-4 px-4 text-sm ${themeStyles.textMuted} hidden sm:table-cell`}>
                        {item.category}
                      </td>
                      <td className="py-4 px-4 font-semibold text-sm text-emerald-400">
                        ৳{Number(item.price).toLocaleString()}
                      </td>
                      <td className={`py-4 px-4 text-sm ${themeStyles.textMuted} hidden md:table-cell`}>
                        {item.date}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <Link
            href="/products"
            className={`${themeStyles.cardBg} ${themeStyles.cardBorder} border rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5`}
          >
            <ShoppingCart className="size-6 text-purple-400 mx-auto mb-2" />
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