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

interface ImportOrder {
    importNumber: string;
    supplier: string;
    date: string;
    time: string;
    totalAmount: number;
    totalItems: number;
    status: 'Hoàn thành' | 'Đang xử lý' | 'Đã hủy';
    createdBy: string;
    note?: string;
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
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
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
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
