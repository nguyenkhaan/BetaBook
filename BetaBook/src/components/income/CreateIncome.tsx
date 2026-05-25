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
import toast from 'react-hot-toast';

function CreateIncome({
    isDialogOpen,
    setDialogOpen,
}: {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    // Receipt form data
    const [incomeFormData, setIncomeFormData] = useState({
        receiptNumber: '',
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        amount: 0,
        paymentMethod: 'Tiền mặt' as const,
        collector: 'A Nguyen Van',
        status: 'Đã thu' as const,
    });
    // Receipt handler
    const handleCreateReceipt = () => {
        if (incomeFormData.customerName && incomeFormData.amount > 0) {
            toast.success('Phiếu thu mới đã được tạo thành công!');
            setDialogOpen(false);
            setIncomeFormData({
                receiptNumber: '',
                customerName: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().slice(0, 5),
                amount: 0,
                paymentMethod: 'Tiền mặt',
                collector: 'A Nguyen Van',
                status: 'Đã thu',
            });
        } else {
            toast.error('Vui lòng nhập tên khách hàng và số tiền!');
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo phiếu thu mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin phiếu thu mới
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    {/* Số phiếu thu */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="receiptNumber"
                            className="text-sm font-medium"
                        >
                            Số phiếu thu
                        </Label>

                        <Input
                            id="receiptNumber"
                            value={incomeFormData.receiptNumber || 'PT001'}
                            onChange={(e) =>
                                setIncomeFormData({
                                    ...incomeFormData,
                                    receiptNumber: e.target.value,
                                })
                            }
                            className="bg-gray-50"
                            placeholder="Tự động tạo"
                            readOnly
                        />

                        <Label
                            htmlFor="receiptNumber"
                            className="text-sm font-medium"
                        >
                            Mã hóa đơn
                        </Label>
                        <Input
                            id="receiptNumber"
                            value={incomeFormData.receiptNumber || 'HD001'}
                            onChange={(e) =>
                                setIncomeFormData({
                                    ...incomeFormData,
                                    receiptNumber: e.target.value,
                                })
                            }
                            className="bg-gray-50"
                            placeholder="Tự động tạo"
                            readOnly
                        />
                    </div>

                    {/* Thông tin khách hàng */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin khách hàng
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="customerName"
                                className="text-sm font-medium"
                            >
                                Mã khách hàng
                            </Label>
                            <Input
                                id="customerName"
                                value={incomeFormData.customerName}
                                onChange={(e) =>
                                    setIncomeFormData({
                                        ...incomeFormData,
                                        customerName: e.target.value,
                                    })
                                }
                                placeholder="Nhập mã khách hàng"
                            />
                        </div>
                    </div>

                    {/* Thông tin thanh toán */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin thanh toán
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="date"
                                    className="text-sm font-medium"
                                >
                                    Ngày thu
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={incomeFormData.date}
                                    onChange={(e) =>
                                        setIncomeFormData({
                                            ...incomeFormData,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="time"
                                    className="text-sm font-medium"
                                >
                                    Giờ thu
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={incomeFormData.time}
                                    onChange={(e) =>
                                        setIncomeFormData({
                                            ...incomeFormData,
                                            time: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="amount"
                                className="text-sm font-medium"
                            >
                                Số tiền (VNĐ)
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={incomeFormData.amount}
                                onChange={(e) =>
                                    setIncomeFormData({
                                        ...incomeFormData,
                                        amount: parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="paymentMethod"
                                className="text-sm font-medium"
                            >
                                Hình thức thanh toán
                            </Label>
                            <Select
                                value={incomeFormData.paymentMethod}
                                onValueChange={(value) =>
                                    setIncomeFormData({
                                        ...incomeFormData,
                                        paymentMethod:
                                            value as typeof incomeFormData.paymentMethod,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn hình thức" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tiền mặt">
                                        Tiền mặt
                                    </SelectItem>
                                    <SelectItem value="Chuyển khoản">
                                        Chuyển khoản
                                    </SelectItem>
                                    <SelectItem value="Thẻ">Thẻ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="collector"
                                className="text-sm font-medium"
                            >
                                Người thu
                            </Label>
                            <Input
                                id="collector"
                                value={incomeFormData.collector}
                                onChange={(e) =>
                                    setIncomeFormData({
                                        ...incomeFormData,
                                        collector: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên người thu"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="status"
                                className="text-sm font-medium"
                            >
                                Trạng thái
                            </Label>
                            <Select
                                value={incomeFormData.status}
                                onValueChange={(value) =>
                                    setIncomeFormData({
                                        ...incomeFormData,
                                        status: value as typeof incomeFormData.status,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Đã thu">
                                        Đã thu
                                    </SelectItem>
                                    <SelectItem value="Đang xử lý">
                                        Đang xử lý
                                    </SelectItem>
                                    <SelectItem value="Đã hủy">
                                        Đã hủy
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                    >
                        Hủy bỏ
                    </Button>
                    <Button type="button" onClick={handleCreateReceipt}>
                        Tạo phiếu thu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreateIncome;
