import { useState } from 'react';
import { Textarea } from '../ui/textarea';
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
function CreateRegulation({
    isDialogOpen,
    setDialogOpen,
}: {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    // Regulation form data
    const [regulationFormData, setRegulationFormData] = useState({
        title: '',
        category: 'Nhân sự',
        effectiveDate: new Date().toISOString().split('T')[0],
        status: 'Đang áp dụng' as const,
        description: '',
        content: '',
    });

    // Regulation handler
    const handleAddRegulation = () => {
        if (
            regulationFormData.title &&
            regulationFormData.category &&
            regulationFormData.content
        ) {
            toast.success('Quy định mới đã được thêm thành công!');
            setDialogOpen(false);
            setRegulationFormData({
                title: '',
                category: 'Nhân sự',
                effectiveDate: new Date().toISOString().split('T')[0],
                status: 'Đang áp dụng',
                description: '',
                content: '',
            });
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Thêm quy định mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin quy định mới vào hệ thống
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
                                htmlFor="title"
                                className="text-sm font-medium"
                            >
                                Tiêu đề quy định
                            </Label>
                            <Input
                                id="title"
                                value={regulationFormData.title}
                                onChange={(e) =>
                                    setRegulationFormData({
                                        ...regulationFormData,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="VD: Quy định về giờ làm việc"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="category"
                                    className="text-sm font-medium"
                                >
                                    Danh mục
                                </Label>
                                <Select
                                    value={regulationFormData.category}
                                    onValueChange={(value) =>
                                        setRegulationFormData({
                                            ...regulationFormData,
                                            category: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nhân sự">
                                            Nhân sự
                                        </SelectItem>
                                        <SelectItem value="Bán hàng">
                                            Bán hàng
                                        </SelectItem>
                                        <SelectItem value="Kho vận">
                                            Kho vận
                                        </SelectItem>
                                        <SelectItem value="Dịch vụ khách hàng">
                                            Dịch vụ khách hàng
                                        </SelectItem>
                                        <SelectItem value="Tài chính">
                                            Tài chính
                                        </SelectItem>
                                        <SelectItem value="An toàn">
                                            An toàn
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="effectiveDate"
                                    className="text-sm font-medium"
                                >
                                    Ngày có hiệu lực
                                </Label>
                                <Input
                                    id="effectiveDate"
                                    type="date"
                                    value={regulationFormData.effectiveDate}
                                    onChange={(e) =>
                                        setRegulationFormData({
                                            ...regulationFormData,
                                            effectiveDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="status"
                                className="text-sm font-medium"
                            >
                                Trạng thái
                            </Label>
                            <Select
                                value={regulationFormData.status}
                                onValueChange={(value) =>
                                    setRegulationFormData({
                                        ...regulationFormData,
                                        status: value as typeof regulationFormData.status,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Đang áp dụng">
                                        Đang áp dụng
                                    </SelectItem>
                                    <SelectItem value="Sắp có hiệu lực">
                                        Sắp có hiệu lực
                                    </SelectItem>
                                    <SelectItem value="Đã hết hiệu lực">
                                        Đã hết hiệu lực
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Mô tả ngắn
                            </Label>
                            <Input
                                id="description"
                                value={regulationFormData.description}
                                onChange={(e) =>
                                    setRegulationFormData({
                                        ...regulationFormData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Mô tả ngắn gọn về quy định"
                            />
                        </div>
                    </div>

                    {/* Nội dung quy định */}
                    <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold text-gray-700">
                            Nội dung chi tiết
                        </h4>

                        <div className="space-y-2">
                            <Label
                                htmlFor="content"
                                className="text-sm font-medium"
                            >
                                Nội dung quy định
                                <span className="text-xs text-gray-500 ml-2">
                                    (Có thể nhập nhiều dòng)
                                </span>
                            </Label>
                            <Textarea
                                id="content"
                                value={regulationFormData.content}
                                onChange={(e) =>
                                    setRegulationFormData({
                                        ...regulationFormData,
                                        content: e.target.value,
                                    })
                                }
                                placeholder="Nhập nội dung chi tiết của quy định..."
                                className="min-h-[200px] resize-y"
                                rows={10}
                            />
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
                    <Button type="button" onClick={handleAddRegulation}>
                        Thêm quy định
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreateRegulation;
