import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    iconBgColor?: string;
    iconColor?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ 
    icon: Icon, 
    label, 
    value, 
    iconBgColor = 'bg-orange-100', 
    iconColor = 'text-orange-600' 
}) => (
    <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-gray-900 font-medium">{value}</p>
        </div>
    </div>
);

interface InfoSectionProps {
    title: string;
    items: InfoItemProps[];
}

export const InfoSection: React.FC<InfoSectionProps> = ({ title, items }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <InfoItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};
