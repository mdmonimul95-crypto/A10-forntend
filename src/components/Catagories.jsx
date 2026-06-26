"use client";

import React from "react";
import Link from "next/link";
import {
  Monitor,
  Sofa,
  Car,
  Shirt,
  Smartphone,
  BookOpen,
  Dumbbell,
  Home,
} from "lucide-react";

const categories = [
  {
    id: 1,
    label: "Electronics",
    icon: Monitor,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "hover:border-blue-500/30",
    href: "/products?category=Electronics",
  },
  {
    id: 2,
    label: "Furniture",
    icon: Sofa,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "hover:border-orange-500/30",
    href: "/products?category=Furniture",
  },
  {
    id: 3,
    label: "Vehicles",
    icon: Car,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "hover:border-red-500/30",
    href: "/products?category=Vehicles",
  },
  {
    id: 4,
    label: "Fashion",
    icon: Shirt,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "hover:border-pink-500/30",
    href: "/products?category=Fashion",
  },
  {
    id: 5,
    label: "Mobile Phones",
    icon: Smartphone,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "hover:border-purple-500/30",
    href: "/products?category=Mobile Phones",
  },
  {
    id: 6,
    label: "Books",
    icon: BookOpen,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/30",
    href: "/products?category=Books",
  },
  {
    id: 7,
    label: "Sports",
    icon: Dumbbell,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "hover:border-teal-500/30",
    href: "/products?category=Sports",
  },
  {
    id: 8,
    label: "Home & Garden",
    icon: Home,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "hover:border-yellow-500/30",
    href: "/products?category=Home & Garden",
  },
];

export default function PopularCategories() {
  return (
    <section className="w-full py-16 px-4 bg-zinc-950">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            Categories
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-100">
            Shop by Category
          </h2>
          <p className="text-sm text-zinc-400">
            Find exactly what you&apos;re looking for
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border border-zinc-800/80 ${cat.border} hover:bg-zinc-900/60 transition-all duration-200 cursor-pointer group bg-zinc-900/30`}
            >
              <div className={`p-3 rounded-xl ${cat.bg} transition-transform duration-200 group-hover:scale-110`}>
                <cat.icon className={`size-6 ${cat.color}`} />
              </div>
              <span className={`text-xs font-semibold text-zinc-400 group-hover:${cat.color} transition-colors text-center`}>
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}