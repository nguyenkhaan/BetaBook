import { Plus, Trash2 } from 'lucide-react';
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
import { Invoice, InvoiceBook } from '../InvoicePage';
import { Voucher } from '../../../services/invoice.service';

interface InvoiceCustomer {
    id: number;
    name: string;
    phone: string;
}

interface EditInvoiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedInvoice: Invoice | null;
    formData: {
        customer: string;
        phone: string;
        date: string;
        status: Invoice['status'];
        voucherId: number | null;
        billDetail: InvoiceBook[];
    };
    setFormData: (data: any) => void;
    customers: InvoiceCustomer[];
    books: InvoiceBook[];
    editNewBook: {
        bookId: string;
        code: string;
        title: string;
        quantity: number;
        cost: number;
    };
    setEditNewBook: (data: any) => void;
    onAddBook: () => void;
    onRemoveBook: (index: number) => void;
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

    const applySelectedBook = (value: string, field: 'code' | 'title') => {
        const normalizedValue = value.trim().toLowerCase();
        const matchedBook = normalizedValue
            ? books.find((book) => {
                  const targetValue = (field === 'code' ? book.code : book.title)
                      .trim()
                      .toLowerCase();
                  return (
                      targetValue === normalizedValue ||
                      targetValue.startsWith(normalizedValue)
                  );
              })
            : null;

        if (!matchedBook) {
            setEditNewBook({
                bookId: '',
                code: field === 'code' ? value : editNewBook.code,
                title: field === 'title' ? value : editNewBook.title,
                quantity: editNewBook.quantity || 1,
                cost: 0,
                [field]: value,
            });
            return;
        }

        setEditNewBook({
            ...editNewBook,
            bookId: matchedBook.bookId,
            code: matchedBook.code,
            title: matchedBook.title,
            cost: matchedBook.cost,
            quantity: editNewBook.quantity || 1,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật hóa đơn</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin hóa đơn
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Số hóa đơn</Label>
                        <Input
                            value={selectedInvoice.code}
                            readOnly
                            className="col-span-3 bg-gray-50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-phone">Số điện thoại</Label>
                        <div className="col-span-3 space-y-1">
                            <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => {
                                    const phone = e.target.value;
                                    const foundCustomer = customers.find(
                                        (customer) => customer.phone === phone,
                                    );

                                    setFormData({
                                        ...formData,
                                        phone,
                                        customer: foundCustomer
                                            ? foundCustomer.name
                                            : '',
                                    });
                                }}
                                className="w-full"
                                placeholder="Nhập số điện thoại khách hàng"
                            />
                            {formData.phone && (
                                <p
                                    className={`text-xs font-medium ${
                                        formData.customer
                                            ? 'text-green-600'
                                            : 'text-red-500'
                                    }`}
                                >
                                    {formData.customer
                                        ? `Khách hàng: ${formData.customer}`
                                        : 'Không tìm thấy khách hàng'}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-customer">Khách hàng</Label>
                        <Input
                            id="edit-customer"
                            value={formData.customer}
                            readOnly
                            className="col-span-3 bg-gray-50"
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
                            {formData.billDetail.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-2">
                                    Chưa có sách nào
                                </p>
                            ) : (
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
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.billDetail.map((book, idx) => (
                                            <tr
                                                key={`${book.code}-${idx}`}
                                                className="border-b border-gray-100 last:border-0"
                                            >
                                                <td className="py-2 px-2">
                                                    <div className="font-medium">
                                                        {book.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {book.code}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={book.quantity}
                                                        onChange={(e) => {
                                                            const newBillDetail = [
                                                                ...formData.billDetail,
                                                            ];
                                                            newBillDetail[
                                                                idx
                                                            ].quantity =
                                                                parseInt(
                                                                    e.target.value,
                                                                    10,
                                                                ) || 1;
                                                            setFormData({
                                                                ...formData,
                                                                billDetail:
                                                                    newBillDetail,
                                                            });
                                                        }}
                                                        className="w-20"
                                                    />
                                                </td>
                                                <td className="py-2 px-2">
                                                    {book.cost.toLocaleString(
                                                        'vi-VN',
                                                    )}
                                                    đ
                                                </td>
                                                <td className="py-2 px-2 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            onRemoveBook(idx)
                                                        }
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                    <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2">Thêm sách</p>
                        <div className="grid grid-cols-12 gap-2">
                            <Input
                                list="edit-book-codes"
                                placeholder="Nhập mã sách"
                                value={editNewBook.code}
                                onChange={(e) =>
                                    applySelectedBook(e.target.value, 'code')
                                }
                                className="col-span-3"
                            />
                            <datalist id="edit-book-codes">
                                {books.map((book) => (
                                    <option key={book.bookId} value={book.code}>
                                        {book.title}
                                    </option>
                                ))}
                            </datalist>
                            <Input
                                list="edit-book-titles"
                                placeholder="Tên sách"
                                value={editNewBook.title}
                                onChange={(e) =>
                                    applySelectedBook(e.target.value, 'title')
                                }
                                className="col-span-3"
                            />
                            <datalist id="edit-book-titles">
                                {books.map((book) => (
                                    <option
                                        key={`${book.bookId}-title`}
                                        value={book.title}
                                    >
                                        {book.code}
                                    </option>
                                ))}
                            </datalist>
                            <Input
                                type="number"
                                min={1}
                                value={editNewBook.quantity}
                                onChange={(e) =>
                                    setEditNewBook({
                                        ...editNewBook,
                                        quantity: parseInt(e.target.value, 10) || 1,
                                    })
                                }
                                className="col-span-2"
                            />
                            <Input
                                type="number"
                                value={editNewBook.cost}
                                readOnly
                                className="col-span-2 bg-gray-100"
                            />
                            <Button
                                onClick={onAddBook}
                                className="col-span-2 bg-orange-500 hover:bg-orange-600"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="edit-discountCode">Mã giảm giá</Label>
                        <Select
                            value={formData.voucherId?.toString() || ''}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    voucherId: value ? Number(value) : null,
                                })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn mã giảm giá (tùy chọn)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Không áp dụng</SelectItem>
                                {vouchers.map((v) => (
                                    <SelectItem
                                        key={v.id}
                                        value={v.id.toString()}
                                    >
                                        {v.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Tạm tính</Label>
                        <Input
                            value={`${calculateEditSubtotal().toLocaleString('vi-VN')}đ`}
                            readOnly
                            className="col-span-3 bg-gray-50"
                        />
                    </div>
                    {formData.voucherId && (
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
                                <SelectItem value="COMPLETE">
                                    COMPLETE
                                </SelectItem>
                                <SelectItem value="NOT_STARTED">
                                    Chưa thanh toán
                                </SelectItem>
                                <SelectItem value="OVERDUE">Quá hạn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy bỏ
                    </Button>
                    <Button onClick={onSave}>Cập nhật hóa đơn</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
