import React from 'react';
import { Users } from 'lucide-react';

interface StatisticProps {
    totalCustomers: number;
    vipCustomers: number;
    totalRevenue: number;
    newCustomers: number;
}

export function Statistic({
    totalCustomers,
    vipCustomers,
    totalRevenue,
    newCustomers,
}: StatisticProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">Tổng khách hàng</p>
                    <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
                <Users className="w-10 h-10 text-orange-500" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">Khách VIP</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {vipCustomers}
                    </p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">Tổng doanh thu</p>
                    <p className="text-2xl font-bold">
                        {(totalRevenue / 1000000).toFixed(2)}M
                    </p>
                </div>
                <Users className="w-10 h-10 text-green-500" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">Khách hàng mới</p>
                    <p className="text-2xl font-bold">{newCustomers}</p>
                </div>
                <Users className="w-10 h-10 text-purple-500" />
            </div>
        </div>
    );
}