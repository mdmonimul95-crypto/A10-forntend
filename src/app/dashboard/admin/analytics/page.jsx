"use client";

import AdminAnalyticsCharts from '@/components/dashboard/admin/AdminAnalyticsCharts';
import AdminAnalyticsTotalCard from '@/components/dashboard/admin/AdminAnalyticsTotalCard';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

const AnalyticsHomePage = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 sm:p-6 min-h-screen space-y-6 transition-colors">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Platform Analytics
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Track platform growth, product performance, and revenue trends.
                    </p>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all shrink-0"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? (
                        <Sun className="size-4" />
                    ) : (
                        <Moon className="size-4" />
                    )}
                </button>
            </div>
            <AdminAnalyticsTotalCard/>
            <AdminAnalyticsCharts/>
        </div>
    );
};

export default AnalyticsHomePage;