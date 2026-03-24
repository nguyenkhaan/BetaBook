import { Button } from "../../../components/ui/button";
import { Search } from "lucide-react";

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
}

const FilterBar = ({ searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory }: FilterBarProps) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm quy định..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={
                            selectedCategory === category
                                ? 'default'
                                : 'outline'
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={
                            selectedCategory === category
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : ''
                        }
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
