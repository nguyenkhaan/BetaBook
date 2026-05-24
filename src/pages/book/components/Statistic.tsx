import React from 'react';
import { Book } from 'lucide-react';

interface StatisticProps {
    totalBooks: number;
    totalStock: number;
    inventoryValue: number;
    lowStockBooks: number;
}

export function Statistic({
    totalBooks,
    totalStock,
    inventoryValue,
    lowStockBooks,
}: StatisticProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Tổng đầu sách
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {totalBooks}
                        </p>
                    </div>
                    <Book className="w-10 h-10 text-orange-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Tổng số lượng
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {totalStock}
                        </p>
                    </div>
                    <Book className="w-10 h-10 text-blue-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Giá trị kho</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {(inventoryValue / 1000000).toFixed(2)}M
                        </p>
                    </div>
                    <Book className="w-10 h-10 text-green-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Sắp hết hàng
                        </p>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                            {lowStockBooks}
                        </p>
                    </div>
                    <Book className="w-10 h-10 text-red-500" />
                </div>
            </div>
        </div>
    );
}
