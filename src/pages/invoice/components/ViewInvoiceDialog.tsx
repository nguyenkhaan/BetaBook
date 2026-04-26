import { Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../../../components/ui/dialog';
import { Invoice, DiscountCode } from '../InvoicePage';

interface ViewInvoiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedInvoice: Invoice | null;
}

export function ViewInvoiceDialog({
    isOpen,
    onOpenChange,
    selectedInvoice,
    // mockDiscountCodes,
}: ViewInvoiceDialogProps) {
    if (!selectedInvoice) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <div className="border-b pb-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <DialogTitle>
                                    <span className="text-center text-xl font-bold text-gray-900 mb-2 block">
                                        HÓA ĐƠN THANH TOÁN
                                    </span>
                                </DialogTitle>
                                <div className="text-center text-sm text-gray-600 mb-1">
                                    (Beta Book - Cửa hàng sách)
                                </div>
                                <div className="text-center text-sm text-gray-600">
                                    Số: {selectedInvoice.code}
                                </div>
                            </div>
                            <div
                                className={`px-4 py-2 rounded text-sm font-medium ml-4 ${
                                    selectedInvoice.status === 'COMPLETE'
                                        ? 'bg-red-500 text-white'
                                        : selectedInvoice.status ===
                                            'NOT_STARTED'
                                          ? 'bg-yellow-500 text-white'
                                          : 'bg-gray-500 text-white'
                                }`}
                            >
                                {selectedInvoice.status.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">
                                Ngày:
                            </span>{' '}
                            <span className="text-gray-900">
                                {selectedInvoice.updatedAt}{' '}
                                {new Date().toTimeString().slice(0, 8)}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Thủ ngân:
                            </span>{' '}
                            <span className="text-gray-900">A Nguyen Van</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                KH:
                            </span>{' '}
                            <span className="text-gray-900">
                                {selectedInvoice.customer}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Địa chỉ:
                            </span>{' '}
                            <span className="text-gray-900">
                                Hà Nội, Việt Nam
                            </span>
                        </div>
                        {selectedInvoice.voucherUsage && (
                            <div className="col-span-2">
                                <span className="font-medium text-gray-700">
                                    Mã giảm giá:
                                </span>{' '}
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                    {selectedInvoice.id}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                                        TÊN HÀNG HÓA
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase w-16">
                                        SL
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase w-32">
                                        ĐƠN GIÁ
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase w-32">
                                        THÀNH TIỀN
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedInvoice.billDetail.map((book, idx) => (
                                    <tr key={idx} className="bg-white">
                                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                            {book.title}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                                            {book.quantity}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right text-sm text-gray-900">
                                            {book.cost.toLocaleString('vi-VN')}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right text-sm text-gray-900">
                                            {(
                                                book.quantity * book.cost
                                            ).toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-white">
                                    <td
                                        className="border border-gray-300 px-4 py-3"
                                        colSpan={4}
                                    >
                                        &nbsp;
                                    </td>
                                </tr>
                                <tr className="bg-white">
                                    <td
                                        className="border border-gray-300 px-4 py-3"
                                        colSpan={4}
                                    >
                                        &nbsp;
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <div className="w-80 space-y-2 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium text-gray-700">
                                    Thành tiền
                                </span>
                                <span className="text-gray-900 font-medium">
                                    {selectedInvoice.billDetail
                                        .reduce(
                                            (total, book) =>
                                                total +
                                                book.quantity * book.cost,
                                            0,
                                        )
                                        .toLocaleString('vi-VN')}
                                </span>
                            </div>
                            {selectedInvoice.voucherUsage && (
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium text-orange-600">
                                            Mã giảm giá
                                        </span>
                                        <span className="font-medium text-orange-600">
                                            -
                                            {selectedInvoice.cost.toLocaleString(
                                                'vi-VN',
                                            )}
                                        </span>
                                    </div>
                                )}
                            <div className="flex justify-between pt-2">
                                <span className="font-bold text-gray-900 text-base">
                                    Tổng thanh toán
                                </span>
                                <span className="text-gray-900 font-bold text-base">
                                    {selectedInvoice.cost.toLocaleString(
                                        'vi-VN',
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất hóa đơn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
