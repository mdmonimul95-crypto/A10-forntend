import SellerAnalyticsCharts from '@/components/dashboard/seller/SellerAnalyticsCharts';
import SellerAnalyticsTotalCard from '@/components/dashboard/seller/SellerAnalyticsTotalCard';
import React from 'react';

const SellerAnalyticsHomePage = () => {
    return (
        <div className="w-full bg-zinc-950 text-zinc-100 p-6 min-h-screen space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                    Sales Analytics
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                    Track your sales performance and revenue trends.
                </p>
            </div>
            <SellerAnalyticsTotalCard/>
            <SellerAnalyticsCharts/>
        </div>
    );
};

export default SellerAnalyticsHomePage;