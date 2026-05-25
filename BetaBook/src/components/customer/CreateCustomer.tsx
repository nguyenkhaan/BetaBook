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
import toast from 'react-hot-toast';

function CreateCustomer({
    isDialogOpen,
    setDialogOpen,
}: {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    // Customer handler
    // Customer form data
    const [customerFormData, setCustomerFormData] = useState({
        customerCode: '',
        name: '',
        email: '',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
    });
    const handleAddCustomer = () => {
        if (customerFormData.name && customerFormData.phone) {
            toast.success('Khách hàng mới đã được thêm thành công!');
            setDialogOpen(false);
            setCustomerFormData({
                customerCode: '',
                name: '',
                email: '',
                phone: '',
                joinDate: new Date().toISOString().split('T')[0],
                totalOrders: 0,
                totalSpent: 0,
            });
        } else {
            toast.error('Vui lòng nhập tên và số điện thoại!');
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Thêm khách hàng mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin khách hàng mới. Hạng sẽ được tự động tính
                        dựa trên tổng chi tiêu.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    {/* Mã khách hàng */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="customerCode"
                            className="text-sm font-medium"
                        >
                            Mã khách hàng
                        </Label>
                        <Input
                            id="customerCode"
                            value={customerFormData.customerCode || 'KH001'}
                            onChange={(e) =>
                                setCustomerFormData({
                                    ...customerFormData,
                                    customerCode: e.target.value,
                                })
                            }
                            className="bg-gray-50"
                            placeholder="Tự động tạo"
                            readOnly
                        />
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin cơ bản
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Tên khách hàng
                            </Label>
                            <Input
                                id="name"
                                value={customerFormData.name}
                                onChange={(e) =>
                                    setCustomerFormData({
                                        ...customerFormData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên khách hàng"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={customerFormData.email}
                                onChange={(e) =>
                                    setCustomerFormData({
                                        ...customerFormData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="text-sm font-medium"
                            >
                                Số điện thoại
                            </Label>
                            <Input
                                id="phone"
                                value={customerFormData.phone}
                                onChange={(e) =>
                                    setCustomerFormData({
                                        ...customerFormData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="0901234567"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="joinDate"
                                className="text-sm font-medium"
                            >
                                Ngày tham gia
                            </Label>
                            <Input
                                id="joinDate"
                                type="date"
                                value={customerFormData.joinDate}
                                onChange={(e) =>
                                    setCustomerFormData({
                                        ...customerFormData,
                                        joinDate: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Thông tin giao dịch */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin giao dịch
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="totalOrders"
                                className="text-sm font-medium"
                            >
                                Số đơn hàng
                            </Label>
                            <Input
                                id="totalOrders"
                                type="number"
                                value={customerFormData.totalOrders}
                                onChange={(e) =>
                                    setCustomerFormData({
                                        ...customerFormData,
                                        totalOrders:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="totalSpent"
                                className="text-sm font-medium"
                            >
                                Tổng chi tiêu (VNĐ)
                            </Label>
                            <Input
                                id="totalSpent"
                                type="number"
                                value={customerFormData.totalSpent}
                                onChange={(e) =>
                                    setCustomerFormData({
                                        ...customerFormData,
                                        totalSpent:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                            />
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
                    <Button type="button" onClick={handleAddCustomer}>
                        Thêm khách hàng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreateCustomer;
