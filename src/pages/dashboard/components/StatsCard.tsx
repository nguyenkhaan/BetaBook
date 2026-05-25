import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { TrendingUp, LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
}) => {
    return (
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                    <div
                        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
                    >
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
