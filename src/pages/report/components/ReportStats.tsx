import React from 'react';
import { DollarSign, ShoppingCart, Users, BookOpen, LucideIcon } from 'lucide-react';

interface ReportStatsProps {
    totalRevenue: number;
    totalOrders: number;
    newCustomers: number;
    totalBooksSold: number;
}

interface StatCardProps {
    icon: LucideIcon;
    title: string;
    value: string | number;
    color: string;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`p-6 rounded-lg shadow-sm flex items-center gap-4 ${bgColor}`}>
        <div className={`p-3 rounded-full bg-white/50`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-sm text-white/80">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export function ReportStats({ totalRevenue, totalOrders, newCustomers, totalBooksSold }: ReportStatsProps) {
    const stats = [
        {
            icon: DollarSign,
            title: 'Tổng doanh thu',
            value: `${(totalRevenue / 1000000).toFixed(1)}M`,
            color: 'text-green-600',
            bgColor: 'bg-green-500',
        },
        {
            icon: ShoppingCart,
            title: 'Tổng đơn hàng',
            value: totalOrders,
            color: 'text-blue-600',
            bgColor: 'bg-blue-500',
        },
        {
            icon: Users,
            title: 'Khách hàng mới',
            value: newCustomers,
            color: 'text-purple-600',
            bgColor: 'bg-purple-500',
        },
        {
            icon: BookOpen,
            title: 'Sách đã bán',
            value: totalBooksSold,
            color: 'text-orange-600',
            bgColor: 'bg-orange-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}
