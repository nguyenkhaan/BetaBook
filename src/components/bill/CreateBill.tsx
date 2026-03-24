import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    SelectContent,
    Select,
    SelectValue,
    SelectTrigger,
    SelectItem,
} from '../ui/select';
import { Plus } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

function CreateBill({
    isDialogOpen,
    setDialogOpen,
}: {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    //Form data
    // Invoice form data
    const [createFormData, setCreateFormData] = useState({
        invoiceNumber: '',
        customer: '',
        date: new Date().toISOString().split('T')[0],
        books: [] as Array<{ title: string; quantity: number; price: number }>,
        status: 'Chưa thanh toán' as const,
        discountCode: '',
        discountAmount: 0,
    });
    //Invoice Handler
    const [newBook, setNewBook] = useState({
        title: '',
        quantity: 1,
        price: 0,
    });
    const handleAddBook = () => {
        if (newBook.title && newBook.price > 0) {
            setCreateFormData({
                ...createFormData,
                books: [...createFormData.books, newBook],
            });
            setNewBook({ title: '', quantity: 1, price: 0 });
            toast.success('Đã thêm sách vào hóa đơn');
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin sách');
        }
    };

    const handleRemoveBook = (index: number) => {
        setCreateFormData({
            ...createFormData,
            books: createFormData.books.filter((_, i) => i !== index),
        });
        toast.success('Đã xóa sách khỏi hóa đơn');
    };

    const calculateTotalItems = () => {
        return createFormData.books.reduce(
            (sum, book) => sum + book.quantity,
            0,
        );
    };

    const calculateTotalAmount = () => {
        return createFormData.books.reduce(
            (sum, book) => sum + book.quantity * book.price,
            0,
        );
    };

    const calculateDiscountAmount = () => {
        // if (!createFormData.discountCode) return 0;
        // const discount = mockDiscountCodes.find(
        //     (d) => d.code === createFormData.discountCode,
        // );
        // if (!discount) return 0;

        // const total = calculateTotalAmount();
        // if (discount.type === 'percentage') {
        //     return Math.floor((total * discount.value) / 100);
        // } else {
        //     return discount.value;
        // }
        return 0;
    };

    const calculateFinalTotal = () => {
        return calculateTotalAmount() - calculateDiscountAmount();
    };

    const handleDiscountCodeChange = (value: string) => {
        setCreateFormData({
            ...createFormData,
            discountCode: value,
            discountAmount: value ? calculateDiscountAmount() : 0,
        });
    };

    const handleCreateInvoice = () => {
        if (createFormData.customer && createFormData.books.length > 0) {
            toast.success('Hóa đơn mới đã được tạo thành công!');
            setDialogOpen(false);
            setCreateFormData({
                invoiceNumber: '',
                customer: '',
                date: new Date().toISOString().split('T')[0],
                books: [],
                status: 'Chưa thanh toán',
                discountCode: '',
                discountAmount: 0,
            });
            setNewBook({ title: '', quantity: 1, price: 0 });
        } else {
            toast.error(
                'Vui lòng nhập đầy đủ thông tin và thêm ít nhất 1 sách!',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo hóa đơn mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin hóa đơn mới
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-3">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customer" className="text-sm">
                            Mã khách hàng
                        </Label>
                        <Input
                            id="customer"
                            value={createFormData.customer}
                            onChange={(e) =>
                                setCreateFormData({
                                    ...createFormData,
                                    customer: e.target.value,
                                })
                            }
                            className="col-span-3"
                            placeholder="Nhập mã khách hàng"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-sm">
                            Ngày
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            value={createFormData.date}
                            onChange={(e) =>
                                setCreateFormData({
                                    ...createFormData,
                                    date: e.target.value,
                                })
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="mt-2 text-sm">Danh sách sách</Label>
                        <div className="col-span-3 border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-32 overflow-y-auto">
                            {createFormData.books.length === 0 ? (
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
                                            <th className="text-left py-1 px-2 text-xs font-medium text-gray-500"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {createFormData.books.map(
                                            (book, idx) => (
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
                                                    <td className="py-1 px-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleRemoveBook(
                                                                    idx,
                                                                )
                                                            }
                                                            className="h-6 px-2 text-xs"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Add Book Section - Compact */}
                    <div className="border-t pt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Thêm sách
                        </p>
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
                                onClick={handleAddBook}
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
                            value={createFormData.discountCode}
                            onValueChange={handleDiscountCodeChange}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn mã giảm giá (tùy chọn)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Không áp dụng</SelectItem>
                                {/* {mockDiscountCodes.map((discount) => (
                                    <SelectItem
                                        key={discount.id}
                                        value={discount.code}
                                    >
                                        {discount.code} - {discount.description}
                                    </SelectItem>
                                ))} */}
                            </SelectContent>
                        </Select>
                    </div>
                    {createFormData.discountCode && (
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
                        <Label className="font-semibold text-sm">
                            Tổng tiền
                        </Label>
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
                            value={createFormData.status}
                            onValueChange={(value) =>
                                setCreateFormData({
                                    ...createFormData,
                                    status: value as typeof createFormData.status,
                                })
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Đã thanh toán">
                                    Đã thanh toán
                                </SelectItem>
                                <SelectItem value="Chưa thanh toán">
                                    Chưa thanh toán
                                </SelectItem>
                                <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setDialogOpen(false);
                            setCreateFormData({
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
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleCreateInvoice}
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        Tạo hóa đơn
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreateBill;
