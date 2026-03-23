import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';

interface ResignationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
}

export function ResignationDialog({
    open,
    onOpenChange,
    onSubmit,
}: ResignationDialogProps) {
    const [formData, setFormData] = useState({
        position: 'Senior Developer',
        department: 'Engineering',
        fromDate: '',
        toDate: '',
        daysTaken: '0',
        totalDays: '12',
        reason: '',
        detailedReason: '',
    });

    // Calculate leave days automatically when dates change
    useEffect(() => {
        if (formData.fromDate && formData.toDate) {
            const from = new Date(formData.fromDate);
            const to = new Date(formData.toDate);

            if (to >= from) {
                // Calculate the difference in days (inclusive)
                const diffTime = to.getTime() - from.getTime();
                const diffDays =
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setFormData((prev) => ({
                    ...prev,
                    daysTaken: diffDays.toString(),
                }));
            }
        }
    }, [formData.fromDate, formData.toDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            daysTakenOff: `${formData.daysTaken.padStart(2, '0')}/${formData.totalDays}`,
        };
        onSubmit(dataToSubmit);
        // Reset form
        setFormData({
            position: 'Senior Developer',
            department: 'Engineering',
            fromDate: '',
            toDate: '',
            daysTaken: '0',
            totalDays: '12',
            reason: '',
            detailedReason: '',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Đơn xin nghỉ việc</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-gray-900 pb-2 border-b border-gray-200">
                            Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="position">
                                    Vị trí hiện tại{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="position"
                                    value={formData.position}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            position: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">
                                    Phòng ban{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="department"
                                    value={formData.department}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            department: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Leave Period */}
                    <div className="space-y-4">
                        <h3 className="text-gray-900 pb-2 border-b border-gray-200">
                            Thời gian nghỉ
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fromDate">
                                    Từ ngày{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="fromDate"
                                    type="date"
                                    value={formData.fromDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fromDate: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="toDate">
                                    Đến ngày{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="toDate"
                                    type="date"
                                    value={formData.toDate}
                                    min={formData.fromDate}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            toDate: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resignation Details */}
                    <div className="space-y-4">
                        <h3 className="text-gray-900 pb-2 border-b border-gray-200">
                            Chi tiết nghỉ việc
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                Lý do nghỉ việc{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.reason}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, reason: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn lý do" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Lý do cá nhân">
                                        Lý do cá nhân
                                    </SelectItem>
                                    <SelectItem value="Thăng tiến sự nghiệp">
                                        Thăng tiến sự nghiệp
                                    </SelectItem>
                                    <SelectItem value="Chuyển nơi ở">
                                        Chuyển nơi ở
                                    </SelectItem>
                                    <SelectItem value="Học tập">
                                        Học tập
                                    </SelectItem>
                                    <SelectItem value="Sức khỏe">
                                        Sức khỏe
                                    </SelectItem>
                                    <SelectItem value="Khác">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="detailedReason">
                                Chi tiết bổ sung
                            </Label>
                            <Textarea
                                id="detailedReason"
                                placeholder="Vui lòng cung cấp thêm chi tiết về việc nghỉ việc của bạn..."
                                value={formData.detailedReason}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        detailedReason: e.target.value,
                                    })
                                }
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="min-w-[100px]"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]"
                        >
                            Gửi yêu cầu
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
