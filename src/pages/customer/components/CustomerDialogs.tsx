import React from 'react';
import { Customer } from '../CustomersPage';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import { MemberGradeLabel } from '../../../utilis/label_mapper';

interface CustomerFormData {
    name: string;

    email: string;
    phone: string;
    grade: Customer['grade'];
}

interface CustomerDialogsProps {
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (isOpen: boolean) => void;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: (isOpen: boolean) => void;
    isViewDialogOpen: boolean;
    setIsViewDialogOpen: (isOpen: boolean) => void;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    selectedCustomer: Customer | null;
    formData: CustomerFormData;
    setFormData: (data: CustomerFormData) => void;
    handleCreateCustomer: () => void;
    handleEditCustomer: () => void;
    handleDeleteCustomer: () => void;
    calculateLevel: (totalSpent: number) => Customer['grade'];
}

export function CustomerDialogs({
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCustomer,
    formData,
    setFormData,
    handleCreateCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
    calculateLevel,
}: CustomerDialogsProps) {
    return (
        <>
            <Dialog
                open={isCreateDialogOpen || isEditDialogOpen}
                onOpenChange={(val) => {
                    if (!val) {
                        setIsCreateDialogOpen(false);
                        setIsEditDialogOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditDialogOpen
                                ? 'Cập nhật khách hàng'
                                : 'Thêm khách hàng mới'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Tên khách hàng</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Số điện thoại</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                placeholder="090..."
                            />
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Hạng thành viên</Label>
                                <Select
                                    value={formData.grade}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            grade: value as Customer['grade'],
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full bg-orange-50 font-bold text-orange-700 border-orange-200">
                                        {!formData.grade ? 'Chọn hạng' : MemberGradeLabel[formData.grade]}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BRONZE">
                                            Đồng 
                                        </SelectItem>
                                        <SelectItem value="SILVER">
                                            Bạc 
                                        </SelectItem>
                                        <SelectItem value="GOLD">
                                            Vàng 
                                        </SelectItem>
                                        <SelectItem value="DIAMOND">
                                            Kim cương 
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen(false);
                                setIsEditDialogOpen(false);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={
                                isEditDialogOpen
                                    ? handleEditCustomer
                                    : handleCreateCustomer
                            }
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            {isEditDialogOpen ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
            >
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết khách hàng</DialogTitle>
                        <DialogDescription>
                            Thông tin chi tiết của khách hàng trong hệ thống
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Mã khách hàng</Label>
                                <Input value={selectedCustomer?.code ?? ''} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Hạng thành viên</Label>
                                <Input
                                    value={
                                        selectedCustomer
                                            ? MemberGradeLabel[selectedCustomer.grade]
                                            : ''
                                    }
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tên khách hàng</Label>
                            <Input value={selectedCustomer?.name ?? ''} readOnly />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={selectedCustomer?.email ?? ''} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label>Số điện thoại</Label>
                                <Input value={selectedCustomer?.phone ?? ''} readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày tham gia</Label>
                                <Input
                                    value={selectedCustomer?.joinDate ?? ''}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tổng chi tiêu</Label>
                                <Input
                                    value={selectedCustomer?.totalSpent?.toLocaleString('vi-VN') ?? '0'}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tổng đơn hàng</Label>
                                <Input
                                    value={String(selectedCustomer?.totalOrders ?? 0)}
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Hạng theo chi tiêu</Label>
                                <Input
                                    value={
                                        selectedCustomer
                                            ? MemberGradeLabel[
                                                  calculateLevel(
                                                      selectedCustomer.totalSpent,
                                                  )
                                              ]
                                            : ''
                                    }
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsViewDialogOpen(false)}
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa khách hàng{' '}
                            <b>{selectedCustomer?.name}</b>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteCustomer}
                        >
                            Xác nhận xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
