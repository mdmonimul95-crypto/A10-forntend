"use client";

import React, { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";

const categoryConfig = {
  Electronics:    { icon: Monitor,     color: "text-blue-400",    bg: "bg-blue-500/10",    border: "hover:border-blue-500/30" },
  Furniture:      { icon: Sofa,        color: "text-orange-400",  bg: "bg-orange-500/10",  border: "hover:border-orange-500/30" },
  Vehicles:       { icon: Car,         color: "text-red-400",     bg: "bg-red-500/10",     border: "hover:border-red-500/30" },
  Fashion:        { icon: Shirt,       color: "text-pink-400",    bg: "bg-pink-500/10",    border: "hover:border-pink-500/30" },
  "Mobile Phones":{ icon: Smartphone,  color: "text-purple-400",  bg: "bg-purple-500/10",  border: "hover:border-purple-500/30" },
  Books:          { icon: BookOpen,    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/30" },
  Sports:         { icon: Dumbbell,    color: "text-teal-400",    bg: "bg-teal-500/10",    border: "hover:border-teal-500/30" },
  "Home & Garden":{ icon: Home,        color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "hover:border-yellow-500/30" },
};

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-16 px-4 bg-zinc-950">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-purple-400" />
        </div>
      </section>
    );
  }

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
          {categories.map(({ category, count }) => {
            const config = categoryConfig[category];
            if (!config) return null;
            const Icon = config.icon;

            return (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border border-zinc-800/80 ${config.border} hover:bg-zinc-900/60 transition-all duration-200 cursor-pointer group bg-zinc-900/30`}
              >
                <div className={`p-3 rounded-xl ${config.bg} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className={`size-6 ${config.color}`} />
                </div>
                <span className={`text-xs font-semibold text-zinc-400 group-hover:${config.color} transition-colors text-center`}>
                  {category}
                </span>
                <span className="text-[11px] text-zinc-600 font-medium">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}