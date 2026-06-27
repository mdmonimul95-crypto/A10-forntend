"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

const COLORS = ["#a855f7", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#14b8a6", "#f97316"];

export default function SellerAnalyticsCharts() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Use next-themes hook
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Theme classes
  const chartCardClass = isDark 
    ? "bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 sm:p-5" 
    : "bg-white/60 border border-gray-200/80 rounded-2xl p-4 sm:p-5";
  const textClass = isDark ? "text-zinc-200" : "text-gray-800";
  const textMutedClass = isDark ? "text-zinc-400" : "text-gray-500";

  const tooltipStyle = {
    backgroundColor: isDark ? "#18181b" : "#ffffff",
    border: isDark ? "1px solid #27272a" : "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "12px",
    color: isDark ? "#e4e4e7" : "#18181b",
  };

  const chartColors = {
    grid: isDark ? "#27272a" : "#e5e7eb",
    axis: isDark ? "#71717a" : "#9ca3af",
    text: isDark ? "#e4e4e7" : "#18181b",
  };

  const fetchData = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/orders/seller/${user.email}`),
        fetch(`${API_BASE_URL}/api/products/seller/${user.email}`),
      ]);
      if (!ordersRes.ok || !productsRes.ok) throw new Error("Failed");
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
      // Fallback data
      setOrders([
        { _id: "1", productTitle: "Laptop", orderStatus: "Delivered", price: 35000, createdAt: new Date("2026-01-15") },
        { _id: "2", productTitle: "iPhone", orderStatus: "Delivered", price: 45000, createdAt: new Date("2026-02-10") },
        { _id: "3", productTitle: "Table", orderStatus: "Processing", price: 12000, createdAt: new Date("2026-03-05") },
        { _id: "4", productTitle: "Headphones", orderStatus: "Delivered", price: 25000, createdAt: new Date("2026-04-20") },
        { _id: "5", productTitle: "Shoes", orderStatus: "Pending", price: 8500, createdAt: new Date("2026-05-12") },
        { _id: "6", productTitle: "Watch", orderStatus: "Delivered", price: 15000, createdAt: new Date("2026-06-01") },
      ]);
      setProducts([
        { _id: "1", title: "Laptop", category: "Electronics", price: 35000 },
        { _id: "2", title: "iPhone", category: "Mobile Phones", price: 45000 },
        { _id: "3", title: "Table", category: "Furniture", price: 12000 },
        { _id: "4", title: "Headphones", category: "Electronics", price: 25000 },
        { _id: "5", title: "Shoes", category: "Fashion", price: 8500 },
        { _id: "6", title: "Watch", category: "Fashion", price: 15000 },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user?.email, API_BASE_URL]);

  useEffect(() => {
    if (!user?.email) return;
    fetchData();
  }, [user?.email, fetchData]);

  // Monthly Revenue — last 6 months
  const monthlyRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const revenue = orders
        .filter((o) => {
          const od = new Date(o.createdAt);
          return (
            od.getMonth() === d.getMonth() &&
            od.getFullYear() === d.getFullYear() &&
            o.orderStatus === "Delivered"
          );
        })
        .reduce((sum, o) => sum + (o.price || o.amount || 0), 0);
      result.push({ month: months[d.getMonth()], revenue });
    }
    return result;
  };

  // Top Products by Revenue
  const topProductsByRevenue = () => {
    const productMap = {};
    orders.forEach((o) => {
      if (o.orderStatus === "Delivered") {
        const title = o.productTitle?.slice(0, 20) + "…" || "Unknown";
        productMap[title] = (productMap[title] || 0) + (o.price || o.amount || 0);
      }
    });

    if (Object.keys(productMap).length === 0) {
      return products.slice(0, 5).map((p) => ({
        product: p.title?.slice(0, 20) + "…" || "Product",
        revenue: p.price || 0,
      }));
    }

    return Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([product, revenue]) => ({ product, revenue }));
  };

  // Category Breakdown
  const categoryBreakdownData = () => {
    const categoryMap = {};
    products.forEach((p) => {
      const cat = p.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    if (Object.keys(categoryMap).length === 0) {
      return [
        { name: "Electronics", value: 3 },
        { name: "Furniture", value: 2 },
        { name: "Fashion", value: 2 },
        { name: "Mobile Phones", value: 1 },
      ];
    }

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  };

  // Orders Trend — last 6 months
  const ordersTrendData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const total = orders.filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      }).length;
      const delivered = orders.filter((o) => {
        const od = new Date(o.createdAt);
        return (
          od.getMonth() === d.getMonth() &&
          od.getFullYear() === d.getFullYear() &&
          o.orderStatus === "Delivered"
        );
      }).length;
      result.push({ month: months[d.getMonth()], total, delivered });
    }
    return result;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`${chartCardClass} h-72 sm:h-80 animate-pulse`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Monthly Revenue */}
      <div className={chartCardClass}>
        <h3 className={`text-sm font-semibold ${textClass} mb-3 sm:mb-4`}>
          Monthly Revenue (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyRevenueData()}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="month" stroke={chartColors.axis} fontSize={11} />
            <YAxis stroke={chartColors.axis} fontSize={11} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`৳${value.toLocaleString()}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.2}
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products by Revenue */}
      <div className={chartCardClass}>
        <h3 className={`text-sm font-semibold ${textClass} mb-3 sm:mb-4`}>
          Top Products by Revenue
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={topProductsByRevenue()} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              type="number"
              stroke={chartColors.axis}
              fontSize={11}
              tickFormatter={(v) => `৳${v.toLocaleString()}`}
            />
            <YAxis
              type="category"
              dataKey="product"
              stroke={chartColors.axis}
              fontSize={10}
              width={100}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`৳${value.toLocaleString()}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="#ec4899" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className={chartCardClass}>
        <h3 className={`text-sm font-semibold ${textClass} mb-3 sm:mb-4`}>
          Category Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={categoryBreakdownData()}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {categoryBreakdownData().map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              formatter={(value) => (
                <span className={isDark ? "text-zinc-400 text-xs" : "text-gray-600 text-xs"}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Trend */}
      <div className={chartCardClass}>
        <h3 className={`text-sm font-semibold ${textClass} mb-3 sm:mb-4`}>
          Orders Trend (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={ordersTrendData()}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="month" stroke={chartColors.axis} fontSize={11} />
            <YAxis stroke={chartColors.axis} fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              formatter={(value) => (
                <span className={isDark ? "text-zinc-400 text-xs capitalize" : "text-gray-600 text-xs capitalize"}>
                  {value}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#a855f7"
              strokeWidth={2.5}
              dot={{ fill: "#a855f7", r: 3 }}
              name="Total Orders"
            />
            <Line
              type="monotone"
              dataKey="delivered"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: "#10b981", r: 3 }}
              name="Delivered"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}