import React from 'react';
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
    getStatusColor: (status: Promotion['status']) => string;
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
    return (
        <>
            {/* Create Promotion Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin chương trình khuyến mãi mới
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-700">Thông tin cơ bản</h4>
                            <div className="space-y-2">
                                <Label htmlFor="code" className="text-sm font-medium">Mã khuyến mãi</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="VD: BOOK2026"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Tên chương trình</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nhập tên chương trình"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">Mô tả</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả chương trình (tùy chọn)"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">Thông tin giảm giá</h4>
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-sm font-medium">Loại giảm giá</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value as Promotion['type'] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại giảm giá" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Phần trăm">Phần trăm (%)</SelectItem>
                                        <SelectItem value="Số tiền">Số tiền (VNĐ)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="discount" className="text-sm font-medium">
                                    Giá trị giảm {formData.type === 'Phần trăm' ? '(%)' : '(VNĐ)'}
                                </Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">Thời gian và giới hạn</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="text-sm font-medium">Ngày bắt đầu</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="text-sm font-medium">Ngày kết thúc</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxUses" className="text-sm font-medium">Số lượt tối đa</Label>
                                    <Input
                                        id="maxUses"
                                        type="number"
                                        value={formData.maxUses}
                                        onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                                        placeholder="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usedCount" className="text-sm font-medium">Đã sử dụng</Label>
                                    <Input
                                        id="usedCount"
                                        type="number"
                                        value={formData.usedCount}
                                        onChange={(e) => setFormData({ ...formData, usedCount: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value as Promotion['status'] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Đang áp dụng">Đang áp dụng</SelectItem>
                                        <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                                        <SelectItem value="Đã kết thúc">Đã kết thúc</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetFormData(); }}>Hủy bỏ</Button>
                        <Button type="button" onClick={handleCreatePromotion} className="bg-orange-500 hover:bg-orange-600">Tạo khuyến mãi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Promotion Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
                        <DialogDescription>Cập nhật thông tin chương trình khuyến mãi</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-700">Thông tin cơ bản</h4>
                            <div className="space-y-2">
                                <Label htmlFor="editCode" className="text-sm font-medium">Mã khuyến mãi</Label>
                                <Input
                                    id="editCode"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="VD: BOOK2026"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editName" className="text-sm font-medium">Tên chương trình</Label>
                                <Input
                                    id="editName"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nhập tên chương trình"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editDescription" className="text-sm font-medium">Mô tả</Label>
                                <Input
                                    id="editDescription"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả chương trình (tùy chọn)"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">Thông tin giảm giá</h4>
                            <div className="space-y-2">
                                <Label htmlFor="editType" className="text-sm font-medium">Loại giảm giá</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value as Promotion['type'] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại giảm giá" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Phần trăm">Phần trăm (%)</SelectItem>
                                        <SelectItem value="Số tiền">Số tiền (VNĐ)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editDiscount" className="text-sm font-medium">
                                    Giá trị giảm {formData.type === 'Phần trăm' ? '(%)' : '(VNĐ)'}
                                </Label>
                                <Input
                                    id="editDiscount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">Thời gian và giới hạn</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="editStartDate" className="text-sm font-medium">Ngày bắt đầu</Label>
                                    <Input
                                        id="editStartDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editEndDate" className="text-sm font-medium">Ngày kết thúc</Label>
                                    <Input
                                        id="editEndDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="editMaxUses" className="text-sm font-medium">Số lượt tối đa</Label>
                                    <Input
                                        id="editMaxUses"
                                        type="number"
                                        value={formData.maxUses}
                                        onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                                        placeholder="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editUsedCount" className="text-sm font-medium">Đã sử dụng</Label>
                                    <Input
                                        id="editUsedCount"
                                        type="number"
                                        value={formData.usedCount}
                                        onChange={(e) => setFormData({ ...formData, usedCount: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editStatus" className="text-sm font-medium">Trạng thái</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value as Promotion['status'] })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Đang áp dụng">Đang áp dụng</SelectItem>
                                        <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                                        <SelectItem value="Đã kết thúc">Đã kết thúc</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy bỏ</Button>
                        <Button type="button" onClick={handleEditPromotion} className="bg-orange-500 hover:bg-orange-600">Cập nhật</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Promotion Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết khuyến mãi</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về chương trình khuyến mãi</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-500">Mã khuyến mãi</Label>
                            <div className="text-lg font-semibold text-orange-600">{selectedPromotion?.code}</div>
                        </div>
                        <div className="border-t pt-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Tên chương trình:</span>
                                <span className="text-sm font-medium">{selectedPromotion?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Giảm giá:</span>
                                <span className="text-sm font-semibold text-orange-600">
                                    {selectedPromotion?.type === 'Phần trăm' ? `${selectedPromotion?.discount}%` : `${selectedPromotion?.discount.toLocaleString('vi-VN')}đ`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Thời gian:</span>
                                <span className="text-sm font-medium">
                                    {selectedPromotion && formatDate(selectedPromotion.startDate)} - {selectedPromotion && formatDate(selectedPromotion.endDate)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Đã dùng / Tối đa:</span>
                                <span className="text-sm font-medium">{selectedPromotion?.usedCount} / {selectedPromotion?.maxUses}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Trạng thái:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedPromotion && getStatusColor(selectedPromotion.status)}`}>
                                    {selectedPromotion?.status}
                                </span>
                            </div>
                            {selectedPromotion?.description && (
                                <div className="flex flex-col gap-1 pt-2 border-t">
                                    <span className="text-sm text-gray-500">Mô tả:</span>
                                    <span className="text-sm">{selectedPromotion.description}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsViewDialogOpen(false)}>Đóng</Button>
                        <Button type="button" onClick={() => selectedPromotion && handleDownloadPromotion(selectedPromotion)} className="bg-blue-500 hover:bg-blue-600">
                            <Download className="w-4 h-4 mr-2" /> Tải khuyến mãi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Promotion Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xóa khuyến mãi</DialogTitle>
                        <DialogDescription>Bạn có chắc chắn muốn xóa khuyến mãi này không?</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Mã khuyến mãi:</span>
                                <span className="text-sm font-semibold text-red-600">{selectedPromotion?.code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Tên chương trình:</span>
                                <span className="text-sm font-medium">{selectedPromotion?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Đã sử dụng:</span>
                                <span className="text-sm font-semibold">{selectedPromotion?.usedCount} / {selectedPromotion?.maxUses}</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy bỏ</Button>
                        <Button type="button" onClick={handleDeletePromotion} className="bg-red-500 hover:bg-red-600">Xóa khuyến mãi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
