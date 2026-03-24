import { Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';

interface InvoiceFilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    priceFilter: string;
    onPriceFilterChange: (value: string) => void;
    onResetFilters: () => void;
}

export function InvoiceFilterBar({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    priceFilter,
    onPriceFilterChange,
    onResetFilters,
}: InvoiceFilterBarProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Tìm kiếm mã đơn..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="w-48">
                <Select
                    value={statusFilter}
                    onValueChange={onStatusFilterChange}
                >
                    <SelectTrigger className="h-10 border-gray-200 text-sm">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                        <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                        <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-70">
                <Select value={priceFilter} onValueChange={onPriceFilterChange}>
                    <SelectTrigger className="h-10 border-gray-200 text-sm">
                        <SelectValue placeholder="Khoảng giá" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả giá</SelectItem>
                        <SelectItem value="under100">Dưới 100k</SelectItem>
                        <SelectItem value="100-200">100k - 200k</SelectItem>
                        <SelectItem value="200-500">200k - 500k</SelectItem>
                        <SelectItem value="over500">Trên 500k</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                variant="outline"
                size="icon"
                className="border-gray-200 hover:bg-orange-50 group"
                onClick={onResetFilters}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange-500 group-hover:rotate-180 transition-transform duration-300"
                >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
            </Button>
        </div>
    );
}
