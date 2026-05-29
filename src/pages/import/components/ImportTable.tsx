import React from 'react';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../contexts/AuthContext';
import { ImportStatusLabel } from '../../../utilis/label_mapper';
interface ImportOrder {
    id: number;
    importNumber: string;
    supplier: string;
    date: string;
    time: string;
    totalAmount: number;
    totalItems: number;
    createdBy : string; 
    status: 'COMPLETE' | 'PENDING' | 'CANCEL';
    note?: string;
}

interface ImportTableProps {
    imports: ImportOrder[];
    onView: (imp: ImportOrder) => void;
    onEdit: (imp: ImportOrder) => void;
    onDelete: (imp: ImportOrder) => void;
    onDownload: (imp: ImportOrder) => void;
    getStatusColor: (status: ImportOrder['status']) => string;
    formatDateTime: (date: string, time: string) => string;
}

export const ImportTable: React.FC<ImportTableProps> = ({
    imports,
    onView,
    onEdit,
    onDelete,
    onDownload,
    getStatusColor,
    formatDateTime,
}) => {
    const { isAdmin } = useAuth();

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số phiếu nhập
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nhà cung cấp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày nhập
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số lượng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Người tạo
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
                    {imports.map((imp) => (
                        <tr key={imp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-orange-600">
                                    {imp.importNumber}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {imp.supplier}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {formatDateTime(imp.date, imp.time)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {imp.totalItems}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {imp.totalAmount.toLocaleString('vi-VN')}đ
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {imp.createdBy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(imp.status)}`}
                                >
                                    {ImportStatusLabel[imp.status]}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onView(imp)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(imp)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    {isAdmin && <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(imp)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>} 
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
