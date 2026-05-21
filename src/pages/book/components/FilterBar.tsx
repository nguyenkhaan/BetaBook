import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Book, ChevronDown, Filter, X } from 'lucide-react';
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
    selectedAuthor?: string;
    selectedPublisher?: string;
    selectedPriceRange: string;
    selectedStockStatus: string;
    setSelectedPriceRange: (value: string) => void;
    setSelectedCategory: (value: string) => void;
    setSelectedAuthor?: (value: string) => void;
    setSelectedPublisher?: (value: string) => void;
    setSelectedStockStatus: (value: string) => void;
    handleResetFilters: () => void;
    allBooks: BookItem[];
    onSelectBook: (book: BookItem) => void;
}

export function FilterBar({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedAuthor,
    selectedPublisher,
    setSelectedCategory,
    setSelectedAuthor,
    setSelectedPublisher,
    allBooks,
    onSelectBook,
    selectedPriceRange,
    setSelectedPriceRange,
    selectedStockStatus,
    setSelectedStockStatus,
    handleResetFilters,
}: FilterBarProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [localSelectedAuthor, setLocalSelectedAuthor] = useState('');
    const [localSelectedPublisher, setLocalSelectedPublisher] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);

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
            if (
                categoryRef.current &&
                !categoryRef.current.contains(event.target as Node)
            ) {
                setIsCategoryOpen(false);
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
            .slice(0, 5);
    }, [searchTerm, allBooks]);

    const authors = useMemo(
        () =>
            Array.from(
                new Set(
                    allBooks
                        .map((book) => (book as any).author)
                        .filter(Boolean),
                ),
            ).sort(),
        [allBooks],
    );

    const publishers = useMemo(
        () =>
            Array.from(
                new Set(
                    allBooks
                        .map((book) => (book as any).publisher)
                        .filter(Boolean),
                ),
            ).sort(),
        [allBooks],
    );

    const authorValue = selectedAuthor ?? localSelectedAuthor;
    const publisherValue = selectedPublisher ?? localSelectedPublisher;

    const grouped = categories.reduce((acc: any, cur) => {
        if (!acc[cur.group]) acc[cur.group] = [];
        acc[cur.group].push(cur);
        return acc;
    }, {});

    const hasActiveFilters = Boolean(
        searchTerm ||
        selectedCategory ||
        authorValue ||
        publisherValue ||
        selectedPriceRange ||
        selectedStockStatus,
    );

    const handleSearchInputChange = (value: string) => {
        setSearchTerm(value);
        setShowSuggestions(Boolean(value.trim()));
    };

    const handleAuthorChange = (value: string) => {
        if (setSelectedAuthor) setSelectedAuthor(value);
        else setLocalSelectedAuthor(value);
    };

    const handlePublisherChange = (value: string) => {
        if (setSelectedPublisher) setSelectedPublisher(value);
        else setLocalSelectedPublisher(value);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        handleAuthorChange('');
        handlePublisherChange('');
        setSelectedPriceRange('');
        setSelectedStockStatus('');
        setShowSuggestions(false);
        setIsCategoryOpen(false);
        handleResetFilters();
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full relative z-20">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between w-full">
                <div className="relative w-full lg:flex-1 z-50" ref={searchRef}>
                    <div className="relative flex items-center w-full h-10 rounded-lg bg-gray-50 border border-gray-200 focus-within:bg-white focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                            value={searchTerm}
                            onFocus={() => setShowSuggestions(true)}
                            onChange={(e) =>
                                handleSearchInputChange(e.target.value)
                            }
                            placeholder="Tìm kiếm sách theo tên hoặc mã..."
                            className="w-full h-full pl-10 pr-10 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none rounded-lg"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => handleSearchInputChange('')}
                                className="absolute right-3 p-1 rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-[300px] overflow-y-auto">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/90 sticky top-0 backdrop-blur-sm z-10 border-b border-gray-100">
                                Kết quả tìm kiếm
                            </div>
                            {suggestions.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => {
                                        onSelectBook(book);
                                        setSearchTerm(book.title);
                                        setShowSuggestions(false);
                                    }}
                                    className="group flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-none bg-white"
                                >
                                    <div className="w-10 h-14 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                        {book.coverImage ? (
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Book className="w-5 h-5 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                            {book.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            Mã: {book.code}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-bold text-gray-900">
                                            {book.cost.toLocaleString()}đ
                                        </p>
                                        <div className="mt-1">
                                            <span
                                                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${book.stock < 30 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                            >
                                                Kho: {book.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    className="flex items-center gap-3 w-full lg:w-auto relative z-40"
                    ref={categoryRef}
                >
                    <div className="relative flex-1 lg:flex-none">
                        <Button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className={`w-full lg:w-[200px] h-10 px-4 rounded-lg transition-all border flex items-center justify-between ${
                                selectedCategory
                                    ? 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center overflow-hidden">
                                <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="font-medium text-sm truncate">
                                    {selectedCategory || 'Thể loại'}
                                </span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}
                            />
                        </Button>

                        {isCategoryOpen && (
                            <div className="absolute top-[calc(100%+8px)] right-0 lg:right-auto lg:left-0 w-[calc(100vw-32px)] md:w-[600px] max-h-[60vh] overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl p-5 z-[100]">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.keys(grouped).map((group) => (
                                        <div key={group} className="space-y-3">
                                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                                                {group}
                                            </h3>
                                            <div className="flex flex-col gap-1 pl-3 border-l-2 border-gray-100">
                                                {grouped[group].map(
                                                    (cat: Category) => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => {
                                                                setSelectedCategory(
                                                                    cat.name,
                                                                );
                                                                setIsCategoryOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className={`text-left text-sm py-1.5 px-2 rounded-md transition-colors w-full truncate ${
                                                                selectedCategory ===
                                                                cat.name
                                                                    ? 'bg-orange-50 text-orange-600 font-semibold'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                                                            }`}
                                                        >
                                                            {cat.name}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <Button
                            onClick={handleClearFilters}
                            variant="ghost"
                            className="h-10 px-4 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0 text-sm font-medium"
                        >
                            Xóa lọc
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full relative z-30">
                <div className="relative w-full">
                    <select
                        value={selectedStockStatus}
                        onChange={(e) => setSelectedStockStatus(e.target.value)}
                        className={`w-full h-10 pl-3 pr-9 text-sm rounded-lg appearance-none outline-none transition-all cursor-pointer border ${
                            selectedStockStatus
                                ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <option value="">Trạng thái kho</option>
                        <option value="Dưới 30">Dưới 30 cuốn</option>
                        <option value="30 - 100">30 - 100 cuốn</option>
                        <option value="100-200">100 - 200 cuốn</option>
                        <option value="Trên 200">Trên 200 cuốn</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${selectedStockStatus ? 'text-orange-500' : 'text-gray-400'}`}
                    />
                </div>

                <div className="relative w-full">
                    <select
                        value={selectedPriceRange}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className={`w-full h-10 pl-3 pr-9 text-sm rounded-lg appearance-none outline-none transition-all cursor-pointer border ${
                            selectedPriceRange
                                ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <option value="">Khoảng giá</option>
                        <option value="0-100000">Dưới 100.000đ</option>
                        <option value="100000-200000">
                            100.000đ - 200.000đ
                        </option>
                        <option value="200000-500000">
                            200.000đ - 500.000đ
                        </option>
                        <option value="500000+">Trên 500.000đ</option>
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${selectedPriceRange ? 'text-orange-500' : 'text-gray-400'}`}
                    />
                </div>

                <div className="relative w-full">
                    <select
                        value={authorValue}
                        onChange={(e) => handleAuthorChange(e.target.value)}
                        className={`w-full h-10 pl-3 pr-9 text-sm rounded-lg appearance-none outline-none transition-all cursor-pointer border ${
                            authorValue
                                ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <option value="">Tác giả</option>
                        {authors.map((author) => (
                            <option key={author} value={author}>
                                {author}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${authorValue ? 'text-orange-500' : 'text-gray-400'}`}
                    />
                </div>

                <div className="relative w-full">
                    <select
                        value={publisherValue}
                        onChange={(e) => handlePublisherChange(e.target.value)}
                        className={`w-full h-10 pl-3 pr-9 text-sm rounded-lg appearance-none outline-none transition-all cursor-pointer border ${
                            publisherValue
                                ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium'
                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <option value="">Nhà xuất bản</option>
                        {publishers.map((publisher) => (
                            <option key={publisher} value={publisher}>
                                {publisher}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${publisherValue ? 'text-orange-500' : 'text-gray-400'}`}
                    />
                </div>
            </div>
        </div>
    );
}
