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

const chartCardClass = "bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5";
const tooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  fontSize: "12px",
};

const COLORS = ["#a855f7", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#14b8a6", "#f97316"];

export default function SellerAnalyticsCharts() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller/${user.email}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/seller/${user.email}`),
      ]);
      if (!ordersRes.ok || !productsRes.ok) throw new Error("Failed");
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

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
        .reduce((sum, o) => sum + (o.price || 0), 0);
      result.push({ month: months[d.getMonth()], revenue });
    }
    return result;
  };

  // Top Products by Revenue
  const topProductsByRevenue = () => {
    const productMap = {};
    orders.forEach((o) => {
      if (o.orderStatus === "Delivered") {
        const title = o.productTitle?.slice(0, 22) + "…" || "Unknown";
        productMap[title] = (productMap[title] || 0) + (o.price || 0);
      }
    });

    if (Object.keys(productMap).length === 0) {
      return products.slice(0, 5).map((p) => ({
        product: p.title?.slice(0, 22) + "…" || "Product",
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`${chartCardClass} h-80 animate-pulse`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Monthly Revenue */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Monthly Revenue (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyRevenueData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
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
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Top Products by Revenue
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topProductsByRevenue()} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              type="number"
              stroke="#71717a"
              fontSize={12}
              tickFormatter={(v) => `৳${v.toLocaleString()}`}
            />
            <YAxis
              type="category"
              dataKey="product"
              stroke="#71717a"
              fontSize={11}
              width={130}
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
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Category Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categoryBreakdownData()}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
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
                <span className="text-zinc-400 text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Trend */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Orders Trend (Last 6 Months)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={ordersTrendData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              formatter={(value) => (
                <span className="text-zinc-400 text-xs capitalize">{value}</span>
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