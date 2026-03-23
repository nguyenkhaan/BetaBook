import * as React from 'react';
import { ChevronDown } from 'lucide-react';

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
}

export function Select({
    value,
    onValueChange,
    children,
    defaultValue,
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

    return (
        <SelectContext.Provider
            value={{
                value: currentValue,
                onValueChange: handleValueChange,
                open,
                setOpen,
            }}
        >
            <div className="relative">{children}</div>
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
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white flex items-center justify-between ${className}`}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
}

interface SelectValueProps {
    placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error('SelectValue must be used within Select');

    return (
        <span className={context.value ? 'text-gray-900' : 'text-gray-500'}>
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
        <>
            <div
                className="fixed inset-0 z-40"
                onClick={() => context.setOpen(false)}
            />
            <div
                className={`absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto ${className}`}
            >
                {children}
            </div>
        </>
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
            className={`px-3 py-2 cursor-pointer hover:bg-orange-50 ${isSelected ? 'bg-orange-100 text-orange-900' : 'text-gray-900'} ${className}`}
        >
            {children}
        </div>
    );
}
