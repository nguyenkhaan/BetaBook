import React, { useState, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { BookService } from '../../../services/book.service';
import {
    SearchableMultiSelect,
    SearchableOption,
} from '../../../components/common/SearchableMultiSelect';
import { BOOK_CATEGORIES_LABEL } from '../../../bases/constants/book.constants';

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
    const [searchSupplier, setSearchSupplier] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [suppliers, setSuppliers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const [authorOptions, setAuthorOptions] = useState<SearchableOption[]>([]);
    const [publisherOptions, setPublisherOptions] = useState<
        SearchableOption[]
    >([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
    const [isLoadingPublishers, setIsLoadingPublishers] = useState(false);

    useEffect(() => {
        loadAuthorsAndPublishers();
        loadCategories();
    }, []);

    useEffect(() => {
        setSearchSupplier(formData.supplier || '');
    }, [formData.supplier]);

    useEffect(() => {
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

    const loadAuthorsAndPublishers = async () => {
        try {
            setIsLoadingAuthors(true);
            setIsLoadingPublishers(true);
            const [authors, publishers] = await Promise.all([
                BookService.getAllAuthors(),
                BookService.getAllPublishers(),
            ]);

            setAuthorOptions(
                authors.map((a: any) => ({
                    id: a.id || a.authorId,
                    label: a.name || a.authorName,
                })),
            );
            setPublisherOptions(
                publishers.map((p: any) => ({
                    id: p.id || p.publisherId,
                    label: p.name || p.publisherName,
                })),
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingAuthors(false);
            setIsLoadingPublishers(false);
        }
    };

    const loadCategories = async () => {
        try {
            const fetchedCategories = await BookService.getCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAuthorSearch = async (
        query: string,
    ): Promise<SearchableOption[]> => {
        try {
            const results = await BookService.searchAuthors(query);
            return results.map((a: any) => ({
                id: a.id || a.authorId,
                label: a.name || a.authorName,
            }));
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const handlePublisherSearch = async (
        query: string,
    ): Promise<SearchableOption[]> => {
        try {
            const results = await BookService.searchPublishers(query);
            return results.map((p: any) => ({
                id: p.id || p.publisherId,
                label: p.name || p.publisherName,
            }));
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const handleConfirmBookDetails = () => {
        const price = parseInt(formData.importPrice) || 0;
        const qty = parseInt(formData.quantity) || 0;
        setFormData({
            ...formData,
            totalAmount: price * qty,
            totalItems: qty,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
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
                            value={formData.importNumber || ''}
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
                                const value = e.target.value;
                                setSearchSupplier(value);
                                setFormData({
                                    ...formData,
                                    supplier: value,
                                });
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

                    <div className="space-y-3 pt-4 pb-2 border-t mb-4">
                        <Label className="text-sm font-semibold text-gray-700">
                            Hình thức nhập sách
                        </Label>
                        <RadioGroup
                            value={formData.type || 'existing'}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    type: value as 'existing' | 'new',
                                })
                            }
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem
                                    value="existing"
                                    id="existingBook"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="existingBook"
                                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 hover:bg-gray-50 cursor-pointer transition-all ${
                                        !formData.type ||
                                        formData.type === 'existing'
                                            ? 'border-orange-500 bg-orange-50/50 text-orange-700'
                                            : 'border-gray-200 text-gray-600'
                                    }`}
                                >
                                    <span className="font-medium text-sm">
                                        Thêm sách đã có
                                    </span>
                                    <span className="text-xs font-normal opacity-70 mt-1">
                                        Cập nhật số lượng kho
                                    </span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="new"
                                    id="newBook"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="newBook"
                                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 hover:bg-gray-50 cursor-pointer transition-all ${
                                        formData.type === 'new'
                                            ? 'border-orange-500 bg-orange-50/50 text-orange-700'
                                            : 'border-gray-200 text-gray-600'
                                    }`}
                                >
                                    <span className="font-medium text-sm">
                                        Nhập sách mới
                                    </span>
                                    <span className="text-xs font-normal opacity-70 mt-1">
                                        Tạo thông tin sách mới
                                    </span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="pt-2">
                        {formData.type === 'existing' && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-700">
                                    Thông tin sách đã có
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label
                                            htmlFor="bookCode"
                                            className="text-sm font-medium"
                                        >
                                            Mã sách{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="bookCode"
                                            value={formData.bookCode || ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    bookCode: e.target.value,
                                                })
                                            }
                                            placeholder="Nhập hoặc quét mã sách..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="existingImportPrice"
                                            className="text-sm font-medium"
                                        >
                                            Giá nhập (VNĐ)
                                        </Label>
                                        <Input
                                            id="existingImportPrice"
                                            type="number"
                                            value={formData.importPrice || ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    importPrice:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="existingQuantity"
                                            className="text-sm font-medium"
                                        >
                                            Số lượng nhập
                                        </Label>
                                        <Input
                                            id="existingQuantity"
                                            type="number"
                                            value={formData.quantity || ''}
                                            onChange={(e) => {
                                                const qty =
                                                    parseInt(e.target.value) ||
                                                    0;
                                                setFormData({
                                                    ...formData,
                                                    quantity: qty,
                                                    totalItems: qty,
                                                });
                                            }}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="col-span-2 flex justify-end mt-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleConfirmBookDetails}
                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                                        >
                                            Xác nhận thông tin sách
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData.type === 'new' && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-700">
                                    Thông tin sách mới
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="newBookCode"
                                            className="text-sm font-medium"
                                        >
                                            Mã sách{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="newBookCode"
                                            value={formData.newBookCode || ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    newBookCode: e.target.value,
                                                })
                                            }
                                            placeholder="VD: BK001"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="bookName"
                                            className="text-sm font-medium"
                                        >
                                            Tên sách{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="bookName"
                                            value={formData.bookName || ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    bookName: e.target.value,
                                                })
                                            }
                                            placeholder="Nhập tên sách..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            Tác giả
                                        </Label>
                                        <SearchableMultiSelect
                                            options={authorOptions}
                                            selectedIds={
                                                formData.authorIds || []
                                            }
                                            onSelectionChange={(ids) =>
                                                setFormData({
                                                    ...formData,
                                                    authorIds: ids,
                                                })
                                            }
                                            placeholder="Chọn tác giả..."
                                            searchPlaceholder="Tìm kiếm tác giả..."
                                            onSearch={handleAuthorSearch}
                                            isLoading={isLoadingAuthors}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            Thể loại
                                        </Label>
                                        <Select
                                            value={formData.category || ''}
                                            onValueChange={(val) =>
                                                setFormData({
                                                    ...formData,
                                                    category: val,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn thể loại..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category}
                                                    >
                                                        {BOOK_CATEGORIES_LABEL[
                                                            category as keyof typeof BOOK_CATEGORIES_LABEL
                                                        ] || category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                            NXB
                                        </Label>
                                        <SearchableMultiSelect
                                            options={publisherOptions}
                                            selectedIds={
                                                formData.publisherIds || []
                                            }
                                            onSelectionChange={(ids) =>
                                                setFormData({
                                                    ...formData,
                                                    publisherIds: ids,
                                                })
                                            }
                                            placeholder="Chọn nhà xuất bản..."
                                            searchPlaceholder="Tìm kiếm NXB..."
                                            onSearch={handlePublisherSearch}
                                            isLoading={isLoadingPublishers}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="year"
                                            className="text-sm font-medium"
                                        >
                                            Năm xuất bản
                                        </Label>
                                        <Input
                                            id="year"
                                            type="number"
                                            value={formData.year || ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    year: e.target.value,
                                                })
                                            }
                                            placeholder={new Date()
                                                .getFullYear()
                                                .toString()}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="importPrice"
                                            className="text-sm font-medium"
                                        >
                                            Giá nhập (VNĐ)
                                        </Label>
                                        <Input
                                            id="importPrice"
                                            type="number"
                                            value={formData.importPrice || ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    importPrice:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="quantity"
                                            className="text-sm font-medium"
                                        >
                                            Số lượng nhập
                                        </Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={formData.quantity || ''}
                                            onChange={(e) => {
                                                const qty =
                                                    parseInt(e.target.value) ||
                                                    0;
                                                setFormData({
                                                    ...formData,
                                                    quantity: qty,
                                                    totalItems: qty,
                                                });
                                            }}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="col-span-2 flex justify-end mt-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleConfirmBookDetails}
                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                                        >
                                            Xác nhận thông tin sách
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t">
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
                                    value={formData.date || ''}
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
                                    value={formData.time || ''}
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
                                htmlFor={`${isEdit ? 'edit-' : ''}totalAmount`}
                                className="text-sm font-medium"
                            >
                                Tổng tiền (VNĐ)
                            </Label>
                            <Input
                                id={`${isEdit ? 'edit-' : ''}totalAmount`}
                                type="number"
                                value={formData.totalAmount || ''}
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
                                value={formData.createdBy || ''}
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
                                value={formData.status || ''}
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
                                value={formData.note || ''}
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
