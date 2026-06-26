"use client";

import { useEffect, useState } from "react";
import { Mail, Users, Package, ShoppingCart, Store, UserCheck, CheckCircle } from "lucide-react";
import { Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function AdminHomePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSellers: 0,
    totalBuyers: 0,
    completedOrders: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`);
        const data = await res.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalSellers: data.totalSellers || 0,
          totalBuyers: data.totalBuyers || 0,
          completedOrders: data.completedOrders || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const overviewCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      iconBg: "bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      iconBg: "bg-pink-500/10 border-pink-500/20",
      iconColor: "text-pink-400",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Total Sellers",
      value: stats.totalSellers,
      icon: Store,
      iconBg: "bg-amber-500/10 border-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      label: "Total Buyers",
      value: stats.totalBuyers,
      icon: UserCheck,
      iconBg: "bg-sky-500/10 border-sky-500/20",
      iconColor: "text-sky-400",
    },
    {
      label: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      iconBg: "bg-teal-500/10 border-teal-500/20",
      iconColor: "text-teal-400",
    },
  ];

  const roleColor =
    user?.role?.toLowerCase() === "admin"
      ? "text-red-400 border-red-900/50 bg-red-950/30"
      : user?.role?.toLowerCase() === "seller"
      ? "text-purple-400 border-purple-900/50 bg-purple-950/30"
      : "text-zinc-400 border-zinc-800 bg-zinc-900/50";

  if (isPending) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 bg-zinc-950 text-zinc-100 min-h-screen">
        <p className="text-zinc-500 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-zinc-950 text-zinc-100 min-h-screen">

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Admin Dashboard
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Overview of platform activity and account details.
        </p>
      </div>

      {/* Profile Card */}
      <div className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xs mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md"></div>
            <Avatar className="h-20 w-20 border-2 border-purple-500/50 relative z-10 p-1 bg-zinc-900">
              <Avatar.Image alt="Profile Photo" src={user?.image} />
              <Avatar.Fallback className="bg-purple-500/10 text-purple-400 font-bold text-xl">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </Avatar.Fallback>
            </Avatar>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-zinc-100 tracking-wide truncate">
              {user?.name || "Admin"}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <Mail className="size-4 shrink-0 text-zinc-500" />
              <span className="truncate">{user?.email || "admin@resellhub.com"}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap justify-center sm:justify-start">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider ${roleColor}`}>
                Role: {user?.role || "Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2 shadow-lg"
            >
              <div className={`p-2 rounded-lg w-fit border ${card.iconBg} ${card.iconColor}`}>
                <Icon className="size-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mt-2">
                {card.label}
              </span>
              <span className="text-3xl font-extrabold text-zinc-100">
                {statsLoading ? (
                  <span className="inline-block w-16 h-8 bg-zinc-800 animate-pulse rounded-md" />
                ) : (
                  card.value.toLocaleString()
                )}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}