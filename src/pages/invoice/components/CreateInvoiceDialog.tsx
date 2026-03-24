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
}: CreateInvoiceDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo hóa đơn mới</DialogTitle>
                    <DialogDescription>Nhập thông tin hóa đơn mới</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-3">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer" className="text-sm">
                            Khách hàng
                        </Label>
                        <Input
                            id="customer"
                            value={formData.customer}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    customer: e.target.value,
                                })
                            }
                            className="col-span-3"
                            placeholder="Nhập tên khách hàng"
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
                                                SL
                                            </th>
                                            <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                                                Giá
                                            </th>
                                            <th className="text-left py-1 px-2 text-xs font-medium text-gray-500"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.books.map((book, idx) => (
                                            <tr
                                                key={idx}
                                                className="border-b border-gray-100 last:border-0"
                                            >
                                                <td className="py-1 px-2">{book.title}</td>
                                                <td className="py-1 px-2">{book.quantity}</td>
                                                <td className="py-1 px-2">
                                                    {book.price.toLocaleString('vi-VN')}đ
                                                </td>
                                                <td className="py-1 px-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onRemoveBook(idx)}
                                                        className="h-6 px-2 text-xs"
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
                        <p className="text-sm font-medium text-gray-700 mb-2">Thêm sách</p>
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
                                className="col-span-5 text-sm"
                            />
                            <Input
                                type="number"
                                placeholder="SL"
                                min="1"
                                value={newBook.quantity}
                                onChange={(e) =>
                                    setNewBook({
                                        ...newBook,
                                        quantity: parseInt(e.target.value) || 1,
                                    })
                                }
                                className="col-span-2 text-sm"
                            />
                            <Input
                                type="number"
                                placeholder="Giá"
                                min="0"
                                value={newBook.price}
                                onChange={(e) =>
                                    setNewBook({
                                        ...newBook,
                                        price: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="col-span-3 text-sm"
                            />
                            <Button
                                onClick={onAddBook}
                                className="col-span-2 bg-orange-500 hover:bg-orange-600 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4 border-t pt-3">
                        <Label className="text-sm">Số mặt hàng</Label>
                        <Input
                            value={calculateTotalItems().toString()}
                            readOnly
                            className="col-span-3 bg-gray-50 text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-sm">Tạm tính</Label>
                        <Input
                            value={`${calculateTotalAmount().toLocaleString('vi-VN')}đ`}
                            readOnly
                            className="col-span-3 bg-gray-50 text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discountCode" className="text-sm">
                            Mã giảm giá
                        </Label>
                        <Select
                            value={formData.discountCode}
                            onValueChange={handleDiscountCodeChange}
                        >
                            <SelectTrigger className="col-span-3">
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
                            <Label className="text-sm">Giảm giá</Label>
                            <Input
                                value={`-${calculateDiscountAmount().toLocaleString('vi-VN')}đ`}
                                readOnly
                                className="col-span-3 bg-orange-50 text-orange-600 font-medium text-sm"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="font-semibold text-sm">Tổng tiền</Label>
                        <Input
                            value={`${calculateFinalTotal().toLocaleString('vi-VN')}đ`}
                            readOnly
                            className="col-span-3 bg-gray-50 font-semibold text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-sm">
                            Trạng thái
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    status: value as Invoice['status'],
                                })
                            }
                        >
                            <SelectTrigger className="col-span-3">
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
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            setFormData({
                                invoiceNumber: '',
                                customer: '',
                                date: new Date().toISOString().split('T')[0],
                                books: [],
                                status: 'Chưa thanh toán',
                                discountCode: '',
                                discountAmount: 0,
                            });
                            setNewBook({
                                title: '',
                                quantity: 1,
                                price: 0,
                            });
                        }}
                    >
                        Hủy
                    </Button>
                    <Button onClick={onSave} className="bg-orange-500 hover:bg-orange-600">
                        Tạo hóa đơn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
