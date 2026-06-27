"use client";

import React from "react";
import {
  ShoppingBag,
  Package,
  DollarSign,
  LayoutGrid,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const statusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-emerald-950/30 border-emerald-900/60 text-emerald-400";
    case "Cancelled": return "bg-red-950/30 border-red-900/60 text-red-400";
    case "Pending": return "bg-amber-950/30 border-amber-900/60 text-amber-400";
    case "Accepted": return "bg-blue-950/30 border-blue-900/60 text-blue-400";
    case "Processing": return "bg-purple-950/30 border-purple-900/60 text-purple-400";
    case "Shipped": return "bg-cyan-950/30 border-cyan-900/60 text-cyan-400";
    default: return "bg-zinc-900/60 border-zinc-700 text-zinc-400";
  }
};

export default function SellerHomePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Use next-themes hook
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/products/seller/${user.email}`),
          fetch(`${API_BASE_URL}/api/orders/seller/${user.email}`),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch seller data:", error);
        // Fallback data
        setProducts([
          { _id: "1", title: "Used Dell Laptop", status: "available", price: 35000 },
          { _id: "2", title: "iPhone 12", status: "pending", price: 45000 },
          { _id: "3", title: "Study Table", status: "available", price: 12000 },
          { _id: "4", title: "Sony Headphones", status: "rejected", price: 25000 },
          { _id: "5", title: "Nike Shoes", status: "available", price: 8500 },
        ]);
        setOrders([
          { _id: "1", productTitle: "Used Dell Laptop", orderStatus: "Delivered", buyerInfo: { name: "Rakib Hasan" }, price: 35000 },
          { _id: "2", productTitle: "iPhone 12", orderStatus: "Processing", buyerInfo: { name: "Tanvir Ahmed" }, price: 45000 },
          { _id: "3", productTitle: "Study Table", orderStatus: "Shipped", buyerInfo: { name: "Anika Roy" }, price: 12000 },
          { _id: "4", productTitle: "Sony Headphones", orderStatus: "Pending", buyerInfo: { name: "Sumi Khan" }, price: 25000 },
          { _id: "5", productTitle: "Nike Shoes", orderStatus: "Delivered", buyerInfo: { name: "Dev Jhon" }, price: 8500 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, API_BASE_URL]);

  // Stats calculation
  const totalRevenue = orders
    .filter((o) => o.orderStatus === "Delivered")
    .reduce((sum, o) => sum + (o.price || o.amount || 0), 0);

  const activeListings = products.filter((p) => p.status === "available").length;
  const approvedProducts = products.filter((p) => p.status === "available").length;
  const pendingProducts = products.filter((p) => p.status === "pending").length;
  const rejectedProducts = products.filter((p) => p.status === "rejected").length;
  const recentOrders = orders.slice(0, 5);
  const totalOrders = orders.length;

  // Theme classes
  const bgClass = isDark ? "bg-zinc-950" : "bg-gray-50";
  const textClass = isDark ? "text-zinc-100" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-zinc-400" : "text-gray-600";
  const textMutedClass = isDark ? "text-zinc-500" : "text-gray-500";
  const borderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const cardBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const cardBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const statBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const statBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const hoverBgClass = isDark ? "hover:bg-zinc-800/10" : "hover:bg-gray-100/50";
  const dividerClass = isDark ? "divide-zinc-800/60" : "divide-gray-200/60";

  const stats = [
    {
      id: 1,
      title: "My Products",
      value: products.length,
      icon: Package,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      id: 2,
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      id: 3,
      title: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      id: 4,
      title: "Active Listings",
      value: activeListings,
      icon: LayoutGrid,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  if (isPending || loading) {
    return (
      <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 flex items-center justify-center transition-colors duration-300`}>
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 sm:size-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className={`text-sm ${textMutedClass}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 transition-colors duration-300`}>

      {/* Header */}
      <div className="mb-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${textClass}`}>
              Seller Dashboard
            </h1>
            <p className={`text-xs sm:text-sm ${textSecondaryClass} mt-1`}>
              Welcome back, {user?.name?.split(" ")[0] || "Seller"}!
            </p>
          </div>

          <Link
            href="/dashboard/seller/add-product"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-[0.98] shadow-md shadow-purple-900/20 w-fit self-start sm:self-center cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`p-3 sm:p-5 rounded-xl ${statBgClass} ${statBorderClass} border flex flex-col gap-2 sm:gap-3 transition-colors duration-300`}
          >
            <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bg} w-fit`}>
              <stat.icon className={`size-4 sm:size-5 ${stat.color}`} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`text-lg sm:text-2xl font-extrabold ${textClass}`}>{stat.value}</span>
              <span className={`text-[10px] sm:text-xs font-medium ${textMutedClass}`}>{stat.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className={`max-w-6xl mx-auto ${cardBgClass} ${cardBorderClass} rounded-2xl overflow-hidden shadow-xl mb-6 transition-colors duration-300`}>
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? "border-zinc-800/60" : "border-gray-200/60"}`}>
          <h2 className={`text-sm sm:text-base font-bold ${textClass}`}>Recent Orders</h2>
          <Link
            href="/dashboard/seller/manage-orders"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className={`flex items-center justify-center py-10 text-sm ${textMutedClass}`}>
            No orders yet.
          </div>
        ) : (
          <div className={`flex flex-col divide-y ${dividerClass}`}>
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 ${hoverBgClass} transition-colors gap-2 sm:gap-0`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className={`text-sm font-semibold ${textClass}`}>
                    {order.productTitle || "Product"}
                  </span>
                  <span className={`text-xs ${textMutedClass}`}>
                    Buyer: {order.buyerInfo?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`text-sm font-bold text-emerald-400`}>
                    ৳{(order.price || order.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Status & Quick Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Products Status */}
        <div className={`${cardBgClass} ${cardBorderClass} rounded-2xl overflow-hidden shadow-xl transition-colors duration-300`}>
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? "border-zinc-800/60" : "border-gray-200/60"}`}>
            <h2 className={`text-sm sm:text-base font-bold ${textClass}`}>Products Status</h2>
          </div>

          <div className="grid grid-cols-3 divide-x divide-zinc-800/60">
            <div className="flex flex-col items-center gap-1 py-4 sm:py-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle className="size-4 sm:size-5 text-emerald-400" />
                <span className={`text-2xl sm:text-3xl font-extrabold text-emerald-400`}>
                  {approvedProducts}
                </span>
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${textMutedClass}`}>Approved</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-4 sm:py-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="size-4 sm:size-5 text-amber-400" />
                <span className={`text-2xl sm:text-3xl font-extrabold text-amber-400`}>
                  {pendingProducts}
                </span>
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${textMutedClass}`}>Pending</span>
            </div>
            <div className="flex flex-col items-center gap-1 py-4 sm:py-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <XCircle className="size-4 sm:size-5 text-red-400" />
                <span className={`text-2xl sm:text-3xl font-extrabold text-red-400`}>
                  {rejectedProducts}
                </span>
              </div>
              <span className={`text-[10px] sm:text-xs font-medium ${textMutedClass}`}>Rejected</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`${cardBgClass} ${cardBorderClass} rounded-2xl overflow-hidden shadow-xl transition-colors duration-300`}>
          <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${isDark ? "border-zinc-800/60" : "border-gray-200/60"}`}>
            <h2 className={`text-sm sm:text-base font-bold ${textClass}`}>Quick Stats</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6">
            <div className={`p-3 sm:p-4 rounded-xl ${statBgClass} ${statBorderClass} border transition-colors duration-300`}>
              <div className="flex items-center gap-2">
                <Users className="size-4 sm:size-5 text-blue-400" />
                <div>
                  <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Total Buyers</p>
                  <p className={`text-base sm:text-lg font-bold ${textClass}`}>
                    {orders.reduce((acc, o) => {
                      const buyers = new Set(orders.map(o => o.buyerInfo?.email));
                      return buyers.size;
                    }, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className={`p-3 sm:p-4 rounded-xl ${statBgClass} ${statBorderClass} border transition-colors duration-300`}>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 sm:size-5 text-emerald-400" />
                <div>
                  <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Avg. Order</p>
                  <p className={`text-base sm:text-lg font-bold text-emerald-400`}>
                    ৳{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className={`p-3 sm:p-4 rounded-xl ${statBgClass} ${statBorderClass} border transition-colors duration-300 col-span-2`}>
              <div className="flex items-center gap-2">
                <Star className="size-4 sm:size-5 text-amber-400" />
                <div>
                  <p className={`text-[10px] sm:text-xs ${textMutedClass}`}>Seller Rating</p>
                  <p className={`text-base sm:text-lg font-bold ${textClass}`}>
                    ⭐ 4.8 / 5.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}