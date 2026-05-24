import React from 'react';
import { Search } from 'lucide-react';

interface PromotionFilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export function PromotionFilterBar({ searchTerm, onSearchChange }: PromotionFilterBarProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo mã hoặc tên khuyến mãi..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}
