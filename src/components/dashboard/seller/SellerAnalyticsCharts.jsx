"use client";

import React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Fake data — per project doc, fake data is allowed for chart pages if real DB data isn't ready yet
const salesData = [
  { week: "Week 1", sales: 12 },
  { week: "Week 2", sales: 19 },
  { week: "Week 3", sales: 14 },
  { week: "Week 4", sales: 26 },
];

const monthlySalesTrendData = [
  { month: "Jan", revenue: 32000 },
  { month: "Feb", revenue: 41000 },
  { month: "Mar", revenue: 38000 },
  { month: "Apr", revenue: 52000 },
  { month: "May", revenue: 61000 },
  { month: "Jun", revenue: 78000 },
];

const topSellingProductsData = [
  { product: "Dell Inspiron 15", unitsSold: 14 },
  { product: "iPhone 12", unitsSold: 11 },
  { product: "Study Table", unitsSold: 9 },
  { product: "Leather Jacket", unitsSold: 7 },
  { product: "Gaming Keyboard", unitsSold: 6 },
];

const chartCardClass =
  "bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5";
const tooltipStyle = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function SellerAnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Sales Chart */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Sales Chart (This Month)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="week" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.2}
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Sales Trend */}
      <div className={chartCardClass}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Monthly Sales Trend
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlySalesTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: "#10b981", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products */}
      <div className={`${chartCardClass} lg:col-span-2`}>
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">
          Top Selling Products
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topSellingProductsData} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis type="number" stroke="#71717a" fontSize={12} />
            <YAxis
              type="category"
              dataKey="product"
              stroke="#71717a"
              fontSize={12}
              width={120}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="unitsSold" fill="#ec4899" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}