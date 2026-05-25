import React from 'react';
import { Ticket } from 'lucide-react';
import { Promotion } from '../PromotionsPage';

interface PromotionStatsProps {
    promotions: Promotion[];
}

export function PromotionStats({ promotions }: PromotionStatsProps) {
    const totalCount = promotions.length;
    const activeCount = promotions.filter((p) => p.status === 'APPLYING').length;
    const upcomingCount = promotions.filter((p) => p.status === 'UPCOMING').length;
    const totalUses = promotions.reduce((sum, p) => sum + p.usedNumber, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Tổng chương trình</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</p>
                    </div>
                    <Ticket className="w-10 h-10 text-orange-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Đang áp dụng</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{activeCount}</p>
                    </div>
                    <Ticket className="w-10 h-10 text-green-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Sắp diễn ra</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{upcomingCount}</p>
                    </div>
                    <Ticket className="w-10 h-10 text-blue-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Tổng lượt dùng</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{totalUses}</p>
                    </div>
                    <Ticket className="w-10 h-10 text-purple-500" />
                </div>
            </div>
        </div>
    );
}
