import { Invoice } from '../InvoicePage';
import { InvoiceTableRow } from './InvoiceTableRow';

interface InvoiceTableProps {
    invoices: Invoice[];
    onEdit: (invoice: Invoice) => void;
    onDelete: (invoice: Invoice) => void;
    onViewBooks: (invoice: Invoice) => void;
    getStatusColor: (status: Invoice['status']) => string;
}

export function InvoiceTable({
    invoices,
    onEdit,
    onDelete,
    onViewBooks,
    getStatusColor,
}: InvoiceTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số hóa đơn
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Danh sách sách
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã giảm giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số mặt hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng tiền
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
                    {invoices.map((invoice) => (
                        <InvoiceTableRow
                            key={invoice.id}
                            invoice={invoice}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onViewBooks={onViewBooks}
                            getStatusColor={getStatusColor}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
