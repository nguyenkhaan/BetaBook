import React from 'react';
import { Search } from 'lucide-react';
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
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    selectedPriceRange: string;
    setSelectedPriceRange: (value: string) => void;
    handleResetFilters: () => void;
}

export function FilterBar({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPriceRange,
    setSelectedPriceRange,
    handleResetFilters,
}: FilterBarProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Tìm kiếm tên sách..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="w-44">
                <Select
                    value={selectedCategory}
                    onValueChange={(val) => setSelectedCategory(val)}
                >
                    <SelectTrigger className="h-10 border-gray-200">
                        <SelectValue placeholder="Thể loại"></SelectValue>
                    </SelectTrigger>

                    <SelectContent className="max-h-[160px] overflow-y-auto">
                        <SelectItem value="Văn học">Văn học</SelectItem>
                        <SelectItem value="Trinh thám">
                            Trinh thám
                        </SelectItem>
                        <SelectItem value="Thiếu nhi">Thiếu nhi</SelectItem>
                        <SelectItem value="Giáo dục">Giáo dục</SelectItem>
                        <SelectItem value="Kinh tế">Kinh tế</SelectItem>
                        <SelectItem value="Kỹ năng sống">
                            Kỹ năng sống
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-40">
                <Select
                    value={selectedPriceRange}
                    onValueChange={(val) => setSelectedPriceRange(val)}
                >
                    <SelectTrigger className="h-10 border-gray-200 text-sm">
                        <SelectValue placeholder="Giá" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Tất cả">Tất cả</SelectItem>
                        <SelectItem value="<100.000">
                            Dưới 100k
                        </SelectItem>{' '}
                        <SelectItem value="100.000 - 200.000">
                            100k - 200k
                        </SelectItem>
                        <SelectItem value="200.000 - 500.000">
                            200k - 500k
                        </SelectItem>
                        <SelectItem value="Hơn 500.000">
                            Hơn 500k
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button
                variant="outline"
                size="icon"
                className="border-gray-200 shrink-0 hover:bg-orange-50 group"
                onClick={handleResetFilters}
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
