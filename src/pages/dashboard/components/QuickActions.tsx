import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { TrendingUp, FileText, BookOpen, UserPlus, Receipt, Tag, BarChart3, LucideIcon } from 'lucide-react';

interface QuickActionProps {
    icon: LucideIcon;
    label: string;
    subLabel: string;
    onClick: () => void;
    colorScheme: 'orange' | 'blue' | 'green' | 'teal' | 'pink' | 'indigo';
}

const QuickActionButton: React.FC<QuickActionProps> = ({ icon: Icon, label, subLabel, onClick, colorScheme }) => {
    const schemes = {
        orange: {
            bg: 'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200',
            border: 'hover:border-orange-300',
            iconBg: 'bg-orange-500'
        },
        blue: {
            bg: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200',
            border: 'hover:border-blue-300',
            iconBg: 'bg-blue-500'
        },
        green: {
            bg: 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200',
            border: 'hover:border-green-300',
            iconBg: 'bg-green-500'
        },
        teal: {
            bg: 'from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200',
            border: 'hover:border-teal-300',
            iconBg: 'bg-teal-500'
        },
        pink: {
            bg: 'from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200',
            border: 'hover:border-pink-300',
            iconBg: 'bg-pink-500'
        },
        indigo: {
            bg: 'from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200',
            border: 'hover:border-indigo-300',
            iconBg: 'bg-indigo-500'
        },
    };

    const scheme = schemes[colorScheme];

    return (
        <button
            className={`group p-4 cursor-pointer bg-gradient-to-br ${scheme.bg} rounded-xl transition-all duration-200 text-center border-2 border-transparent ${scheme.border} hover:shadow-lg`}
            onClick={onClick}
        >
            <div className={`w-12 h-12 ${scheme.iconBg} rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-900">{label}</p>
            <p className="text-xs text-gray-600 mt-1">{subLabel}</p>
        </button>
    );
};

interface QuickActionsProps {
    onInvoice: () => void;
    onBook: () => void;
    onCustomer: () => void;
    onReceipt: () => void;
    onPromotion: () => void;
    onNavigate: (page: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onInvoice,
    onBook,
    onCustomer,
    onReceipt,
    onPromotion,
    onNavigate,
}) => {
    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center cursor-pointer gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Thao tác nhanh
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <QuickActionButton
                        icon={FileText}
                        label="Tạo hóa đơn"
                        subLabel="Hóa đơn mới"
                        onClick={onInvoice}
                        colorScheme="orange"
                    />
                    <QuickActionButton
                        icon={BookOpen}
                        label="Thêm sách"
                        subLabel="Sách mới"
                        onClick={onBook}
                        colorScheme="blue"
                    />
                    <QuickActionButton
                        icon={UserPlus}
                        label="Thêm KH"
                        subLabel="Khách hàng"
                        onClick={onCustomer}
                        colorScheme="green"
                    />
                    <QuickActionButton
                        icon={Receipt}
                        label="Phiếu thu"
                        subLabel="Tạo mới"
                        onClick={onReceipt}
                        colorScheme="teal"
                    />
                    <QuickActionButton
                        icon={Tag}
                        label="Khuyến mãi"
                        subLabel="Tạo mới"
                        onClick={onPromotion}
                        colorScheme="pink"
                    />
                    <QuickActionButton
                        icon={BarChart3}
                        label="Báo cáo"
                        subLabel="Thống kê"
                        onClick={() => onNavigate('reports')}
                        colorScheme="indigo"
                    />
                </div>
            </CardContent>
        </Card>
    );
};
