import SellerAnalyticsTotalCard from '@/components/dashboard/seller/SellerAnalyticsTotalCard';
import SellerAnalyticsCharts from '@/components/dashboard/seller/SellerAnalyticsCharts';
import React from 'react';

const SellerHomePage = () => {
    return (
        <div>
            <SellerAnalyticsTotalCard />
            <SellerAnalyticsCharts />
        </div>
    );
};

export default SellerHomePage;