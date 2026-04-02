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
import { InvoiceBook, DiscountCode, Invoice } from '../InvoicePage';

interface CreateInvoiceDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    formData: {
        invoiceNumber: string;
        customer: string;
        date: string;
        books: InvoiceBook[];
        status: Invoice['status'];
        discountCode: string;
        discountAmount: number;
        phoneNumber: string;
    };
    setFormData: (data: any) => void;
    newBook: {
        title: string;
        quantity: number;
        price: number;
    };

    setNewBook: (data: any) => void;
    onAddBook: () => void;
    onRemoveBook: (index: number) => void;
    onSave: () => void;
    mockDiscountCodes: DiscountCode[];
    calculateTotalItems: () => number;
    calculateTotalAmount: () => number;
    calculateDiscountAmount: () => number;
    calculateFinalTotal: () => number;
    handleDiscountCodeChange: (code: string) => void;
    customers: any[];
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
    mockDiscountCodes,
    calculateTotalItems,
    calculateTotalAmount,
    calculateDiscountAmount,
    calculateFinalTotal,
    handleDiscountCodeChange,
    customers,
}: CreateInvoiceDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo hóa đơn mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin hóa đơn mới
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-3">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phoneNumber" className="text-sm">
                            Số điện thoại
                        </Label>
                        <div className="col-span-3 space-y-1">
                            <Input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                    const phone = e.target.value;
                                    const found = customers?.find(
                                        (c: any) => c.phone === phone,
                                    );
                                    setFormData({
                                        ...formData,
                                        phoneNumber: phone,
                                        customer: found ? found.name : '',
                                    });
                                }}
                                className="w-full"
                                placeholder="Nhập số điện thoại khách hàng"
                            />
                            {formData.phoneNumber && (
                                <p
                                    className={`text-xs font-medium ${
                                        formData.customer
                                            ? 'text-green-600'
                                            : 'text-red-500'
                                    }`}
                                >
                                    {formData.customer
                                        ? `✔ Khách hàng: ${formData.customer}`
                                        : '✖ Không tìm thấy khách hàng'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer" className="text-sm">
                            Khách hàng
                        </Label>
                        <Input
                            id="customer"
                            value={formData.customer}
                            readOnly
                            className="col-span-3 bg-gray-50"
                            placeholder="Tên khách hàng sẽ tự động hiển thị"
                        />
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

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="mt-2 text-sm">Danh sách sách</Label>
                        <div className="col-span-3 border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-32 overflow-y-auto">
                            {formData.books.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-2">
                                    Chưa có sách nào
                                </p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                                                Tên sách
                                            </th>
                                            <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                                                Số lượng
                                            </th>
                                            <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                                                Giá
                                            </th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.books.map((book, idx) => (
                                            <tr key={idx}>
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
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            onRemoveBook(idx)
                                                        }
                                                    >
                                                        <Trash2 className="w-3 h-3" />
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
                                placeholder="Tên sách"
                                value={newBook.title}
                                onChange={(e) =>
                                    setNewBook({
                                        ...newBook,
                                        title: e.target.value,
                                    })
                                }
                                className="col-span-5"
                            />
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
                                type="number"
                                value={newBook.price}
                                onChange={(e) =>
                                    setNewBook({
                                        ...newBook,
                                        price: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="col-span-3"
                            />
                            <Button
                                onClick={onAddBook}
                                className="col-span-2 bg-orange-500"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 border-t pt-3">
                        <Label>Số mặt hàng</Label>
                        <Input
                            value={calculateTotalItems()}
                            readOnly
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <Label>Tạm tính</Label>
                        <Input
                            value={calculateTotalAmount().toLocaleString(
                                'vi-VN',
                            )}
                            readOnly
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-sm">Mã giảm giá</Label>

                        <div className="col-span-3">
                            <Select
                                value={formData.discountCode}
                                onValueChange={handleDiscountCodeChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn mã giảm giá" />
                                </SelectTrigger>

                                <SelectContent className="p-4 ml-3 mr-3">
                                    <SelectItem value="">
                                        Không áp dụng
                                    </SelectItem>
                                    {mockDiscountCodes.map((d) => (
                                        <SelectItem key={d.id} value={d.code}>
                                            {d.code} - {d.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Tổng tiền</Label>
                        <Input
                            value={
                                calculateFinalTotal()
                                    ? calculateFinalTotal().toLocaleString(
                                          'vi-VN',
                                      ) + ' VND'
                                    : '0 VND'
                            }
                            readOnly
                            className="col-span-3 bg-gray-100 cursor-not-allowed"
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
                                <SelectTrigger className="w-full">
                                    <SelectValue />
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
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button onClick={onSave} className="bg-orange-500">
                        Tạo hóa đơn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
