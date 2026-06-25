"use client";

import React from "react";
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
  Legend,
  ResponsiveContainer,
} from "recharts";

// Fake data — per project doc, fake data is allowed for chart pages if real DB data isn't ready yet
const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 210 },
  { month: "Mar", users: 340 },
  { month: "Apr", users: 480 },
  { month: "May", users: 690 },
  { month: "Jun", users: 1284 },
];

const categoryPerformanceData = [
  { category: "Electronics", sales: 420 },
  { category: "Furniture", sales: 180 },
  { category: "Vehicles", sales: 95 },
  { category: "Fashion", sales: 260 },
  { category: "Mobile Phones", sales: 310 },
];

const monthlyOrdersData = [
  { month: "Jan", orders: 80 },
  { month: "Feb", orders: 95 },
  { month: "Mar", orders: 140 },
  { month: "Apr", orders: 165 },
  { month: "May", orders: 210 },
  { month: "Jun", orders: 266 },
];

const topCategoriesData = [
  { name: "Electronics", value: 420 },
  { name: "Mobile Phones", value: 310 },
  { name: "Fashion", value: 260 },
  { name: "Furniture", value: 180 },
  { name: "Vehicles", value: 95 },
];

const COLORS = ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const chartCardClass =
  "bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5";
const tooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function AdminAnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* User Growth Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          User Growth
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#a855f7"
              strokeWidth={2.5}
              dot={{ fill: "#a855f7", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Performance Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Category Performance
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={categoryPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="category" stroke="#71717a" fontSize={11} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="sales" fill="#ec4899" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Orders Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Monthly Orders
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: "#10b981", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Categories Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Top Categories
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={topCategoriesData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
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
      </div>
    </div>
  );
}