import AdminAnalyticsCharts from '@/components/dashboard/admin/AdminAnalyticsCharts';
import AdminAnalyticsTotalCard from '@/components/dashboard/admin/AdminAnalyticsTotalCard';
import React from 'react';

const AnalyticsHomePage = () => {
    return (
        <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                    Platform Analytics
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                    Track platform growth, product performance, and revenue trends.
                </p>
            </div>
            <AdminAnalyticsTotalCard/>
            <AdminAnalyticsCharts/>
        </div>
    );
};

export default AnalyticsHomePage;