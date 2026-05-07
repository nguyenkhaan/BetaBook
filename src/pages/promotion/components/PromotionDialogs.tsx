import React, { useEffect, useState } from 'react';
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
import { Button } from '../../../components/ui/button';
import { Download } from 'lucide-react';
import { Promotion } from '../PromotionsPage';
import { VoucherService } from '../../../services/voucher.service';

interface PromotionDialogsProps {
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (open: boolean) => void;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: (open: boolean) => void;
    isViewDialogOpen: boolean;
    setIsViewDialogOpen: (open: boolean) => void;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (open: boolean) => void;
    selectedPromotion: Promotion | null;
    formData: any;
    setFormData: (data: any) => void;
    handleCreatePromotion: () => void;
    handleEditPromotion: () => void;
    handleDeletePromotion: () => void;
    handleDownloadPromotion: (promo: Promotion) => void;
    resetFormData: () => void;
    formatDate: (date: string) => string;
    getStatusColor: (status: string) => string;
}

export function PromotionDialogs({
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPromotion,
    formData,
    setFormData,
    handleCreatePromotion,
    handleEditPromotion,
    handleDeletePromotion,
    handleDownloadPromotion,
    resetFormData,
    formatDate,
    getStatusColor,
}: PromotionDialogsProps) {
    const [promotionTypeOptions, setPromotionTypeOptions] = useState<string[]>(
        [],
    );
    const [promotionStatusOptions, setPromotionStatusOptions] = useState<
        string[]
    >([]);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const voucherOptions = await VoucherService.getOptions();
                setPromotionStatusOptions(voucherOptions.status);
                setPromotionTypeOptions(voucherOptions.type);
            } catch (error) {
                console.error('Lỗi khi lấy options từ server:', error);
            }
        }
        fetchOptions();
    }, []);

    // Hàm render các trường nhập liệu dùng chung
    const renderFormFields = (isEdit: boolean) => (
        <div className="grid gap-5 py-4">
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">
                    Thông tin cơ bản
                </h4>
                <div className="space-y-2">
                    <Label htmlFor={`${isEdit ? 'edit-' : ''}code`}>
                        Mã khuyến mãi (Unique)
                    </Label>
                    <Input
                        id={`${isEdit ? 'edit-' : ''}code`}
                        value={formData.code || ''}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                code: e.target.value.toUpperCase(),
                            })
                        }
                        placeholder="VD: PHUTAN2026"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${isEdit ? 'edit-' : ''}name`}>
                        Tên Voucher
                    </Label>
                    <Input
                        id={`${isEdit ? 'edit-' : ''}name`}
                        value={formData.name || ''}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Nhập tên voucher"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${isEdit ? 'edit-' : ''}eventName`}>
                        Tên chương trình (Event)
                    </Label>
                    <Input
                        id={`${isEdit ? 'edit-' : ''}eventName`}
                        value={formData.eventName || ''}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                eventName: e.target.value,
                            })
                        }
                        placeholder="Nhập tên sự kiện"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${isEdit ? 'edit-' : ''}description`}>
                        Mô tả
                    </Label>
                    <Input
                        id={`${isEdit ? 'edit-' : ''}description`}
                        value={formData.description || ''}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        placeholder="Mô tả chi tiết"
                    />
                </div>
            </div>

            <div className="space-y-4 pt-2 border-t">
                <h4 className="text-sm font-semibold text-gray-700">
                    Giá trị giảm giá
                </h4>
                <div className="space-y-2">
                    <Label>Loại giảm giá</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value) =>
                            setFormData({ ...formData, type: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại giảm giá" />
                        </SelectTrigger>
                        <SelectContent>
                            {promotionTypeOptions?.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>
                        Giá trị giảm{' '}
                        {formData.type === 'Percent' ? '(%)' : '(VNĐ)'}
                    </Label>
                    <Input
                        type="number"
                        value={formData.sale || 0}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                sale: parseFloat(e.target.value) || 0,
                            })
                        }
                    />
                </div>
            </div>

            <div className="space-y-4 pt-2 border-t">
                <h4 className="text-sm font-semibold text-gray-700">
                    Thời gian và Giới hạn
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Ngày bắt đầu</Label>
                        <Input
                            type="date"
                            value={
                                formData.startDate
                                    ? formData.startDate.split('T')[0]
                                    : ''
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    startDate: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Ngày hết hạn</Label>
                        <Input
                            type="date"
                            value={
                                formData.expiresAt
                                    ? formData.expiresAt.split('T')[0]
                                    : ''
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    expiresAt: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tổng số lượng</Label>
                        <Input
                            type="number"
                            value={formData.quantity || 0}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    quantity: parseInt(e.target.value) || 0,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Đã sử dụng</Label>
                        <Input
                            type="number"
                            value={formData.usedNumber || 0}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    usedNumber: parseInt(e.target.value) || 0,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Trạng thái</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            {promotionStatusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Create Dialog */}
            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
                    </DialogHeader>
                    {renderFormFields(false)}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen(false);
                                resetFormData();
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleCreatePromotion}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Xác nhận tạo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
                    </DialogHeader>
                    {renderFormFields(true)}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleEditPromotion}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết khuyến mãi</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-center">
                            <Label className="text-orange-500 font-bold uppercase text-xs">
                                Mã ưu đãi
                            </Label>
                            <div className="text-2xl font-black text-orange-600 tracking-tighter">
                                {selectedPromotion?.code}
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="flex justify-between py-2 text-sm">
                                <span className="text-gray-500">
                                    Tên voucher:
                                </span>
                                <span className="font-medium">
                                    {selectedPromotion?.name}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 text-sm">
                                <span className="text-gray-500">Giảm giá:</span>
                                <span className="font-bold text-orange-600">
                                    {selectedPromotion?.type === 'Percent'
                                        ? `${selectedPromotion?.sale}%`
                                        : `${selectedPromotion?.sale?.toLocaleString()}đ`}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 text-sm">
                                <span className="text-gray-500">Hiệu lực:</span>
                                <span className="font-medium">
                                    {selectedPromotion &&
                                        formatDate(
                                            selectedPromotion.startDate,
                                        )}{' '}
                                    -{' '}
                                    {selectedPromotion &&
                                        formatDate(selectedPromotion.expiresAt)}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 text-sm">
                                <span className="text-gray-500">Đã dùng:</span>
                                <span className="font-medium">
                                    {selectedPromotion?.usedNumber} /{' '}
                                    {selectedPromotion?.quantity}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 text-sm items-center">
                                <span className="text-gray-500">
                                    Trạng thái:
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-bold ${selectedPromotion && getStatusColor(selectedPromotion.status)}`}
                                >
                                    {selectedPromotion?.status}
                                </span>
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
                        <Button
                            onClick={() =>
                                selectedPromotion &&
                                handleDownloadPromotion(selectedPromotion)
                            }
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <Download className="w-4 h-4 mr-2" /> Tải Voucher
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Xác nhận xóa
                        </DialogTitle>
                        <DialogDescription>
                            Bạn đang chuẩn bị xóa voucher{' '}
                            <strong>{selectedPromotion?.code}</strong>. Hành
                            động này sẽ xóa vĩnh viễn dữ liệu khỏi hệ thống.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleDeletePromotion}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Tôi chắc chắn, hãy xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
