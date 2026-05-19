import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { BOOK_CATEGORIES_LABEL } from '../../../bases/constants/book.constants';
import { ImportBookItem } from '../ImportPage';

interface ImportOrder {
    importNumber: string;
    supplier: string;
    date: string;
    time: string;
    totalAmount: number;
    totalItems: number;
    status: 'COMPLETE' | 'PENDING' | 'CANCEL';
    createdBy: string;
    note?: string;
    details?: ImportBookItem[];
}

interface ImportViewDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedImport: ImportOrder | null;
    formatDateTime: (date: string, time: string) => string;
}

export const ImportViewDialog: React.FC<ImportViewDialogProps> = ({
    isOpen,
    onOpenChange,
    selectedImport,
    formatDateTime,
}) => {
    const details = selectedImport?.details || [];

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[820px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chi tiết phiếu nhập</DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết về phiếu nhập
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">
                            Số phiếu nhập
                        </Label>
                        <div className="text-lg font-semibold text-orange-600">
                            {selectedImport?.importNumber}
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Nhà cung cấp:</span>
                            <span className="text-sm font-medium">{selectedImport?.supplier}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Ngày nhập:</span>
                            <span className="text-sm font-medium">
                                {selectedImport && formatDateTime(selectedImport.date, selectedImport.time)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Số lượng:</span>
                            <span className="text-sm font-semibold text-orange-600">{selectedImport?.totalItems}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Tổng tiền:</span>
                            <span className="text-sm font-semibold text-orange-600">
                                {selectedImport?.totalAmount.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Người tạo:</span>
                            <span className="text-sm font-medium">{selectedImport?.createdBy}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Trạng thái:</span>
                            <span className="text-sm font-medium">{selectedImport?.status}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <p className="text-sm text-gray-500 mb-1">Ghi chú:</p>
                            <p className="text-sm italic">{selectedImport?.note || 'Không có ghi chú'}</p>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <Label className="text-sm font-medium text-gray-500">
                            Danh sách sách nhập
                        </Label>
                        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium">
                                            Mã sách
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium">
                                            Tên sách
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium">
                                            Thể loại
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            SL
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Giá nhập
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium">
                                            Thành tiền
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {details.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-3 py-6 text-center text-gray-500"
                                            >
                                                Không có dữ liệu sách trong phiếu nhập
                                            </td>
                                        </tr>
                                    ) : (
                                        details.map((item, index) => (
                                            <tr key={`${item.bookCode || item.newBookCode}-${index}`}>
                                                <td className="px-3 py-2 font-medium text-orange-600">
                                                    {item.bookCode || item.newBookCode}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item.bookName || '-'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item.category
                                                        ? BOOK_CATEGORIES_LABEL[
                                                              item.category as keyof typeof BOOK_CATEGORIES_LABEL
                                                          ] || item.category
                                                        : '-'}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    {Number(
                                                        item.importPrice || 0,
                                                    ).toLocaleString('vi-VN')}
                                                    đ
                                                </td>
                                                <td className="px-3 py-2 text-right font-medium">
                                                    {Number(
                                                        item.lineTotal ||
                                                            item.quantity *
                                                                item.importPrice,
                                                    ).toLocaleString('vi-VN')}
                                                    đ
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
