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
import { Switch } from '../../../components/ui/switch';

export interface RegulationData {
    id: number;
    maxDebt?: number;
    minStockBeforeImport?: number;
    minStockAfterSale?: number;
    maxStockForImport?: number;
    minImportQuantity?: number;
    maxStockAfterImport?: number;
    enabled?: boolean;
}

interface EditRegulationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    regulation: RegulationData | null;
    onSave: (data: RegulationData) => void;
}

export function EditRegulationDialog({
    open,
    onOpenChange,
    regulation,
    onSave,
}: EditRegulationDialogProps) {
    // Khởi tạo state với dữ liệu trống
    const [formData, setFormData] = useState<RegulationData>({ id: 0 });

    // Cập nhật formData mỗi khi regulation prop thay đổi hoặc khi dialog được mở
    useEffect(() => {
        if (regulation && open) {
            setFormData({ ...regulation });
        }
    }, [regulation, open]);

    const handleSave = () => {
        onSave(formData);
        onOpenChange(false);
    };

    const handleInputChange = (field: keyof RegulationData, value: string) => {
        const numValue = parseInt(value);
        setFormData((prev) => ({
            ...prev,
            [field]: isNaN(numValue) ? 0 : numValue,
        }));
    };

    if (!regulation) return null;

    const renderFields = () => {
        // Render nội dung dựa trên ID của quy định (giống logic cũ nhưng sạch hơn)
        switch (regulation.id) {
            case 1:
                return (
                    <div className="space-y-4">
                        <StatusToggle
                            checked={formData.enabled}
                            onChange={(val) =>
                                setFormData({ ...formData, enabled: val })
                            }
                        />
                        <FieldItem
                            label="Số tiền nợ tối đa (đ)"
                            value={formData.maxDebt}
                            onChange={(val) =>
                                handleInputChange('maxDebt', val)
                            }
                            description="Chỉ bán cho khách hàng không nợ quá số tiền này"
                        />
                        <FieldItem
                            label="Số lượng nhập tối thiểu"
                            value={formData.minImportQuantity}
                            onChange={(val) =>
                                handleInputChange('minImportQuantity', val)
                            }
                        />
                        <FieldItem
                            label="Lượng tồn tối thiểu trước khi nhập"
                            value={formData.minStockBeforeImport}
                            onChange={(val) =>
                                handleInputChange('minStockBeforeImport', val)
                            }
                        />
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <StatusToggle
                            checked={formData.enabled}
                            onChange={(val) =>
                                setFormData({ ...formData, enabled: val })
                            }
                        />
                        <FieldItem
                            label="Tiền nợ tối đa (đ)"
                            value={formData.maxDebt}
                            onChange={(val) =>
                                handleInputChange('maxDebt', val)
                            }
                        />
                        <FieldItem
                            label="Lượng tồn tối thiểu sau khi bán"
                            value={formData.minStockAfterSale}
                            onChange={(val) =>
                                handleInputChange('minStockAfterSale', val)
                            }
                        />
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <StatusToggle
                            checked={formData.enabled}
                            onChange={(val) =>
                                setFormData({ ...formData, enabled: val })
                            }
                        />
                        <FieldItem
                            label="Chỉ nhập sách có tồn kho ít hơn"
                            value={formData.maxStockForImport}
                            onChange={(val) =>
                                handleInputChange('maxStockForImport', val)
                            }
                        />
                        <FieldItem
                            label="Số lượng nhập ít nhất"
                            value={formData.minImportQuantity}
                            onChange={(val) =>
                                handleInputChange('minImportQuantity', val)
                            }
                        />
                        <FieldItem
                            label="Lượng tồn tối đa sau khi nhập"
                            value={formData.maxStockAfterImport}
                            onChange={(val) =>
                                handleInputChange('maxStockAfterImport', val)
                            }
                            description={`Tồn hiện tại + Lượng nhập ≤ ${formData.maxStockAfterImport || 0}`}
                        />
                    </div>
                );

            default:
                return (
                    <p className="text-center text-gray-500 py-4">
                        Quy định này hiện chưa có cấu hình tùy chỉnh.
                    </p>
                );
        }
    };

    const getTitle = () => {
        const titles: Record<number, string> = {
            1: 'Chỉnh sửa QĐ1 - Quy định bán hàng',
            2: 'Chỉnh sửa QĐ2 - Quy định nợ và tồn kho',
            3: 'Chỉnh sửa QĐ3 - Quy định nhập hàng',
        };
        return titles[regulation.id] || 'Chỉnh sửa quy định';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                    <DialogDescription>
                        Thay đổi các thông số quy định của hệ thống
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">{renderFields()}</div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-[#f97316] hover:bg-[#ea580c] text-white"
                    >
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- Các Component hỗ trợ để code gọn hơn ---

function StatusToggle({
    checked,
    onChange,
}: {
    checked?: boolean;
    onChange: (val: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="space-y-1">
                <Label className="text-base font-semibold">
                    Trạng thái quy định
                </Label>
                <p className="text-xs text-gray-500">
                    Kích hoạt hoặc tạm ngưng áp dụng
                </p>
            </div>
            <Switch checked={checked || false} onCheckedChange={onChange} />
        </div>
    );
}

function FieldItem({
    label,
    value,
    onChange,
    description,
}: {
    label: string;
    value?: number;
    onChange: (val: string) => void;
    description?: string;
}) {
    return (
        <div className="space-y-2">
            <Label className="font-medium text-gray-700">{label}</Label>
            <Input
                type="number"
                value={value ?? 0}
                onChange={(e) => onChange(e.target.value)}
                className="focus-visible:ring-orange-500"
            />
            {description && (
                <p className="text-xs text-gray-400 italic">{description}</p>
            )}
        </div>
    );
}
