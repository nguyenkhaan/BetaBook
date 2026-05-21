import { Edit, Trash2, ShoppingCart , Eye } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Invoice } from '../InvoicePage';
import { useAuth } from '../../../contexts/AuthContext';

interface InvoiceTableRowProps {
    invoice: Invoice;
    onEdit: (invoice: Invoice) => void;
    onDelete: (invoice: Invoice) => void;
    onViewBooks: (invoice: Invoice) => void;
    getStatusColor: (status: Invoice['status']) => string;
}

export function InvoiceTableRow({
    invoice,
    onEdit,
    onDelete,
    onViewBooks,
    getStatusColor,
}: InvoiceTableRowProps) {
    const { isAdmin } = useAuth();

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {invoice.code}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {invoice.customer}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(invoice.updatedAt).toISOString().substring(0, 10)}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                <div className="max-w-xs">
                    {invoice.billDetail.map((book, idx) => (
                        <div key={idx} className="text-xs">
                            • {book.title} ({book.quantity})
                        </div>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {invoice.voucherUsage.length != 0 ? (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        {invoice.voucherUsage.map((usage) => {
                            return <span>{usage.code}</span>
                        })}
                    </span>
                ) : (
                    <span className="text-gray-400">-</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {invoice.billDetail.reduce((total , book) => total + book.quantity , 0)
                
                }
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {invoice.cost.toLocaleString('vi-VN')}đ
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        invoice.status,
                    )}`}
                >
                    {invoice.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewBooks(invoice)}
                        title="Xem danh sách sách"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    {isAdmin && <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(invoice)}
                        title="Chỉnh sửa"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>} 
                    {isAdmin && <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(invoice)}
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>} 
                </div>
            </td>
        </tr>
    );
}
