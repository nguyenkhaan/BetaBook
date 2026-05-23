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

function CreateEmployee({
    isDialogOpen,
    setDialogOpen,
}: {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    // Employee form data
    const [employeeFormData, setEmployeeFormData] = useState({
        employeeCode: '',
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        joinDate: new Date().toISOString().split('T')[0],
        salary: 0,
        status: 'Đang làm việc' as const,
    });

    const handleAddEmployee = () => {
        if (
            employeeFormData.name &&
            employeeFormData.email &&
            employeeFormData.phone &&
            employeeFormData.position
        ) {
            toast.success('Nhân viên mới đã được thêm thành công!');
            setDialogOpen(false);
            setEmployeeFormData({
                employeeCode: '',
                name: '',
                email: '',
                phone: '',
                position: '',
                department: '',
                joinDate: new Date().toISOString().split('T')[0],
                salary: 0,
                status: 'Đang làm việc',
            });
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin cơ bản!');
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Thêm nhân viên mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin nhân viên mới vào hệ thống
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    {/* Mã nhân viên */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="employeeCode"
                            className="text-sm font-medium"
                        >
                            Mã nhân viên
                        </Label>
                        <Input
                            id="employeeCode"
                            value={employeeFormData.employeeCode || 'NV001'}
                            onChange={(e) =>
                                setEmployeeFormData({
                                    ...employeeFormData,
                                    employeeCode: e.target.value,
                                })
                            }
                            className="bg-gray-50"
                            placeholder="Tự động tạo"
                            readOnly
                        />
                    </div>

                    {/* Thông tin cá nhân */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin cá nhân
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Tên nhân viên
                            </Label>
                            <Input
                                id="name"
                                value={employeeFormData.name}
                                onChange={(e) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên nhân viên"
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
                                value={employeeFormData.email}
                                onChange={(e) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="example@company.com"
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
                                value={employeeFormData.phone}
                                onChange={(e) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="0901234567"
                            />
                        </div>
                    </div>

                    {/* Thông tin công việc */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin công việc
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="position"
                                className="text-sm font-medium"
                            >
                                Chức vụ
                            </Label>
                            <Input
                                id="position"
                                value={employeeFormData.position}
                                onChange={(e) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        position: e.target.value,
                                    })
                                }
                                placeholder="VD: Nhân viên bán hàng"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="department"
                                className="text-sm font-medium"
                            >
                                Phòng ban
                            </Label>
                            <Input
                                id="department"
                                value={employeeFormData.department}
                                onChange={(e) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        department: e.target.value,
                                    })
                                }
                                placeholder="VD: Bán hàng"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="joinDate"
                                className="text-sm font-medium"
                            >
                                Ngày vào làm
                            </Label>
                            <Input
                                id="joinDate"
                                type="date"
                                value={employeeFormData.joinDate}
                                onChange={(e) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        joinDate: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="salary"
                                className="text-sm font-medium"
                            >
                                Lương (VNĐ)
                            </Label>
                            <Input
                                id="salary"
                                type="number"
                                value={employeeFormData.salary}
                                onChange={(e) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        salary: parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="10000000"
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
                                value={employeeFormData.status}
                                onValueChange={(value) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        status: value as typeof employeeFormData.status,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Đang làm việc">
                                        Đang làm việc
                                    </SelectItem>
                                    <SelectItem value="Nghỉ phép">
                                        Nghỉ phép
                                    </SelectItem>
                                    <SelectItem value="Đã nghỉ việc">
                                        Đã nghỉ việc
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
                    <Button type="button" onClick={handleAddEmployee}>
                        Thêm nhân viên
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreateEmployee;
