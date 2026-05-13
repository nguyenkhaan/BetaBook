import { FileText } from 'lucide-react';
import { Invoice } from '../InvoicePage';

interface InvoiceStatsProps {
    invoices: Invoice[];
}

export function InvoiceStats({ invoices }: InvoiceStatsProps) {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((i) => i.status === 'COMPLETE').length;
    const unpaidInvoices = invoices.filter((i) => i.status === 'NOT_STARTED').length;
    const overdueInvoices = invoices.filter((i) => i.status === 'OVERDUE').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Tổng hóa đơn</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {totalInvoices}
                        </p>
                    </div>
                    <FileText className="w-10 h-10 text-orange-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Đã thanh toán</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {paidInvoices}
                        </p>
                    </div>
                    <FileText className="w-10 h-10 text-green-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Chưa thanh toán</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                            {unpaidInvoices}
                        </p>
                    </div>
                    <FileText className="w-10 h-10 text-yellow-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Quá hạn</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                            {overdueInvoices}
                        </p>
                    </div>
                    <FileText className="w-10 h-10 text-red-500" />
                </div>
            </div>
        </div>
    );
}
