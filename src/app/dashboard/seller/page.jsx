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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-emerald-950/30 border-emerald-900/60 text-emerald-400";
    case "Cancelled": return "bg-red-950/30 border-red-900/60 text-red-400";
    case "Pending": return "bg-amber-950/30 border-amber-900/60 text-amber-400";
    case "Processing": return "bg-purple-950/30 border-purple-900/60 text-purple-400";
    case "Shipped": return "bg-cyan-950/30 border-cyan-900/60 text-cyan-400";
    default: return "bg-zinc-900/60 border-zinc-700 text-zinc-400";
  }
};

export default function SellerHomePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/seller/${user.email}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller/${user.email}`),
        ]);

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch seller data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  // Stats calculation
  const totalRevenue = orders
    .filter((o) => o.orderStatus === "Delivered")
    .reduce((sum, o) => sum + (o.price || 0), 0);

  const activeListings = products.filter((p) => p.status === "available").length;
  const approvedProducts = products.filter((p) => p.status === "available").length;
  const pendingProducts = products.filter((p) => p.status === "pending").length;
  const rejectedProducts = products.filter((p) => p.status === "rejected").length;
  const recentOrders = orders.slice(0, 5);

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
      value: orders.length,
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
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center text-sm font-medium">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-zinc-950 text-zinc-100 min-h-screen">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Seller Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Welcome back, {user?.name?.split(" ")[0] || "Seller"}!
          </p>
        </div>

        <Link
          href="/dashboard/seller/add-product"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98] shadow-md shadow-purple-900/20 w-fit self-start sm:self-center cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Add Product</span>
        </Link>
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
              <span className="text-2xl font-extrabold text-zinc-100">{stat.value}</span>
              <span className="text-xs font-medium text-zinc-400">{stat.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
          <h2 className="text-base font-bold text-zinc-100">Recent Orders</h2>
          <Link
            href="/dashboard/seller/manage-orders"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-zinc-500">
            No orders yet.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-800/60">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-zinc-900/20 transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-zinc-100">
                    {order.productTitle || "Product"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    Buyer: {order.buyerInfo?.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    ৳{(order.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Status */}
      <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-zinc-800/60">
          <h2 className="text-base font-bold text-zinc-100">Products Status</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/60">
          <div className="flex flex-col items-center gap-1 py-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-5 text-emerald-400" />
              <span className="text-3xl font-extrabold text-emerald-400">
                {approvedProducts}
              </span>
            </div>
            <span className="text-xs font-medium text-zinc-400">Approved</span>
          </div>
          <div className="flex flex-col items-center gap-1 py-6">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-amber-400" />
              <span className="text-3xl font-extrabold text-amber-400">
                {pendingProducts}
              </span>
            </div>
            <span className="text-xs font-medium text-zinc-400">Pending</span>
          </div>
          <div className="flex flex-col items-center gap-1 py-6">
            <div className="flex items-center gap-2">
              <XCircle className="size-5 text-red-400" />
              <span className="text-3xl font-extrabold text-red-400">
                {rejectedProducts}
              </span>
            </div>
            <span className="text-xs font-medium text-zinc-400">Rejected</span>
          </div>
        </div>
      </div>

    </div>
  );
}