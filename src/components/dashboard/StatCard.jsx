import { Card } from '@heroui/react';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, className = "" }) => {
    const isPositive = trend === "up";
    const isNegative = trend === "down";

    return (
        <Card className={`bg-[#18181b] border border-neutral-800 rounded-2xl ${className}`}>
            <Card.Content className="flex flex-col gap-3 justify-between">

                <div className="flex items-center justify-between">
                    {Icon && (
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-800 text-neutral-300">
                            <Icon width={20} height={20} />
                        </div>
                    )}
                    {/* Trend Badge */}
                    {trendValue && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                            isPositive
                                ? "bg-green-500/10 text-green-400"
                                : isNegative
                                ? "bg-red-500/10 text-red-400"
                                : "bg-neutral-800 text-neutral-400"
                        }`}>
                            {isPositive ? "↑" : isNegative ? "↓" : ""} {trendValue}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-neutral-400">
                        {title}
                    </span>
                    <span className="text-3xl font-semibold text-white tracking-tight">
                        {value}
                    </span>
                </div>

            </Card.Content>
        </Card>
    );
};