import React from 'react';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Promotion } from '../PromotionsPage';

interface PromotionTableProps {
    promotions: Promotion[];
    onView: (promo: Promotion) => void;
    onEdit: (promo: Promotion) => void;
    onDelete: (promo: Promotion) => void;
    onDownload: (promo: Promotion) => void;
    formatDate: (date: string) => string;
    getStatusColor: (status: Promotion['status']) => string;
}

export function PromotionTable({
    promotions,
    onView,
    onEdit,
    onDelete,
    onDownload,
    formatDate,
    getStatusColor,
}: PromotionTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã KM
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên chương trình
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giảm giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Đã dùng / Tối đa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {promotions.map((promo) => (
                        <tr key={promo.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                                {promo.code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {promo.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {promo.type === 'Phần trăm'
                                    ? `${promo.sale}%`
                                    : `${promo.sale.toLocaleString('vi-VN')}đ`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="flex flex-col">
                                    <span>{formatDate(promo.startDate)}</span>
                                    <span className="text-xs text-gray-500">
                                        đến {formatDate(promo.expiresAt)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {promo.usedNumber} / {promo.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        promo.status,
                                    )}`}
                                >
                                    {promo.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onView(promo)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(promo)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(promo)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDownload(promo)}
                                    >
                                        <Download className="w-4 h-4 text-blue-500" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
