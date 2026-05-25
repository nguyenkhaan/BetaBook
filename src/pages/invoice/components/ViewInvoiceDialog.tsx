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
import jsPDF from 'jspdf';
import { addingFontToDoc } from '../../../utilis/docfont';
import autoTable from 'jspdf-autotable';

interface ViewInvoiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedInvoice: Invoice | null;
    mockDiscountCodes: DiscountCode[];
}

export function ViewInvoiceDialog({
    isOpen,
    onOpenChange,
    selectedInvoice,
    mockDiscountCodes,
}: ViewInvoiceDialogProps) {
    const handleExportPDF = async () => {
        if (!selectedInvoice) return;

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });

        // Use a standard web-safe Unicode-compatible core font fallback declaration
        // to prevent metadata 'widths' crashing while keeping execution fast.
        doc.setFont('Helvetica', 'normal');

        let currentY = 20;
        const pageLeftMargin = 20;
        const pageRightMargin = 190;

        // --- HEADER ---
        doc.setFontSize(22);
        doc.text('PAYMENT BILL', 105, currentY, { align: 'center' });

        currentY += 8;
        doc.setFontSize(11);
        doc.text('(Utahime Bookstore)', 105, currentY, {
            align: 'center',
        });

        currentY += 6;
        doc.text(`So: ${selectedInvoice.code}`, 105, currentY, {
            align: 'center',
        });

        // --- STATUS STICKER ---
        currentY += 12;
        let statusText = selectedInvoice.status; 
        if (statusText == 'Chưa thanh toán') 
            statusText = 'Not Started' 
        else if (statusText == 'Hoàn thành') 
            statusText = 'Complete' 
        else statusText = 'Overdue'
        doc.setFontSize(10);
        if (statusText === 'Complete') {
            doc.setFillColor(239, 68, 68);
        } else if (statusText === 'Unpaid') {
            doc.setFillColor(245, 158, 11);
        } else {
            doc.setFillColor(107, 114, 128);
        }
        doc.rect(150, currentY - 5, 40, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(statusText, 170, currentY, { align: 'center' });


        currentY += 12;
        doc.setTextColor(55, 65, 81);

        const invoiceTime = `${selectedInvoice.date} ${new Date().toTimeString().slice(0, 8)}`;
        doc.text(`Ngay: ${invoiceTime}`, pageLeftMargin, currentY);
        doc.text(
            `KH: ${selectedInvoice.customer}`,
            pageLeftMargin,
            currentY + 7,
        );

        doc.text(`Employee: A Nguyen Van`, 110, currentY);

        currentY += 14;

        if (selectedInvoice.discountCode) {
            const disc = mockDiscountCodes.find(
                (d) => d.code === selectedInvoice.discountCode,
            );
            const descStr = disc ? ` (${disc.description})` : '';
            doc.text(
                `Voucher: ${selectedInvoice.discountCode}${descStr}`,
                pageLeftMargin,
                currentY,
            );
            currentY += 8;
        }

        // --- ITEMS TABLE (via jsPDF-AutoTable) ---
        currentY += 5;

        // Prepare table body rows
        const tableBody = selectedInvoice.books.map((book) => [
            book.title,
            book.quantity.toString(),
            book.price.toLocaleString('vi-VN'),
            (book.quantity * book.price).toLocaleString('vi-VN'),
        ]);

        autoTable(doc, {
            startY: currentY,
            margin: { left: pageLeftMargin, right: 20 },
            head: [['PRODUCT NAME', 'QUANTITY', 'COST', 'TOTAL']],
            body: tableBody,
            headStyles: {
                fillColor: [239, 246, 255],
                textColor: [55, 65, 81],
                fontSize: 9,
                fontStyle: 'bold',
                lineColor: [209, 213, 219],
                lineWidth: 0.1,
            },
            bodyStyles: {
                textColor: [17, 24, 39],
                fontSize: 9,
                lineColor: [209, 213, 219],
                lineWidth: 0.1,
            },
            columnStyles: {
                0: { cellWidth: 75, halign: 'left' },
                1: { cellWidth: 15, halign: 'center' },
                2: { cellWidth: 40, halign: 'right' },
                3: { cellWidth: 40, halign: 'right' },
            },
            theme: 'striped',
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        const summaryBoxX = 110;
        const baseSubtotal = selectedInvoice.books.reduce(
            (total, book) => total + book.quantity * book.price,
            0,
        );

        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text('Total Amount', summaryBoxX, finalY);
        doc.setTextColor(17, 24, 39);
        doc.text(
            baseSubtotal.toLocaleString('vi-VN'),
            pageRightMargin,
            finalY,
            { align: 'right' },
        );

        doc.setDrawColor(229, 231, 235);
        doc.line(summaryBoxX, finalY + 3, pageRightMargin, finalY + 3);

        doc.setFontSize(12);
        doc.text('Total Pay:', summaryBoxX, finalY + 10);
        doc.text(
            selectedInvoice.cost.toLocaleString('vi-VN'),
            pageRightMargin,
            finalY + 10,
            { align: 'right' },
        );

        // Save file down to local machine
        doc.save(`Hoa_Don_${selectedInvoice.code}.pdf`);
    };
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
                                        Chi tiết hóa đơn
                                    </span>
                                </DialogTitle>
                                <div className="text-center text-sm text-gray-600 mb-1">
                                    Utahime Book 
                                </div>
                                <div className="text-center text-sm text-gray-600">
                                    No: {selectedInvoice.code}
                                </div>
                            </div>
                            <div
                                className={`px-4 py-2 rounded text-sm font-medium ml-4 ${
                                    selectedInvoice.status === 'Đã thanh toán'
                                        ? 'bg-red-500 text-white'
                                        : selectedInvoice.status ===
                                            'Chưa thanh toán'
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
                                {selectedInvoice.date}{' '}
                                {new Date().toTimeString().slice(0, 8)}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">
                                Thu ngân: 
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
                        {selectedInvoice.discountCode && (
                            <div className="col-span-2">
                                <span className="font-medium text-gray-700">
                                    Mã KM: 
                                </span>{' '}
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                    {selectedInvoice.discountCode}
                                </span>
                                {mockDiscountCodes.find(
                                    (d) =>
                                        d.code === selectedInvoice.discountCode,
                                ) && (
                                    <span className="ml-2 text-gray-600">
                                        (
                                        {
                                            mockDiscountCodes.find(
                                                (d) =>
                                                    d.code ===
                                                    selectedInvoice.discountCode,
                                            )?.description
                                        }
                                        )
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-blue-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                                        TÊN SẢN PHẨM
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase w-16">
                                        SL
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase w-32">
                                        ĐƠN GIÁ
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase w-32">
                                        TỔNG TIỀN
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedInvoice.books.map((book, idx) => (
                                    <tr key={idx} className="bg-white">
                                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                                            {book.title}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                                            {book.quantity}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right text-sm text-gray-900">
                                            {book.price.toLocaleString('vi-VN')}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3 text-right text-sm text-gray-900">
                                            {(
                                                book.quantity * book.price
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
                                    {selectedInvoice.books
                                        .reduce(
                                            (total, book) =>
                                                total +
                                                book.quantity * book.price,
                                            0,
                                        )
                                        .toLocaleString('vi-VN')}
                                </span>
                            </div>
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
                    <Button
                        onClick={handleExportPDF}
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Xuất hóa đơn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
