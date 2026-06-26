"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Package, TrendingUp, Wallet, Clock } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SellerAnalyticsTotalCard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);

      const productsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/seller/${user.email}`
      );
      const ordersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller/${user.email}`
      );

      if (!productsRes.ok || !ordersRes.ok) throw new Error("Failed");

      const products = await productsRes.json();
      const orders = await ordersRes.json();

      const productList = Array.isArray(products) ? products : [];
      const orderList = Array.isArray(orders) ? orders : [];

      setTotalProducts(productList.length);
      setTotalSales(orderList.filter((o) => o.orderStatus === "Delivered").length);
      setTotalRevenue(
        orderList
          .filter((o) => o.orderStatus === "Delivered")
          .reduce((sum, o) => sum + (o.price || 0), 0)
      );
      setPendingOrders(orderList.filter((o) => o.orderStatus === "Pending").length);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    fetchStats();
  }, [user?.email, fetchStats]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Products */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl border bg-purple-500/10 border-purple-500/20">
          <Package className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Products</p>
          {loading ? (
            <div className="h-6 w-12 rounded-lg bg-zinc-800/50 animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-zinc-100">{totalProducts}</p>
          )}
        </div>
      </div>

      {/* Total Sales */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl border bg-pink-500/10 border-pink-500/20">
          <TrendingUp className="h-5 w-5 text-pink-400" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Sales</p>
          {loading ? (
            <div className="h-6 w-12 rounded-lg bg-zinc-800/50 animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-zinc-100">{totalSales}</p>
          )}
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20">
          <Wallet className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Revenue</p>
          {loading ? (
            <div className="h-6 w-16 rounded-lg bg-zinc-800/50 animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-zinc-100">
              ৳{totalRevenue.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Pending Orders */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/20">
          <Clock className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Pending Orders</p>
          {loading ? (
            <div className="h-6 w-12 rounded-lg bg-zinc-800/50 animate-pulse mt-1" />
          ) : (
            <p className="text-xl font-bold text-zinc-100">{pendingOrders}</p>
          )}
        </div>
      </div>

    </div>
  );
}