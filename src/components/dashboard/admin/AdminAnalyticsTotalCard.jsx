"use client";

import React from "react";
import { Users, Package, ShoppingCart } from "lucide-react";

const cards = [
  {
    label: "Total Users",
    value: 1284,
    icon: Users,
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    label: "Total Products",
    value: 3420,
    icon: Package,
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    label: "Total Orders",
    value: 956,
    icon: ShoppingCart,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

export default function AdminAnalyticsTotalCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl border ${card.iconBg}`}>
              <Icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-xl font-bold text-zinc-100">
                {card.value.toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}