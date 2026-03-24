import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedLevel: string;
    setSelectedLevel: (value: string) => void;
    selectedDate: string;
    setSelectedDate: (value: string) => void;
    handleResetFilters: () => void;
}

export function FilterBar({
    searchTerm,
    setSearchTerm,
    selectedLevel,
    setSelectedLevel,
    selectedDate,
    setSelectedDate,
    handleResetFilters,
}: FilterBarProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Tìm tên, email, số điện thoại..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="w-44">
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="h-10 border-gray-200 text-sm">
                        <SelectValue placeholder="Hạng" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Tất cả">Tất cả hạng</SelectItem>
                        <SelectItem value="Đồng">Đồng</SelectItem>
                        <SelectItem value="Bạc">Bạc</SelectItem>
                        <SelectItem value="Vàng">Vàng</SelectItem>
                        <SelectItem value="Kim cương">Kim cương</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="relative w-44">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            width="18"
                            height="18"
                            x="3"
                            y="4"
                            rx="2"
                            ry="2"
                        />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                </div>
                <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm outline-none text-gray-600"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={handleResetFilters}
                className="border-gray-200 hover:bg-orange-50 group shrink-0"
            >
                <RotateCcw className="w-4 h-4 text-orange-500 group-hover:rotate-180 transition-transform duration-300" />
            </Button>
        </div>
    );
}
