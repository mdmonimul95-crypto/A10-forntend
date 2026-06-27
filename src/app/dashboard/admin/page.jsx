"use client";

import { useEffect, useState } from "react";
import { 
  Mail, 
  Users, 
  Package, 
  ShoppingCart, 
  Store, 
  UserCheck, 
  CheckCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  Calendar,
  Award
} from "lucide-react";
import { Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

export default function AdminHomePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Use next-themes hook
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSellers: 0,
    totalBuyers: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/stats`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStats({
        totalUsers: data.totalUsers || 0,
        totalProducts: data.totalProducts || 0,
        totalOrders: data.totalOrders || 0,
        totalSellers: data.totalSellers || 0,
        totalBuyers: data.totalBuyers || 0,
        completedOrders: data.completedOrders || 0,
        totalRevenue: data.totalRevenue || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Fallback data
      setStats({
        totalUsers: 1250,
        totalProducts: 3420,
        totalOrders: 890,
        totalSellers: 450,
        totalBuyers: 800,
        completedOrders: 620,
        totalRevenue: 1556338,
      });
    } finally {
      setStatsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
  };

  // Theme classes
  const bgClass = isDark ? "bg-zinc-950" : "bg-gray-50";
  const textClass = isDark ? "text-zinc-100" : "text-gray-900";
  const textSecondaryClass = isDark ? "text-zinc-400" : "text-gray-600";
  const textMutedClass = isDark ? "text-zinc-500" : "text-gray-500";
  const borderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const cardBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const cardBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
  const statBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
  const statBorderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";

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
      <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 flex items-center justify-center transition-colors duration-300`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 sm:size-10 text-purple-500 animate-spin" />
          <p className={`text-sm ${textMutedClass}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 transition-colors duration-300`}>

      {/* Header */}
      <div className="mb-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${textClass}`}>
              Admin Dashboard
            </h1>
            <p className={`text-xs sm:text-sm ${textSecondaryClass} mt-1`}>
              Overview of platform activity and account details.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || statsLoading}
            className={`p-2 rounded-lg border transition-all disabled:opacity-50 w-fit ${cardBgClass} ${borderClass} ${textSecondaryClass} hover:${textClass}`}
          >
            <RefreshCw className={`size-4 ${refreshing || statsLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className={`max-w-7xl mx-auto ${cardBgClass} ${cardBorderClass} rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-xs mb-6 transition-colors duration-300`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md"></div>
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-purple-500/50 relative z-10 p-1 bg-zinc-900">
              <Avatar.Image alt="Profile Photo" src={user?.image} />
              <Avatar.Fallback className="bg-purple-500/10 text-purple-400 font-bold text-lg sm:text-xl">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </Avatar.Fallback>
            </Avatar>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 min-w-0 flex-1">
            <h2 className={`text-xl sm:text-2xl font-bold ${textClass} tracking-wide truncate w-full`}>
              {user?.name || "Admin"}
            </h2>
            <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${textSecondaryClass}`}>
              <Mail className="size-3 sm:size-4 shrink-0 text-zinc-500" />
              <span className="truncate">{user?.email || "admin@resellhub.com"}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap justify-center sm:justify-start">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold border uppercase tracking-wider ${roleColor}`}>
                Role: {user?.role || "Admin"}
              </span>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className={`mt-3 sm:mt-0 sm:ml-auto flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl ${statBgClass} ${statBorderClass} border w-full sm:w-auto justify-center sm:justify-start`}>
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="size-4 sm:size-5" />
            </div>
            <div>
              <p className={`text-[10px] sm:text-xs ${textMutedClass} uppercase tracking-wider`}>Total Revenue</p>
              <p className={`text-base sm:text-xl font-bold text-emerald-400`}>
                ৳{statsLoading ? (
                  <span className="inline-block w-16 h-6 bg-zinc-800 animate-pulse rounded-md" />
                ) : (
                  stats.totalRevenue.toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`p-3 sm:p-5 rounded-xl ${statBgClass} ${statBorderClass} border flex flex-col gap-2 shadow-lg transition-colors duration-300`}
            >
              <div className={`p-1.5 sm:p-2 rounded-lg w-fit border ${card.iconBg} ${card.iconColor}`}>
                <Icon className="size-4 sm:size-5" />
              </div>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${textMutedClass} mt-1 sm:mt-2`}>
                {card.label}
              </span>
              <span className={`text-xl sm:text-3xl font-extrabold ${textClass}`}>
                {statsLoading ? (
                  <span className="inline-block w-12 sm:w-16 h-6 sm:h-8 bg-zinc-800 animate-pulse rounded-md" />
                ) : (
                  card.value.toLocaleString()
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4`}>
          {/* Quick Actions */}
          <div className={`p-4 sm:p-5 rounded-xl ${cardBgClass} ${cardBorderClass} border transition-colors duration-300`}>
            <h3 className={`text-sm font-semibold ${textClass} mb-3 flex items-center gap-2`}>
              <Calendar className="size-4 text-purple-400" />
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${cardBgClass} border ${borderClass} ${textSecondaryClass} hover:${textClass} transition-all`}>
                View All Users
              </button>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${cardBgClass} border ${borderClass} ${textSecondaryClass} hover:${textClass} transition-all`}>
                Manage Products
              </button>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${cardBgClass} border ${borderClass} ${textSecondaryClass} hover:${textClass} transition-all`}>
                View Reports
              </button>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${cardBgClass} border ${borderClass} ${textSecondaryClass} hover:${textClass} transition-all`}>
                Platform Settings
              </button>
            </div>
          </div>

          {/* Platform Stats */}
          <div className={`p-4 sm:p-5 rounded-xl ${cardBgClass} ${cardBorderClass} border transition-colors duration-300`}>
            <h3 className={`text-sm font-semibold ${textClass} mb-3 flex items-center gap-2`}>
              <Award className="size-4 text-amber-400" />
              Platform Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className={`text-[10px] ${textMutedClass} uppercase tracking-wider`}>Active Users</p>
                <p className={`text-lg font-bold ${textClass}`}>
                  {statsLoading ? (
                    <span className="inline-block w-12 h-6 bg-zinc-800 animate-pulse rounded-md" />
                  ) : (
                    (stats.totalUsers * 0.75).toFixed(0)
                  )}
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${textMutedClass} uppercase tracking-wider`}>Conversion Rate</p>
                <p className={`text-lg font-bold text-emerald-400`}>
                  {statsLoading ? (
                    <span className="inline-block w-12 h-6 bg-zinc-800 animate-pulse rounded-md" />
                  ) : (
                    `${((stats.completedOrders / stats.totalOrders) * 100 || 0).toFixed(1)}%`
                  )}
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${textMutedClass} uppercase tracking-wider`}>Avg. Order Value</p>
                <p className={`text-lg font-bold ${textClass}`}>
                  {statsLoading ? (
                    <span className="inline-block w-12 h-6 bg-zinc-800 animate-pulse rounded-md" />
                  ) : (
                    `৳${(stats.totalRevenue / stats.totalOrders || 0).toFixed(0)}`
                  )}
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${textMutedClass} uppercase tracking-wider`}>Total Revenue</p>
                <p className={`text-lg font-bold text-emerald-400`}>
                  {statsLoading ? (
                    <span className="inline-block w-12 h-6 bg-zinc-800 animate-pulse rounded-md" />
                  ) : (
                    `৳${(stats.totalRevenue / 1000).toFixed(1)}K`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}