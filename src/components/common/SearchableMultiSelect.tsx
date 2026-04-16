import React, { useState, useEffect, useRef } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronsUpDown, X } from 'lucide-react';
import { cn } from '../ui/utils';

export interface SearchableOption {
    id: number;
    label: string;
}

interface SearchableMultiSelectProps {
    options: SearchableOption[];
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    onSearch?: (query: string) => Promise<SearchableOption[]>;
    isLoading?: boolean;
}

export function SearchableMultiSelect({
    options,
    selectedIds,
    onSelectionChange,
    placeholder = 'Select items...',
    searchPlaceholder = 'Search...',
    onSearch,
}: SearchableMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] =
        useState<SearchableOption[]>(options);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults(options);
            setIsSearching(false);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            if (onSearch) {
                try {
                    const results = await onSearch(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                }
            } else {
                // Client-side filtering
                const filtered = options.filter((opt) =>
                    opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
                );
                setSearchResults(filtered);
            }
            setIsSearching(false);
        }, 300); // Debounce for 300ms
    }, [searchQuery, options, onSearch]);

    const selectedItems = selectedIds
        .map((id) => {
            return (
                searchResults.find((opt) => opt.id === id) ||
                options.find((opt) => opt.id === id)
            );
        })
        .filter(Boolean) as SearchableOption[];

    const handleSelect = (id: number) => {
        const newIds = selectedIds.includes(id)
            ? selectedIds.filter((i) => i !== id)
            : [...selectedIds, id];
        onSelectionChange(newIds);
    };

    const handleRemove = (id: number) => {
        onSelectionChange(selectedIds.filter((i) => i !== id));
    };

return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full min-h-10 h-auto justify-between bg-white border-gray-200 hover:bg-white px-3 py-2"
                >
                    <div className="flex flex-wrap gap-1.5 overflow-hidden">
                        {selectedIds.length > 0 ? (
                            selectedItems.map((item) => (
                                <Badge 
                                    key={item.id} 
                                    variant="secondary" 
                                    className="rounded-sm font-normal px-1"
                                >
                                    {item.label}
                                    <X 
                                        className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(item.id);
                                        }}
                                    />
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            
            <PopoverContent 
                className="p-0 w-[var(--radix-popover-trigger-width)] bg-white" 
                align="start"
                sideOffset={4}
            >
                <Command className="w-full border-none" shouldFilter={!onSearch}>
                    <div className="flex items-center border-b px-3">
                        {/* We replace the default CommandInput wrapper or style it 
                           manually to ensure it takes up 100% width and removes the 
                           awkward "floating box" look from your screenshot.
                        */}
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus:ring-0"
                        />
                    </div>
                    <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                            {isSearching ? 'Searching...' : 'No items found.'}
                        </CommandEmpty>
                        <CommandGroup className="p-1">
                            {searchResults.map((option) => {
                                const isSelected = selectedIds.includes(option.id);
                                return (
                                    <CommandItem
                                        key={option.id}
                                        onSelect={() => handleSelect(option.id)}
                                        className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100 rounded-sm"
                                    >
                                        <div 
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded border border-gray-300",
                                                isSelected ? "bg-blue-600 border-blue-600" : "bg-white"
                                            )}
                                        >
                                            {isSelected && (
                                                <div className="h-2 w-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                        <span className="flex-1 text-sm">{option.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
