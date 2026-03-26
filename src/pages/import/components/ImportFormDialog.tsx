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

interface ImportOrder {
    status: 'Hoàn thành' | 'Đang xử lý' | 'Đã hủy';
}

interface ImportFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: () => void;
    submitLabel: string;
    isEdit?: boolean;
}

export const ImportFormDialog: React.FC<ImportFormDialogProps> = ({
    isOpen,
    onOpenChange,
    title,
    description,
    formData,
    setFormData,
    onSubmit,
    submitLabel,
    isEdit = false,
}) => {
    const [searchSupplier, setSearchSupplier] = React.useState('');
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [suppliers, setSuppliers] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const delay = setTimeout(() => {
            if (searchSupplier.trim() === '') {
                setSuppliers([]);
                return;
            }

            setLoading(true);

            fetch(`/api/suppliers?keyword=${searchSupplier}`)
                .then((res) => res.json())
                .then((data) => {
                    setSuppliers(data); 
                })
                .catch(() => {
                    setSuppliers([]);
                })
                .finally(() => setLoading(false));
        }, 300); 

        return () => clearTimeout(delay);
    }, [searchSupplier]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor={`${isEdit ? 'edit-' : ''}importNumber`}
                            className="text-sm font-medium"
                        >
                            Số phiếu nhập
                        </Label>
                        <Input
                            id={`${isEdit ? 'edit-' : ''}importNumber`}
                            value={formData.importNumber}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    importNumber: e.target.value,
                                })
                            }
                            className="bg-gray-50"
                            placeholder="Tự động tạo"
                            readOnly
                        />
                    </div>

                    <div className="space-y-2 relative">
                        <Label className="text-sm font-medium">
                            Nhà cung cấp
                        </Label>

                        <Input
                            value={searchSupplier}
                            onChange={(e) => {
                                setSearchSupplier(e.target.value);
                                setShowDropdown(true);
                            }}
                            placeholder="Nhập tên nhà cung cấp"
                        />

                        {showDropdown && (
                            <div className="absolute z-50 w-full bg-white border rounded-md shadow-md max-h-40 overflow-y-auto">
                                {loading && (
                                    <div className="px-3 py-2 text-gray-500">
                                        Đang tìm...
                                    </div>
                                )}

                                {!loading && suppliers.length === 0 && (
                                    <div className="px-3 py-2 text-gray-500">
                                        Không tìm thấy
                                    </div>
                                )}

                                {!loading &&
                                    suppliers.map((supplier, index) => (
                                        <div
                                            key={index}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    supplier: supplier,
                                                });
                                                setSearchSupplier(supplier);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {supplier}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin nhập hàng
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor={`${isEdit ? 'edit-' : ''}date`}
                                    className="text-sm font-medium"
                                >
                                    Ngày nhập
                                </Label>
                                <Input
                                    id={`${isEdit ? 'edit-' : ''}date`}
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor={`${isEdit ? 'edit-' : ''}time`}
                                    className="text-sm font-medium"
                                >
                                    Giờ nhập
                                </Label>
                                <Input
                                    id={`${isEdit ? 'edit-' : ''}time`}
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            time: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor={`${isEdit ? 'edit-' : ''}totalItems`}
                                className="text-sm font-medium"
                            >
                                Số lượng
                            </Label>
                            <Input
                                id={`${isEdit ? 'edit-' : ''}totalItems`}
                                type="number"
                                value={formData.totalItems}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        totalItems:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor={`${isEdit ? 'edit-' : ''}totalAmount`}
                                className="text-sm font-medium"
                            >
                                Tổng tiền (VNĐ)
                            </Label>
                            <Input
                                id={`${isEdit ? 'edit-' : ''}totalAmount`}
                                type="number"
                                value={formData.totalAmount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        totalAmount:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                            />
                        </div>
                        

                        <div className="space-y-2">
                            <Label
                                htmlFor={`${isEdit ? 'edit-' : ''}createdBy`}
                                className="text-sm font-medium"
                            >
                                Người tạo
                            </Label>
                            <Input
                                id={`${isEdit ? 'edit-' : ''}createdBy`}
                                value={formData.createdBy}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        createdBy: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên người tạo"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor={`${isEdit ? 'edit-' : ''}status`}
                                className="text-sm font-medium"
                            >
                                Trạng thái
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        status: value as any,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Hoàn thành">
                                        Hoàn thành
                                    </SelectItem>
                                    <SelectItem value="Đang xử lý">
                                        Đang xử lý
                                    </SelectItem>
                                    <SelectItem value="Đã hủy">
                                        Đã hủy
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor={`${isEdit ? 'edit-' : ''}note`}
                                className="text-sm font-medium"
                            >
                                Ghi chú
                            </Label>
                            <Input
                                id={`${isEdit ? 'edit-' : ''}note`}
                                value={formData.note}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        note: e.target.value,
                                    })
                                }
                                placeholder="Ghi chú (tùy chọn)"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="button"
                        onClick={onSubmit}
                        className="bg-orange-500 hover:bg-orange-600"
                    >
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
