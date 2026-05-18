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
// Import Select components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';

interface CustomerDialogsProps {
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (isOpen: boolean) => void;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: (isOpen: boolean) => void;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    selectedCustomer: Customer | null;
    formData: any;
    setFormData: (data: any) => void;
    handleCreateCustomer: () => void;
    handleEditCustomer: () => void;
    handleDeleteCustomer: () => void;
    calculateLevel: (totalSpent: number) => Customer['level'];
}

export function CustomerDialogs({
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
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
                                <Label className='text-red-600 font-bold'>Mật khẩu</Label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Hạng thành viên</Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            level: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full bg-orange-50 font-bold text-orange-700 border-orange-200">
                                        <SelectValue placeholder="Chọn hạng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BRONZE">
                                            BRONZE
                                        </SelectItem>
                                        <SelectItem value="SILVER">
                                            SILVER
                                        </SelectItem>
                                        <SelectItem value="GOLD">
                                            GOLD
                                        </SelectItem>
                                        <SelectItem value="DIAMOND">
                                            DIAMOND
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

            {/* Delete Dialog remains the same */}
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
