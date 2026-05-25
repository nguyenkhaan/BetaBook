import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
    currentPage: string;
    pageLabels: Record<string, string>;
    onNavigate?: (page: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    currentPage,
    pageLabels,
    onNavigate,
}) => {
    if (currentPage === 'regulation-detail') {
        return (
            <>
                <span
                    className="cursor-pointer hover:text-orange-600"
                    onClick={() => onNavigate?.('dashboard')}
                >
                    Trang chủ
                </span>
                <ChevronRight className="w-4 h-4" />
                <span
                    className="cursor-pointer hover:text-orange-600"
                    onClick={() => onNavigate?.('regulations')}
                >
                    Quy định
                </span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">Chi tiết quy định</span>
            </>
        );
    }

    return (
        <>
            <span
                className="cursor-pointer hover:text-orange-600"
                onClick={() => onNavigate?.('dashboard')}
            >
                Trang chủ
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">
                {pageLabels[currentPage] || 'Nghỉ việc'}
            </span>
        </>
    );
};
