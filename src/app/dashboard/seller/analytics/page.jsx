"use client";

import SellerAnalyticsCharts from '@/components/dashboard/seller/SellerAnalyticsCharts';
import SellerAnalyticsTotalCard from '@/components/dashboard/seller/SellerAnalyticsTotalCard';
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Calendar, Filter, ChevronDown } from 'lucide-react';

const SellerAnalyticsHomePage = () => {
    // Use next-themes hook
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    
    const [timeRange, setTimeRange] = useState("30d");

    // Theme classes
    const bgClass = isDark ? "bg-zinc-950" : "bg-gray-50";
    const textClass = isDark ? "text-zinc-100" : "text-gray-900";
    const textSecondaryClass = isDark ? "text-zinc-400" : "text-gray-600";
    const textMutedClass = isDark ? "text-zinc-500" : "text-gray-500";
    const borderClass = isDark ? "border-zinc-800/80" : "border-gray-200/80";
    const cardBgClass = isDark ? "bg-zinc-900/40" : "bg-white/60";
    const inputBgClass = isDark ? "bg-zinc-900/60" : "bg-white/60";
    const inputBorderClass = isDark ? "border-zinc-800" : "border-gray-200";
    const selectTextClass = isDark ? "text-zinc-300" : "text-gray-700";

    const timeRangeOptions = [
        { value: "7d", label: "Last 7 Days" },
        { value: "30d", label: "Last 30 Days" },
        { value: "90d", label: "Last 90 Days" },
        { value: "1y", label: "Last Year" },
    ];

    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
    };

    return (
        <div className={`w-full min-h-screen ${bgClass} ${textClass} p-4 sm:p-6 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                        <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${textClass}`}>
                            Sales Analytics
                        </h1>
                        <p className={`text-xs sm:text-sm ${textSecondaryClass} mt-1`}>
                            Track your sales performance and revenue trends.
                        </p>
                    </div>
                    
                    {/* Time Range Filter */}
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Calendar className={`size-4 ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
                        </div>
                        <select
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                            className={`w-full sm:w-auto ${inputBgClass} ${inputBorderClass} ${selectTextClass} rounded-xl pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors appearance-none min-w-[140px]`}
                        >
                            {timeRangeOptions.map((option) => (
                                <option key={option.value} value={option.value} className={isDark ? "bg-zinc-900" : "bg-white"}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none ${isDark ? "text-zinc-500" : "text-gray-400"}`} />
                    </div>
                </div>

                {/* Total Cards - Pass theme and timeRange if needed */}
                <SellerAnalyticsTotalCard />

                {/* Charts - Pass theme and timeRange if needed */}
                <SellerAnalyticsCharts />
            </div>
        </div>
    );
};

export default SellerAnalyticsHomePage;