import React from 'react';
import { UserCircle } from 'lucide-react';

interface SidebarLogoProps {
    isCollapsed: boolean;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ isCollapsed }) => {
    return (
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <UserCircle size={42} className="text-orange-500" />
            {!isCollapsed && (
                <div className="text-orange-500 font-bold text-xl">
                    Utahime Book
                </div>
            )}
        </div>
    );
};
