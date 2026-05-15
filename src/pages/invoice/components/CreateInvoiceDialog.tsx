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
import { InvoiceBook, Invoice } from '../InvoicePage';
import { Voucher } from '../../../services/voucher.service';

interface CreateInvoiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    formData: {
        invoiceNumber: string;
        customer: string;
        date: string;
        books: InvoiceBook[];
        status: Invoice['status'];
        phoneNumber: string;
        customerId?: string;
        selectedVoucherId: string;
    };
    setFormData: (data: any) => void;
    newBook: {
        id: string;
        code: string;
        title: string;
        quantity: number;
        price: number;
    };
    setNewBook: (data: any) => void;
    onAddBook: () => void;
    onRemoveBook: (index: number) => void;
    onSave: () => void;
    vouchers: Voucher[];
    calculateTotalItems: () => number;
    calculateTotalAmount: () => number;
    calculateDiscountAmount: () => number; // Thêm function này
    calculateFinalTotal: () => number;
    customers: any[];
    availableBooks: any[];
}

export function CreateInvoiceDialog({
    isOpen,
    onOpenChange,
    formData,
    setFormData,
    newBook,
    setNewBook,
    onAddBook,
    onRemoveBook,
    onSave,
    vouchers,
    calculateTotalItems,
    calculateTotalAmount,
    calculateDiscountAmount, // Thêm function này
    calculateFinalTotal,
    customers,
    availableBooks,
}: CreateInvoiceDialogProps) {
    const handleCustomerFound = (
        id: number | string,
        phone: string,
        name: string,
    ) => {
        console.log(id, phone, name);
        const found = customers?.find(
            (c: any) =>
                c.id == id &&
                c.phone.toLowerCase().includes(phone.toLowerCase()) &&
                c.name?.toLowerCase().includes(name.toLowerCase()),
        );
        setFormData({
            ...formData,
            phoneNumber: found ? found.phone : phone,
            customer: found ? found.name : name,
            customerId: found ? found.id.toString() : id,
        });
        return found;
    };
    const handleBookSearch = (value: string) => {
        const normalized = value.trim().toLowerCase();
        const found = availableBooks?.find(
            (b: any) =>
                b.code?.toLowerCase() === normalized ||
                b.id?.toString() === value,
        );

        setNewBook({
            id: found ? found.id.toString() : '',
            code: found ? found.code : '',
            title: found ? found.title : '',
            quantity: newBook.quantity || 1,
            price: found ? Number(found.price) : 0,
        });
    };
    const selectCustomer = customers?.find((c) => c.id == formData.customerId);
    console.log(formData);
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo hóa đơn mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin hóa đơn mới (Nhập mã để tìm kiếm nhanh)
                    </DialogDescription>
                    1
                </DialogHeader>

                <div className="grid gap-3 py-3">
                    {/* KHÁCH HÀNG */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-sm">Tìm khách hàng</Label>
                        <div className="col-span-3 relative">
                            <Select
                                value={formData.customerId || ''}
                                onValueChange={(value) => {
                                    handleCustomerFound(value, '', '');
                                }}
                            >
                                <SelectTrigger className="w-full cursor-pointer">
                                    <span>
                                        {selectCustomer
                                            ? `${selectCustomer.name} - ${selectCustomer.phone}`
                                            : 'Chưa tìm thấy khách hàng'}
                                    </span>
                                </SelectTrigger>
                                <SelectContent className="rounded-lg cursor-pointer">
                                    {customers?.map((customer) => (
                                        <SelectItem
                                            key={customer.id}
                                            value={customer.id.toString()}
                                            className="py-2 rounded-lg text-base xl:text-lg"
                                        >
                                            <div className="w-full flex items-center justify-between">
                                                <span>{customer.name}</span>
                                                <span>{customer.phone}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-sm">Thông tin KH</Label>
                        <div className="col-span-3 grid grid-cols-2 gap-2">
                            <Input
                                value={formData.customer}
                                placeholder="Tên khách hàng"
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setFormData({
                                        ...formData,
                                        customer: name,
                                        phoneNumber: '',
                                        customerId: '',
                                    });
                                }}
                            />
                            <Input
                                value={formData.phoneNumber}
                                placeholder="Số điện thoại"
                                onChange={(e) => {
                                    const phone = e.target.value;

                                    const found = customers?.find(
                                        (c: any) =>
                                            c.phone?.toLowerCase() ===
                                            phone.toLowerCase(),
                                    );

                                    setFormData({
                                        ...formData,
                                        phoneNumber: phone,

                                        customer: found ? found.name : '',

                                        customerId: found
                                            ? found.id.toString()
                                            : '',
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-sm">
                            Ngày
                        </Label>
                        <Input
                            id="date"
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

                    {/* GIỎ HÀNG */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="mt-2 text-sm">Giỏ hàng</Label>
                        <div className="col-span-3 border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-32 overflow-y-auto">
                            {formData.books.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-2">
                                    Chưa có sản phẩm
                                </p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-xs text-gray-500 font-medium">
                                            <th className="text-left py-1 px-2">
                                                Tên sách
                                            </th>
                                            <th className="text-left py-1 px-2">
                                                SL
                                            </th>
                                            <th className="text-left py-1 px-2">
                                                Giá
                                            </th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.books.map((book, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-gray-100 last:border-0"
                                            >
                                                <td className="py-1 px-2">
                                                    {book.title}
                                                </td>
                                                <td className="py-1 px-2">
                                                    {book.quantity}
                                                </td>
                                                <td className="py-1 px-2">
                                                    {book.price.toLocaleString(
                                                        'vi-VN',
                                                    )}
                                                    đ
                                                </td>
                                                <td className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            onRemoveBook(idx)
                                                        }
                                                    >
                                                        <Trash2 className="w-3 h-3 text-red-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* THÊM SÁCH */}
                    <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2 text-orange-600">
                            Thêm sách vào hóa đơn
                        </p>
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-5">
                                <Select value={newBook.id || ''} onValueChange={(value) => handleBookSearch(value)}>
                                    <SelectTrigger className='cursor-pointer w-full'>
                                        <span>
                                            {newBook.title || 'Chọn sách'}
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableBooks.map((book) => {
                                            return (
                                                <SelectItem
                                                    key={book.id}
                                                    value={book.id.toString()}
                                                    className="py-2 rounded-lg text-base xl:text-lg"
                                                >   
                                                    <div className="w-full flex items-center justify-between">
                                                        <span>{book.title}</span>
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Input
                                type="number"
                                value={newBook.quantity}
                                onChange={(e) =>
                                    setNewBook({
                                        ...newBook,
                                        quantity: parseInt(e.target.value) || 1,
                                    })
                                }
                                className="col-span-2"
                            />
                            <Input
                                value={
                                    newBook.title
                                        ? `${newBook.price.toLocaleString('vi-VN')}đ`
                                        : ''
                                }
                                readOnly
                                className="col-span-3 bg-gray-50 text-xs"
                            />
                            <Button
                                onClick={onAddBook}
                                className="col-span-2 bg-orange-500 hover:bg-orange-600"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* TỔNG KẾT */}
                    <div className="grid grid-cols-4 gap-4 border-t pt-3">
                        <Label>Tạm tính ({calculateTotalItems()} món)</Label>
                        <Input
                            value={
                                calculateTotalAmount().toLocaleString('vi-VN') +
                                ' đ'
                            }
                            readOnly
                            className="col-span-3 bg-gray-50"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-sm">Mã giảm giá</Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.selectedVoucherId}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        selectedVoucherId: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn mã giảm giá" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">
                                        Không áp dụng
                                    </SelectItem>
                                    {vouchers?.map((v) => (
                                        <SelectItem
                                            key={v.id}
                                            value={v.id.toString()}
                                        >
                                            {v.code} - {v.name} (Giảm {v.sale}
                                            {v.type === 'PERCENT' ? '%' : 'đ'})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {formData.selectedVoucherId !== '0' && (
                        <div className="grid grid-cols-4 gap-4">
                            <Label>Giảm giá</Label>
                            <Input
                                value={
                                    '- ' +
                                    calculateDiscountAmount().toLocaleString(
                                        'vi-VN',
                                    ) +
                                    ' đ'
                                }
                                readOnly
                                className="col-span-3 bg-orange-50 text-orange-600 font-medium"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="font-bold text-orange-600">
                            TỔNG TIỀN
                        </Label>
                        <Input
                            value={
                                calculateFinalTotal().toLocaleString('vi-VN') +
                                ' VND'
                            }
                            readOnly
                            className="col-span-3 bg-orange-50 font-bold text-lg text-orange-700"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Trạng thái</Label>
                        <div className="col-span-3">
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        status: value as Invoice['status'],
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Đã thanh toán">
                                        Đã thanh toán
                                    </SelectItem>
                                    <SelectItem value="Chưa thanh toán">
                                        Chưa thanh toán
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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
                    <Button
                        onClick={onSave}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        Xác nhận tạo hóa đơn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
