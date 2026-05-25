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

function CreateOutcome({
    isDialogOpen,
    setDialogOpen,
}: {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    const [importFormData, setImportFormData] = useState({
        importNumber: '',
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        totalItems: 0,
        totalAmount: 0,
        createdBy: 'A Nguyen Van',
        status: 'Hoàn thành' as const,
    });
    // Import handler
    const handleCreateImport = () => {
        if (importFormData.supplier && importFormData.totalAmount > 0) {
            toast.success('Phiếu nhập đã được tạo thành công!');
            setDialogOpen(false);
            setImportFormData({
                importNumber: '',
                supplier: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().slice(0, 5),
                totalItems: 0,
                totalAmount: 0,
                createdBy: 'A Nguyen Van',
                status: 'Hoàn thành',
            });
        } else {
            toast.error('Vui lòng nhập nhà cung cấp và tổng tiền!');
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tạo phiếu nhập mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin phiếu nhập hàng mới
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    {/* Số phiếu nhập */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="importNumber"
                            className="text-sm font-medium"
                        >
                            Số phiếu nhập
                        </Label>
                        <Input
                            id="importNumber"
                            value={importFormData.importNumber || 'PN001'}
                            onChange={(e) =>
                                setImportFormData({
                                    ...importFormData,
                                    importNumber: e.target.value,
                                })
                            }
                            className="bg-gray-50"
                            placeholder="Tự động tạo"
                            readOnly
                        />
                    </div>

                    {/* Thông tin nhà cung cấp */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin nhà cung cấp
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="supplier"
                                className="text-sm font-medium"
                            >
                                Nhà cung cấp
                            </Label>
                            <Input
                                id="supplier"
                                value={importFormData.supplier}
                                onChange={(e) =>
                                    setImportFormData({
                                        ...importFormData,
                                        supplier: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên nhà cung cấp"
                            />
                        </div>
                    </div>

                    {/* Thông tin nhập hàng */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Thông tin nhập hàng
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="date"
                                    className="text-sm font-medium"
                                >
                                    Ngày nhập
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={importFormData.date}
                                    onChange={(e) =>
                                        setImportFormData({
                                            ...importFormData,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="time"
                                    className="text-sm font-medium"
                                >
                                    Giờ nhập
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={importFormData.time}
                                    onChange={(e) =>
                                        setImportFormData({
                                            ...importFormData,
                                            time: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="totalItems"
                                className="text-sm font-medium"
                            >
                                Số lượng
                            </Label>
                            <Input
                                id="totalItems"
                                type="number"
                                value={importFormData.totalItems}
                                onChange={(e) =>
                                    setImportFormData({
                                        ...importFormData,
                                        totalItems:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="totalAmount"
                                className="text-sm font-medium"
                            >
                                Tổng tiền (VNĐ)
                            </Label>
                            <Input
                                id="totalAmount"
                                type="number"
                                value={importFormData.totalAmount}
                                onChange={(e) =>
                                    setImportFormData({
                                        ...importFormData,
                                        totalAmount:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="createdBy"
                                className="text-sm font-medium"
                            >
                                Mã nhân viên
                            </Label>
                            <Input
                                id="createdBy"
                                value={importFormData.createdBy}
                                onChange={(e) =>
                                    setImportFormData({
                                        ...importFormData,
                                        createdBy: e.target.value,
                                    })
                                }
                                placeholder="Nhập tên người tạo"
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
                                value={importFormData.status}
                                onValueChange={(value) =>
                                    setImportFormData({
                                        ...importFormData,
                                        status: value as typeof importFormData.status,
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
                    <Button type="button" onClick={handleCreateImport}>
                        Tạo phiếu nhập
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreateOutcome;
