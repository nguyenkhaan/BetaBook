import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import { Invoice } from '../InvoicePage';

interface DeleteInvoiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedInvoice: Invoice | null;
    onDelete: () => void;
}

export function DeleteInvoiceDialog({
    isOpen,
    onOpenChange,
    selectedInvoice,
    onDelete,
}: DeleteInvoiceDialogProps) {
    if (!selectedInvoice) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Xóa hóa đơn</DialogTitle>
                    <DialogDescription>Bạn có chắc chắn muốn xóa hóa đơn này?</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Số hóa đơn</Label>
                        <Input
                            value={selectedInvoice.invoiceNumber}
                            readOnly
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Khách hàng</Label>
                        <Input
                            value={selectedInvoice.customer}
                            readOnly
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Ngày</Label>
                        <Input
                            value={selectedInvoice.date}
                            readOnly
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Số mặt hàng</Label>
                        <Input
                            value={selectedInvoice.items.toString()}
                            readOnly
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Tổng tiền</Label>
                        <Input
                            value={`${selectedInvoice.totalAmount.toLocaleString('vi-VN')}đ`}
                            readOnly
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Trạng thái</Label>
                        <Input
                            value={selectedInvoice.status}
                            readOnly
                            className="col-span-3 bg-gray-50"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy bỏ
                    </Button>
                    <Button variant="destructive" onClick={onDelete}>
                        Xóa hóa đơn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
