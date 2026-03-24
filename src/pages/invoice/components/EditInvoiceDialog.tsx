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
import { Invoice, DiscountCode } from '../InvoicePage';

interface EditInvoiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedInvoice: Invoice | null;
    formData: {
        customer: string;
        date: string;
        status: Invoice['status'];
        discountCode: string;
    };
    setFormData: (data: any) => void;
    onSave: () => void;
    mockDiscountCodes: DiscountCode[];
    calculateEditSubtotal: () => number;
    calculateEditDiscountAmount: () => number;
    calculateEditFinalTotal: () => number;
}

export function EditInvoiceDialog({
    isOpen,
    onOpenChange,
    selectedInvoice,
    formData,
    setFormData,
    onSave,
    mockDiscountCodes,
    calculateEditSubtotal,
    calculateEditDiscountAmount,
    calculateEditFinalTotal,
}: EditInvoiceDialogProps) {
    if (!selectedInvoice) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật hóa đơn</DialogTitle>
                    <DialogDescription>Chỉnh sửa thông tin hóa đơn</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Số hóa đơn</Label>
                        <Input
                            value={selectedInvoice.invoiceNumber}
                            readOnly
                            className="col-span-3 bg-gray-50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-customer">Khách hàng</Label>
                        <Input
                            id="edit-customer"
                            value={formData.customer}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    customer: e.target.value,
                                })
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-date">Ngày</Label>
                        <Input
                            id="edit-date"
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value,
                                })
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="mt-2">Danh sách sách</Label>
                        <div className="col-span-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                                            Tên sách
                                        </th>
                                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                                            Số lượng
                                        </th>
                                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                                            Giá
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.books.map((book, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                                            <td className="py-2 px-2">{book.title}</td>
                                            <td className="py-2 px-2">{book.quantity}</td>
                                            <td className="py-2 px-2">
                                                {book.price.toLocaleString('vi-VN')}đ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Số mặt hàng</Label>
                        <Input
                            value={selectedInvoice.items.toString()}
                            readOnly
                            className="col-span-3 bg-gray-50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Tạm tính</Label>
                        <Input
                            value={`${calculateEditSubtotal().toLocaleString('vi-VN')}đ`}
                            readOnly
                            className="col-span-3 bg-gray-50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-discountCode">Mã giảm giá</Label>
                        <Select
                            value={formData.discountCode}
                            onValueChange={(code) =>
                                setFormData({
                                    ...formData,
                                    discountCode: code,
                                })
                            }
                        >
                            <SelectTrigger className="col-span-3 w-full">
                                <SelectValue placeholder="Chọn mã giảm giá (tùy chọn)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Không áp dụng</SelectItem>
                                {mockDiscountCodes.map((discount) => (
                                    <SelectItem key={discount.id} value={discount.code}>
                                        {discount.code} - {discount.description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {formData.discountCode && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label>Giảm giá</Label>
                            <Input
                                value={`-${calculateEditDiscountAmount().toLocaleString('vi-VN')}đ`}
                                readOnly
                                className="col-span-3 bg-orange-50 text-orange-600 font-medium"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="font-semibold">Tổng tiền</Label>
                        <Input
                            value={`${calculateEditFinalTotal().toLocaleString('vi-VN')}đ`}
                            readOnly
                            className="col-span-3 bg-gray-50 font-semibold"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-status">Trạng thái</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    status: value as Invoice['status'],
                                })
                            }
                        >
                            <SelectTrigger className="col-span-3 w-full">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                                <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                                <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy bỏ
                    </Button>
                    <Button onClick={onSave}>Cập nhật hóa đơn</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
