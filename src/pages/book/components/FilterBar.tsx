import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';

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
}

export function FilterBar({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
}: FilterBarProps) {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
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

    const grouped = categories.reduce((acc: any, cur) => {
        if (!acc[cur.group]) acc[cur.group] = [];
        acc[cur.group].push(cur);
        return acc;
    }, {});

    return (
        <div className="relative">
            <div className="bg-white p-4 rounded-lg shadow-sm border flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm sách..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:ring-1 focus:ring-orange-500"
                    />
                </div>

                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                    Thể loại
                </Button>
            </div>

            {isOpen && (
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
                                                setIsOpen(false);
                                            }}
                                            className="text-sm text-gray-600 hover:text-orange-500 cursor-pointer"
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
