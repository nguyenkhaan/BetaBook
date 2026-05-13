import React from 'react';
import { FileDown } from 'lucide-react';

interface ImportStatsProps {
    totalCount: number;
    totalAmount: number;
    completedCount: number;
    processingCount: number;
}

export const ImportStats: React.FC<ImportStatsProps> = ({
    totalCount,
    totalAmount,
    completedCount,
    processingCount,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Tổng phiếu nhập</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {totalCount}
                        </p>
                    </div>
                    <FileDown className="w-10 h-10 text-orange-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Tổng giá trị</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {(totalAmount).toFixed(1)}M
                        </p>
                    </div>
                    <FileDown className="w-10 h-10 text-green-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Hoàn thành</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {completedCount}
                        </p>
                    </div>
                    <FileDown className="w-10 h-10 text-green-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Đang xử lý</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                            {processingCount}
                        </p>
                    </div>
                    <FileDown className="w-10 h-10 text-yellow-500" />
                </div>
            </div>
        </div>
    );
};
