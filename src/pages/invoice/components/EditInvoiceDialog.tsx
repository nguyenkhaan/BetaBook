import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Voucher } from '../../../services/voucher.service';

interface EditInvoiceFormData {
    customer: string;
    customerPhone: string;
    date: string;
    status: Invoice['status'];
    selectedVoucherId: string;
    books: Array<{
        id : number | string; 
        code : string; 
        bookid: number;
        title: string;
        quantity: number;
        price: number;
    }>;
}

interface EditInvoiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedInvoice: Invoice | null;
    formData: EditInvoiceFormData;
    setFormData: React.Dispatch<React.SetStateAction<EditInvoiceFormData>>;
    onSave: () => void;
    vouchers: Voucher[];
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
    customers,
    books,
    editNewBook,
    setEditNewBook,
    onAddBook,
    onRemoveBook,
    onSave,
    vouchers,
    calculateEditSubtotal,
    calculateEditDiscountAmount,
    calculateEditFinalTotal,
}: EditInvoiceDialogProps) {
    if (!selectedInvoice) return null;

    const totalItems = selectedInvoice.books.reduce(
        (sum, book) => sum + book.quantity,
        0,
    );

    const handleChange = (field: keyof EditInvoiceFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleBookChange = (
        index: number,
        field: 'quantity' | 'price',
        value: string,
    ) => {
        const newBooks = [...(formData.books || selectedInvoice.books)];
        if (field === 'quantity') {
            newBooks[index].quantity = parseInt(value) || 0;
        } else if (field === 'price') {
            newBooks[index].price = parseInt(value) || 0;
        }
        setFormData((prev) => ({ ...prev, books: newBooks }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật hóa đơn</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin hóa đơn {selectedInvoice.code}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-date">Ngày lập</Label>
                            <Input
                                id="edit-date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    handleChange('date', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-customer">
                                Tên khách hàng
                            </Label>
                            <Input
                                id="edit-customer"
                                value={formData.customer}
                                onChange={(e) =>
                                    handleChange('customer', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-phone">Số điện thoại</Label>
                            <Input
                                id="edit-phone"
                                value={formData.customerPhone}
                                onChange={(e) =>
                                    handleChange(
                                        'customerPhone',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Chi tiết hóa đơn</Label>
                        <div className="rounded-lg border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            Tên sách
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            SL
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Đơn giá
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Thành tiền
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(formData.books || selectedInvoice.books).map(
                                        (book, index) => (
                                            <tr
                                                key={`${book.bookid}-${index}`}
                                                className="border-t"
                                            >
                                                <td className="px-4 py-3">
                                                    {book.title}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={book.quantity}
                                                        onChange={(e) =>
                                                            handleBookChange(
                                                                index,
                                                                'quantity',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-16 text-center"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={book.price}
                                                        onChange={(e) =>
                                                            handleBookChange(
                                                                index,
                                                                'price',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-24 text-right"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">
                                                    {(
                                                        book.price *
                                                        book.quantity
                                                    ).toLocaleString('vi-VN')}
                                                    đ
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Số lượng sách</Label>
                            <Input
                                value={totalItems}
                                readOnly
                                className="bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tạm tính</Label>
                            <Input
                                value={`${calculateEditSubtotal().toLocaleString('vi-VN')}đ`}
                                readOnly
                                className="bg-muted"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Mã giảm giá</Label>
                        <Select
                            value={formData.selectedVoucherId}
                            onValueChange={(value) =>
                                handleChange('selectedVoucherId', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn mã giảm giá" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Không áp dụng</SelectItem>
                                {vouchers.map((voucher) => (
                                    <SelectItem
                                        key={voucher.id}
                                        value={voucher.id.toString()}
                                    >
                                        {voucher.code} - {voucher.name} (Giảm{' '}
                                        {voucher.sale}
                                        {voucher.type === 'PERCENT' ? '%' : 'đ'}
                                        )
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.selectedVoucherId !== '0' && (
                        <div className="space-y-2">
                            <Label>Giảm giá</Label>
                            <Input
                                value={`-${calculateEditDiscountAmount().toLocaleString('vi-VN')}đ`}
                                readOnly
                                className="bg-orange-50 text-orange-600 font-medium"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Trạng thái</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    handleChange('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Đã thanh toán">
                                        Đã thanh toán
                                    </SelectItem>
                                    <SelectItem value="Chưa thanh toán">
                                        Chưa thanh toán
                                    </SelectItem>
                                    <SelectItem value="Quá hạn">
                                        Quá hạn
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tổng thanh toán</Label>
                            <Input
                                value={`${calculateEditFinalTotal().toLocaleString('vi-VN')}đ`}
                                readOnly
                                className="bg-green-50 text-green-700 font-semibold text-lg"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button onClick={onSave}>Cập nhật hóa đơn</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
