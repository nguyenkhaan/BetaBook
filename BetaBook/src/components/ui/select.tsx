import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../ui/utils'; // Assuming you have a cn utility, or use standard template literals

interface SelectContextType {
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
    undefined,
);

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    defaultValue?: string;
    className?: string;
}

export function Select({
    value,
    onValueChange,
    children,
    defaultValue,
    className,
}: SelectProps) {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
        defaultValue || '',
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (newValue: string) => {
        if (value === undefined) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
        setOpen(false);
    };

    // Close on click outside
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <SelectContext.Provider
            value={{
                value: currentValue,
                onValueChange: handleValueChange,
                open,
                setOpen,
            }}
        >
            <div
                ref={containerRef}
                className={cn('relative w-full', className)}
            >
                {children}
            </div>
        </SelectContext.Provider>
    );
}

interface SelectTriggerProps {
    children: React.ReactNode;
    className?: string;
}

export function SelectTrigger({
    children,
    className = '',
}: SelectTriggerProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error('SelectTrigger must be used within Select');

    return (
        <button
            type="button"
            onClick={() => context.setOpen(!context.open)}
            className={cn(
                'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
        >
            <div className="flex items-center gap-2 overflow-hidden truncate">
                {children}
            </div>
            <ChevronDown
                className={cn(
                    'h-4 w-4 shrink-0 opacity-50 transition-transform duration-200',
                    context.open && 'rotate-180',
                )}
            />
        </button>
    );
}

interface SelectValueProps {
    placeholder?: string;
    className?: string;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error('SelectValue must be used within Select');

    return (
        <span
            className={cn(
                'truncate',
                context.value ? 'text-gray-900' : 'text-gray-500',
                className,
            )}
        >
            {/* Note: This logic assumes you are passing the label string via context. 
                In a more complex select, you'd find the label from the children. */}
            {context.value || placeholder}
        </span>
    );
}

interface SelectContentProps {
    children: React.ReactNode;
    className?: string;
}

export function SelectContent({
    children,
    className = '',
}: SelectContentProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error('SelectContent must be used within Select');

    if (!context.open) return null;

    return (
        <div
            className={cn(
                'absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border border-gray-200 bg-white text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 mt-1',
                className,
            )}
        >
            <div className="p-1 max-h-60 overflow-y-auto">{children}</div>
        </div>
    );
}

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function SelectItem({
    value,
    children,
    className = '',
}: SelectItemProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error('SelectItem must be used within Select');

    const isSelected = context.value === value;

    return (
        <div
            onClick={() => context.onValueChange(value)}
            className={cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-3 text-sm outline-none hover:bg-orange-50 hover:text-orange-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                isSelected && 'bg-orange-100 text-orange-900 font-medium',
                className,
            )}
        >
            <span className="flex-1 truncate">{children}</span>
            {isSelected && <Check className="h-4 w-4 ml-2 shrink-0" />}
        </div>
    );
}
