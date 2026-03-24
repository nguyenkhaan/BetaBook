import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Regulation } from "../RegulationsPage";

interface RegulationDialogsProps {
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (isOpen: boolean) => void;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: (isOpen: boolean) => void;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    formData: any;
    setFormData: (data: any) => void;
    handleCreateRegulation: () => void;
    handleEditRegulation: () => void;
    handleDeleteRegulation: () => void;
    resetFormData: () => void;
    selectedRegulation: Regulation | null;
    categories: string[];
}

const RegulationDialogs = ({ isCreateDialogOpen, setIsCreateDialogOpen, isEditDialogOpen, setIsEditDialogOpen, isDeleteDialogOpen, setIsDeleteDialogOpen, formData, setFormData, handleCreateRegulation, handleEditRegulation, handleDeleteRegulation, resetFormData, selectedRegulation, categories }: RegulationDialogsProps) => {
    return (
        <>
            {/* Create Regulation Dialog */}
            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
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
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="VD: Quy định về giờ làm việc"
                                />
                                <Label
                                    htmlFor="title"
                                    className="text-sm font-medium"
                                >
                                    Mã người tạo
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="VD: NV001"
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
                                        value={formData.category}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                category: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => cat !== 'Tất cả' && <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
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
                                        value={formData.effectiveDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
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
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            status: value as Regulation['status'],
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
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
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
                                <textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập nội dung chi tiết của quy định..."
                                    className="w-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                />
                                <p className="text-xs text-gray-500">
                                    Số ký tự: {formData.content.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen(false);
                                resetFormData();
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreateRegulation}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            Thêm quy định
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Regulation Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa quy định</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin quy định
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
                                    htmlFor="editTitle"
                                    className="text-sm font-medium"
                                >
                                    Tiêu đề quy định
                                </Label>
                                <Input
                                    id="editTitle"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="VD: Quy định về giờ làm việc"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="editCategory"
                                        className="text-sm font-medium"
                                    >
                                        Danh mục
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                category: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => cat !== 'Tất cả' && <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="editEffectiveDate"
                                        className="text-sm font-medium"
                                    >
                                        Ngày có hiệu lực
                                    </Label>
                                    <Input
                                        id="editEffectiveDate"
                                        type="date"
                                        value={formData.effectiveDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                effectiveDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="editStatus"
                                    className="text-sm font-medium"
                                >
                                    Trạng thái
                                </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            status: value as Regulation['status'],
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
                                    htmlFor="editDescription"
                                    className="text-sm font-medium"
                                >
                                    Mô tả ngắn
                                </Label>
                                <Input
                                    id="editDescription"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
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
                                    htmlFor="editContent"
                                    className="text-sm font-medium"
                                >
                                    Nội dung quy định
                                    <span className="text-xs text-gray-500 ml-2">
                                        (Có thể nhập nhiều dòng)
                                    </span>
                                </Label>
                                <textarea
                                    id="editContent"
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập nội dung chi tiết của quy định..."
                                    className="w-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                                    style={{ whiteSpace: 'pre-wrap' }}
                                />
                                <p className="text-xs text-gray-500">
                                    Số ký tự: {formData.content.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleEditRegulation}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Regulation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xóa quy định</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa quy định này?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Tiêu đề:
                                </span>
                                <span className="text-sm font-semibold text-red-600">
                                    {selectedRegulation?.title}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Danh mục:
                                </span>
                                <span className="text-sm font-medium">
                                    {selectedRegulation?.category}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Trạng thái:
                                </span>
                                <span className="text-sm font-medium">
                                    {selectedRegulation?.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDeleteRegulation}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Xóa quy định
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RegulationDialogs;
