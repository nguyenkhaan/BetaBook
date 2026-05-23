import React from 'react';
import { TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';

export function SummaryCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Doanh thu tháng này
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            25.0M
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">
                                +12.5%
                            </span>
                        </div>
                    </div>
                    <ClipboardList className="w-10 h-10 text-orange-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Đơn hàng</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            245
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">
                                +8.3%
                            </span>
                        </div>
                    </div>
                    <ClipboardList className="w-10 h-10 text-blue-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Giá trị đơn TB
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            102K
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">
                                +5.2%
                            </span>
                        </div>
                    </div>
                    <ClipboardList className="w-10 h-10 text-green-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Tỷ lệ hoàn trả
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            2.3%
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-600">
                                -0.5%
                            </span>
                        </div>
                    </div>
                    <ClipboardList className="w-10 h-10 text-red-500" />
                </div>
            </div>
        </div>
    );
}
