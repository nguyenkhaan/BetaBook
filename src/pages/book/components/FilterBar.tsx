import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Book } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { BookItem } from '../BooksPage';

interface Category {
    id: string;
    name: string;
    group: string;
}

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategory: string;
    selectedPriceRange: string;
    setSelectedPriceRange: (value: string) => void;
    setSelectedCategory: (value: string) => void;
    handleResetFilters: () => void;
    allBooks: BookItem[];
    onSelectBook: (book: BookItem) => void;
}

export function FilterBar({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    allBooks,
    onSelectBook,
    selectedPriceRange,
    setSelectedPriceRange,
    handleResetFilters,
}: FilterBarProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const suggestions = useMemo(() => {
        if (!searchTerm.trim()) return [];
        return allBooks
            .filter(
                (book) =>
                    book.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    book.code.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .slice(0, 6);
    }, [searchTerm, allBooks]);

    const grouped = categories.reduce((acc: any, cur) => {
        if (!acc[cur.group]) acc[cur.group] = [];
        acc[cur.group].push(cur);
        return acc;
    }, {});

    const handleSearchInputChange = (value: string) => {
        setSearchTerm(value);
        setShowSuggestions(Boolean(value.trim()));
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category.name);
        setIsCategoryOpen(false);
    };

    const handlePriceRangeChange = (value: string) => {
        setSelectedPriceRange(value);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedPriceRange('');
        setShowSuggestions(false);
        setIsCategoryOpen(false);
        handleResetFilters();
    };

    return (
        <div className="relative space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={searchTerm}
                        onFocus={() => setShowSuggestions(true)}
                        onChange={(e) => handleSearchInputChange(e.target.value)}
                        placeholder="Tìm kiếm sách theo tên hoặc mã..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                    />

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-xl z-[60] overflow-hidden">
                            {suggestions.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => {
                                        onSelectBook(book);
                                        setSearchTerm(book.title);
                                        setShowSuggestions(false);
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-orange-50 cursor-pointer border-b last:border-none transition-colors"
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {book.coverImage ? (
                                            <img
                                                src={book.coverImage}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Book className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                                            {book.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {book.code}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-orange-600">
                                            {book.cost.toLocaleString()}đ
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            Kho: {book.stock}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                        value={selectedPriceRange}
                        onChange={(e) => handlePriceRangeChange(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                    >
                        <option value="">Giá</option>
                        <option value="0-100000">Dưới 100k</option>
                        <option value="100000-200000">100k - 200k</option>
                        <option value="200000-500000">200k - 500k</option>
                        <option value="500000+">Trên 500k</option>
                    </select>

                    <Button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        {selectedCategory || 'Thể loại'}
                    </Button>

                    <Button
                        onClick={handleClearFilters}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        Đặt lại
                    </Button>
                </div>
            </div>

            {isCategoryOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white border rounded-xl shadow-xl p-6 z-50">
                    <div className="grid grid-cols-4 gap-6">
                        {Object.keys(grouped).map((group) => (
                            <div key={group}>
                                <h3 className="font-bold text-gray-800 mb-2">
                                    {group}
                                </h3>
                                <div className="space-y-1">
                                    {grouped[group].map((cat: Category) => (
                                        <p
                                            key={cat.id}
                                            onClick={() => {
                                                setSelectedCategory(cat.name);
                                                setIsCategoryOpen(false);
                                            }}
                                            className="text-sm text-gray-600 hover:text-orange-500 cursor-pointer transition-colors"
                                        >
                                            {cat.name}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
