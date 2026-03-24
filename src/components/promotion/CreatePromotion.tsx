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
function CreatePromotion({
    isDialogOpen,
    setDialogOpen,
}: {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    // Promotion form data
    const [promotionFormData, setPromotionFormData] = useState({
        code: '',
        name: '',
        description: '',
        type: 'Phần trăm' as const,
        discount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        maxUses: 100,
        usedCount: 0,
    });
    // Promotion handler
    const handleCreatePromotion = () => {
        if (
            promotionFormData.code &&
            promotionFormData.name &&
            promotionFormData.discount > 0 &&
            promotionFormData.startDate
        ) {
            toast.success('Khuyến mãi mới đã được tạo thành công!');
            setDialogOpen(false);
            setPromotionFormData({
                code: '',
                name: '',
                description: '',
                type: 'Phần trăm',
                discount: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                maxUses: 100,
                usedCount: 0,
            });
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin cơ bản!');
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin chương trình khuyến mãi mới
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    {/* Thông tin cơ bản */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin cơ bản
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="code"
                                className="text-sm font-medium"
                            >
                                Mã khuyến mãi
                            </Label>
                            <Input
                                id="code"
                                value={promotionFormData.code}
                                onChange={(e) =>
                                    setPromotionFormData({
                                        ...promotionFormData,
                                        code: e.target.value.toUpperCase(),
                                    })
                                }
                                placeholder="VD: BOOK2026"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Tên chương trình
                            </Label>
                            <Input
                                id="name"
                                value={promotionFormData.name}
                                onChange={(e) =>
                                    setPromotionFormData({
                                        ...promotionFormData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên chương trình"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Mô tả
                            </Label>
                            <Input
                                id="description"
                                value={promotionFormData.description}
                                onChange={(e) =>
                                    setPromotionFormData({
                                        ...promotionFormData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Mô tả chương trình (tùy chọn)"
                            />
                        </div>
                    </div>

                    {/* Thông tin giảm giá */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin giảm giá
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="type"
                                className="text-sm font-medium"
                            >
                                Loại giảm giá
                            </Label>
                            <Select
                                value={promotionFormData.type}
                                onValueChange={(value) =>
                                    setPromotionFormData({
                                        ...promotionFormData,
                                        type: value as typeof promotionFormData.type,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại giảm giá" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Phần trăm">
                                        Phần trăm (%)
                                    </SelectItem>
                                    <SelectItem value="Số tiền">
                                        Số tiền (VNĐ)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="discount"
                                className="text-sm font-medium"
                            >
                                Giá trị giảm{' '}
                                {promotionFormData.type === 'Phần trăm'
                                    ? '(%)'
                                    : '(VNĐ)'}
                            </Label>
                            <Input
                                id="discount"
                                type="number"
                                value={promotionFormData.discount}
                                onChange={(e) =>
                                    setPromotionFormData({
                                        ...promotionFormData,
                                        discount: parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Thông tin thời gian và sử dụng */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thời gian và giới hạn
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="startDate"
                                    className="text-sm font-medium"
                                >
                                    Ngày bắt đầu
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={promotionFormData.startDate}
                                    onChange={(e) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            startDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="endDate"
                                    className="text-sm font-medium"
                                >
                                    Ngày kết thúc
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={promotionFormData.endDate}
                                    onChange={(e) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            endDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="maxUses"
                                    className="text-sm font-medium"
                                >
                                    Số lượt tối đa
                                </Label>
                                <Input
                                    id="maxUses"
                                    type="number"
                                    value={promotionFormData.maxUses}
                                    onChange={(e) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            maxUses:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="100"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="usedCount"
                                    className="text-sm font-medium"
                                >
                                    Đã sử dụng
                                </Label>
                                <Input
                                    id="usedCount"
                                    type="number"
                                    value={promotionFormData.usedCount}
                                    onChange={(e) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            usedCount:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>
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
                    <Button type="button" onClick={handleCreatePromotion}>
                        Tạo khuyến mãi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreatePromotion;
