import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    path: string;
    isActive: boolean;
    isCollapsed: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    path,
    isActive,
    isCollapsed,
}) => {
    return (
        <Link
            to={path}
            className={`flex items-center mb-1 transition-all duration-300 rounded-lg py-3 ${
                isCollapsed
                    ? 'justify-center px-0'
                    : 'justify-start px-4 gap-3'
            } ${
                isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
            }`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
                <span className="text-sm font-medium">{label}</span>
            )}
        </Link>
    );
};
