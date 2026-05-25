import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { RegulationService, RuleOptions } from '../../../services/regulation.service';
import { RuleStatusLabel } from '../../../utilis/label_mapper';

export interface RegulationFormData {
    id?: number;
    title: string;
    content: string;
    shortDescription: string;
    appliedAt: string;
    status: 'APPLYING' | 'UPCOMING' | 'REJECT';
    type: string;
}

interface EditRegulationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    regulation: RegulationFormData | null;
    onSave: (data: RegulationFormData) => void;
}

export function EditRegulationDialog({
    open,
    onOpenChange,
    regulation,
    onSave,
}: EditRegulationDialogProps) {
    const [formData, setFormData] = useState<RegulationFormData>({
        title: '',
        content: '',
        shortDescription: '',
        appliedAt: new Date().toISOString().split('T')[0],
        status: 'APPLYING',
        type: '',
    });

    const [options, setOptions] = useState<RuleOptions | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open && !options) {
            fetchOptions();
        }
    }, [open, options]);

    useEffect(() => {
        if (regulation && open) {
            setFormData({ ...regulation });
        } else if (open && !regulation) {
            setFormData({
                title: '',
                content: '',
                shortDescription: '',
                appliedAt: new Date().toISOString().split('T')[0],
                status: 'APPLYING',
                type: '',
            });
        }
    }, [regulation, open]);

    const fetchOptions = async () => {
        try {
            const data = await RegulationService.getOptions();
            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleSave = () => {
        if (
            !formData.title ||
            !formData.content ||
            !formData.shortDescription ||
            !formData.type
        ) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        onSave(formData);
    };

    const handleInputChange = (
        field: keyof RegulationFormData,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    if (!options) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <p className="text-center py-4">Đang tải...</p>
                </DialogContent>
            </Dialog>
        );
    }

    const isEditing = !!regulation?.id;
    const statusOptions = options.status || [
        'APPLYING',
        'UPCOMING',
        'REJECT',
    ];
    const typeOptions = options.type || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Chỉnh sửa' : 'Tạo'} quy định
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Cập nhật thông tin quy định'
                            : 'Thêm quy định mới vào hệ thống'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                handleInputChange('title', e.target.value)
                            }
                            placeholder="Nhập tiêu đề quy định"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">
                            Mô tả ngắn *
                        </Label>
                        <Input
                            id="shortDescription"
                            value={formData.shortDescription}
                            onChange={(e) =>
                                handleInputChange(
                                    'shortDescription',
                                    e.target.value
                                )
                            }
                            placeholder="Nhập mô tả ngắn"
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Loại quy định *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) =>
                                    handleInputChange('type', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                                <SelectContent>
                                    {typeOptions.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Trạng thái *</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    handleInputChange(
                                        'status',
                                        value as any
                                    )
                                }
                            >
                                <SelectTrigger>
                                    {formData.status ? RuleStatusLabel[formData.status] : 'Chọn trạng thái'}
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status === 'APPLYING'
                                                ? 'Đang áp dụng'
                                                : status === 'UPCOMING'
                                                  ? 'Sắp áp dụng'
                                                  : 'Từ chối'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="appliedAt">
                            Ngày có hiệu lực *
                        </Label>
                        <Input
                            id="appliedAt"
                            type="date"
                            value={formData.appliedAt}
                            onChange={(e) =>
                                handleInputChange('appliedAt', e.target.value)
                            }
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Nội dung đầy đủ *</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) =>
                                handleInputChange('content', e.target.value)
                            }
                            placeholder="Nhập nội dung chi tiết của quy định"
                            className="w-full min-h-[200px] font-mono"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-orange-500 font-medium text-white"
                    >
                        {isLoading
                            ? 'Đang lưu...'
                            : isEditing
                              ? 'Cập nhật'
                              : 'Tạo mới'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export interface RegulationData extends RegulationFormData {}
