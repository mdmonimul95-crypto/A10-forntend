"use client";

import React, { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, Store, CheckCircle2, Loader2 } from "lucide-react";

const cardConfig = [
  { key: "totalUsers", label: "Total Users", icon: Users, iconBg: "bg-purple-100 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/20", iconColor: "text-purple-600 dark:text-purple-400" },
  { key: "totalProducts", label: "Total Products", icon: Package, iconBg: "bg-pink-100 dark:bg-pink-500/10 border-pink-300 dark:border-pink-500/20", iconColor: "text-pink-600 dark:text-pink-400" },
  { key: "totalOrders", label: "Total Orders", icon: ShoppingCart, iconBg: "bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
  // Extra (bonus, beyond the required 3)
  { key: "totalSellers", label: "Total Sellers", icon: Store, iconBg: "bg-amber-100 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/20", iconColor: "text-amber-600 dark:text-amber-400" },
  { key: "completedOrders", label: "Completed Orders", icon: CheckCircle2, iconBg: "bg-cyan-100 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-500/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
];

export default function AdminAnalyticsTotalCard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="size-5 animate-spin text-purple-500 dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cardConfig.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4 transition-colors"
          >
            <div className={`p-3 rounded-xl border ${card.iconBg}`}>
              <Icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {(stats?.[card.key] ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}