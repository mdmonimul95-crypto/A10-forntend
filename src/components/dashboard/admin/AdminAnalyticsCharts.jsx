"use client";

import React, { useEffect, useState } from "react";
import {
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
} from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#06b6d4"];

const chartCardClass = "bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5";
const tooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  fontSize: "12px",
};

// Groups an array of documents by month (based on createdAt) and returns chart-ready data
function groupByMonth(items, valueKey) {
  const monthMap = {};
  items.forEach((item) => {
    if (!item.createdAt) return;
    const date = new Date(item.createdAt);
    const label = date.toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthMap[label] = (monthMap[label] || 0) + 1;
  });
  return Object.entries(monthMap).map(([month, count]) => ({ month, [valueKey]: count }));
}

// Groups products by category and returns counts
function groupByCategory(products) {
  const categoryMap = {};
  products.forEach((p) => {
    const cat = p.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  return Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export default function AdminAnalyticsCharts() {
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyOrdersData, setMonthlyOrdersData] = useState([]);
  const [topCategoriesData, setTopCategoriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndAggregate = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const [usersRes, ordersRes, productsRes] = await Promise.all([
          fetch(`${baseUrl}/api/users`),
          fetch(`${baseUrl}/api/orders`),
          fetch(`${baseUrl}/api/products/admin/all`),
        ]);

        const [users, orders, products] = await Promise.all([
          usersRes.json(),
          ordersRes.json(),
          productsRes.json(),
        ]);

        setUserGrowthData(groupByMonth(users, "users"));
        setMonthlyOrdersData(groupByMonth(orders, "orders"));

        const categoryCounts = groupByCategory(products);
        setCategoryData(categoryCounts);
        setTopCategoriesData(
          categoryCounts.slice(0, 6).map((c) => ({ name: c.category, value: c.count }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAggregate();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* User Growth Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          User Growth
        </h3>
        {userGrowthData.length === 0 ? (
          <p className="text-xs text-zinc-500 py-10 text-center">No user data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Performance Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Category Performance
        </h3>
        {categoryData.length === 0 ? (
          <p className="text-xs text-zinc-500 py-10 text-center">No product data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="category" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly Orders Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Monthly Orders
        </h3>
        {monthlyOrdersData.length === 0 ? (
          <p className="text-xs text-zinc-500 py-10 text-center">No order data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyOrdersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Categories Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Top Categories
        </h3>
        {topCategoriesData.length === 0 ? (
          <p className="text-xs text-zinc-500 py-10 text-center">No product data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={topCategoriesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={11}
              >
                {topCategoriesData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}