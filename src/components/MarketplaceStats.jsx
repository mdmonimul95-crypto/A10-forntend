"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Store, Users, CheckCircle2, Loader2 } from "lucide-react";

const statConfig = [
  {
    key: "totalProducts",
    label: "Total Products",
    icon: Package,
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    key: "totalSellers",
    label: "Total Sellers",
    icon: Store,
    iconBg: "bg-pink-500/10 border-pink-500/20",
    iconColor: "text-pink-400",
  },
  {
    key: "totalBuyers",
    label: "Total Buyers",
    icon: Users,
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    key: "completedOrders",
    label: "Completed Orders",
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

export default function MarketplaceStats() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 gap-3">
          <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            By the Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Marketplace Statistics
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
            A growing community of buyers and sellers trading pre-owned products every day.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="size-6 animate-spin text-purple-400" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
          >
            {statConfig.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.key}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-purple-500/30 transition-all duration-300 shadow-sm dark:shadow-none"
                >
                  <div className={`p-3 rounded-xl border ${stat.iconBg}`}>
                    <Icon className={`size-6 ${stat.iconColor}`} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {(stats?.[stat.key] ?? 0).toLocaleString()}+
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>
    </section>
  );
}