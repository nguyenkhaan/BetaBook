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
import { Trash2 } from 'lucide-react';
import { BookCategoryLabel, ImportStatusLabel } from '../../../utilis/label_mapper';
import { toast } from 'sonner';

interface ExistingBookOption {
    id: number;
    code: string;
    title: string;
    cost?: number;
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
    const [authorOptions, setAuthorOptions] = useState<SearchableOption[]>([]);
    const [publisherOptions, setPublisherOptions] = useState<
        SearchableOption[]
    >([]);
    const [existingBooks, setExistingBooks] = useState<ExistingBookOption[]>(
        [],
    );
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
    const [isLoadingPublishers, setIsLoadingPublishers] = useState(false);
    const [isLoadingBooks, setIsLoadingBooks] = useState(false);

    const [bookInput, setBookInput] = useState({
        type: 'existing' as 'existing' | 'new',
        bookCode: '',
        newBookCode: '',
        bookName: '',
        category: '',
        authorIds: [] as number[],
        publisherIds: [] as number[],
        year: new Date().getFullYear().toString(),
        importPrice: '' as number | string,
        quantity: '' as number | string,
    });

    useEffect(() => {
        loadAuthorsAndPublishers();
        loadExistingBooks();
        loadCategories();
    }, []);

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

    const loadExistingBooks = async () => {
        try {
            setIsLoadingBooks(true);
            const books = await BookService.getAllBook();
            setExistingBooks(
                (books || []).map((book: any) => ({
                    id: book.id,
                    code: book.code,
                    title: book.title,
                    cost: Number(book.cost || 0),
                })),
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingBooks(false);
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

    const updateFormDataTotals = (newDetails: any[]) => {
        const newTotalItems = newDetails.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0,
        );
        const newTotalAmount = newDetails.reduce(
            (sum, item) =>
                sum +
                Number(item.quantity || 0) * Number(item.importPrice || 0),
            0,
        );

        setFormData({
            ...formData,
            details: newDetails,
            totalItems: newTotalItems,
            totalAmount: newTotalAmount,
        });
    };

    const selectedExistingBook = existingBooks.find(
        (book) => book.code === bookInput.bookCode,
    );

    const handleAddBookToList = () => {
        const qty = Number(bookInput.quantity);
        const price = Number(bookInput.importPrice);

        if (!qty || qty <= 0 || !bookInput.importPrice || price < 0) {
            toast.error('Vui lòng nhập số lượng và giá nhập hợp lệ');
            return;
        }

        if (bookInput.type === 'existing' && !bookInput.bookCode.trim()) {
            toast.error('Vui lòng nhập mã sách');
            return;
        }

        if (
            bookInput.type === 'new' &&
            (!bookInput.newBookCode.trim() || !bookInput.bookName.trim())
        ) {
            toast.error('Vui lòng nhập đầy đủ mã sách và tên sách mới');
            return;
        }
    
        const currentDetails = formData.details || [];
        const existingIndex = currentDetails.findIndex(
            (item: any) =>
                (bookInput.type === 'existing' &&
                    item.bookCode === bookInput.bookCode) ||
                (bookInput.type === 'new' &&
                    item.newBookCode === bookInput.newBookCode),
        );

        let newDetails = [...currentDetails];
        if (existingIndex >= 0) {
            newDetails[existingIndex].quantity += qty;
            newDetails[existingIndex].importPrice = price;
        } else {
            newDetails.push({
                ...bookInput,
                quantity: qty,
                importPrice: price,
            });
        }

        updateFormDataTotals(newDetails);

        setBookInput({
            type: bookInput.type,
            bookCode: '',
            newBookCode: '',
            bookName: '',
            category: '',
            authorIds: [],
            publisherIds: [],
            year: new Date().getFullYear().toString(),
            importPrice: '',
            quantity: '',
        });

        toast.success('Đã thêm sách vào phiếu nhập');
    };

    const handleUpdateBookInList = (
        index: number,
        field: 'quantity' | 'importPrice',
        value: number,
    ) => {
        const currentDetails = [...(formData.details || [])];
        if (value < 0) return;

        currentDetails[index] = { ...currentDetails[index], [field]: value };
        updateFormDataTotals(currentDetails);
    };

    const handleRemoveBookFromList = (index: number) => {
        const currentDetails = [...(formData.details || [])];
        currentDetails.splice(index, 1);
        updateFormDataTotals(currentDetails);
    };
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Nhà cung cấp
                            </Label>
                            <Select
                                value={
                                    formData.supplierId
                                        ? String(formData.supplierId)
                                        : undefined
                                }
                                onValueChange={(value) => {
                                    const selectedPublisher =
                                        publisherOptions.find(
                                            (publisher) =>
                                                String(publisher.id) === value,
                                        );

                                    setFormData({
                                        ...formData,
                                        supplier:
                                            selectedPublisher?.label || '',
                                        supplierId: Number(value),
                                    });
                                }}
                            >
                                <SelectTrigger className="w-full bg-white">
                                    {/* <SelectValue
                                        placeholder={
                                            isLoadingPublishers
                                                ? 'Đang tải nhà cung cấp...'
                                                : 'Chọn nhà cung cấp'
                                        }
                                    /> */}
                                    {formData.supplier? formData.supplier : 'Chọn nhà cung cấp'}
                                </SelectTrigger>
                                <SelectContent>
                                    {publisherOptions.map((publisher) => (
                                        <SelectItem
                                            key={publisher.id}
                                            value={String(publisher.id)}
                                        >
                                            {publisher.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-gray-800">
                                    Thêm sách vào phiếu
                                </Label>
                                <RadioGroup
                                    value={bookInput.type}
                                    onValueChange={(value) =>
                                        setBookInput({
                                            ...bookInput,
                                            type: value as 'existing' | 'new',
                                        })
                                    }
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="existing"
                                            id="existingBook"
                                        />
                                        <Label
                                            htmlFor="existingBook"
                                            className="text-sm cursor-pointer"
                                        >
                                            Sách đã có
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="new"
                                            id="newBook"
                                        />
                                        <Label
                                            htmlFor="newBook"
                                            className="text-sm cursor-pointer"
                                        >
                                            Sách mới
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                                {bookInput.type === 'existing' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="bookCode"
                                                className="text-xs font-medium text-gray-600"
                                            >
                                                Mã sách{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={
                                                    bookInput.bookCode ||
                                                    undefined
                                                }
                                                onValueChange={(value) => {
                                                    const selectedBook =
                                                        existingBooks.find(
                                                            (book) =>
                                                                book.code ===
                                                                value,
                                                        );
                                                    setBookInput({
                                                        ...bookInput,
                                                        bookCode: value,
                                                        bookName:
                                                            selectedBook?.title ||
                                                            '',
                                                    });
                                                }}
                                            >
                                                <SelectTrigger className="w-full bg-white">
                                                    <SelectValue
                                                        placeholder={
                                                            isLoadingBooks
                                                                ? 'Đang tải sách...'
                                                                : 'Chọn mã sách'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {existingBooks.map(
                                                        (book) => (
                                                            <SelectItem
                                                                key={book.id}
                                                                value={
                                                                    book.code
                                                                }
                                                            >
                                                                {book.code} -{' '}
                                                                {book.title}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {selectedExistingBook && (
                                                <p className="text-xs text-gray-500">
                                                    {selectedExistingBook.title}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="existingImportPrice"
                                                className="text-xs font-medium text-gray-600"
                                            >
                                                Giá nhập (VNĐ)
                                            </Label>
                                            <Input
                                                id="existingImportPrice"
                                                type="number"
                                                value={bookInput.importPrice}
                                                onChange={(e) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        importPrice:
                                                            e.target.value ===
                                                            ''
                                                                ? ''
                                                                : parseInt(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                    })
                                                }
                                                placeholder="0"
                                            />
                                            {selectedExistingBook?.cost ? (
                                                <p className="text-xs text-gray-500">
                                                    Giá bán hiện tại:{' '}
                                                    {selectedExistingBook.cost.toLocaleString(
                                                        'vi-VN',
                                                    )}
                                                    đ
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="existingQuantity"
                                                className="text-xs font-medium text-gray-600"
                                            >
                                                Số lượng
                                            </Label>
                                            <Input
                                                id="existingQuantity"
                                                type="number"
                                                value={bookInput.quantity}
                                                onChange={(e) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        quantity:
                                                            e.target.value ===
                                                            ''
                                                                ? ''
                                                                : parseInt(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                    })
                                                }
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                )}

                                {bookInput.type === 'new' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="newBookCode"
                                                className="text-xs font-medium text-gray-600"
                                            >
                                                Mã sách{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="newBookCode"
                                                value={bookInput.newBookCode}
                                                onChange={(e) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        newBookCode:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="VD: BK001"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="bookName"
                                                className="text-xs font-medium text-gray-600"
                                            >
                                                Tên sách{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="bookName"
                                                value={bookInput.bookName}
                                                onChange={(e) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        bookName:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Nhập tên sách..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium text-gray-600">
                                                Tác giả
                                            </Label>
                                            <SearchableMultiSelect
                                                options={authorOptions}
                                                selectedIds={
                                                    bookInput.authorIds
                                                }
                                                onSelectionChange={(ids) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        authorIds: ids,
                                                    })
                                                }
                                                placeholder="Chọn tác giả..."
                                                searchPlaceholder="Tìm kiếm..."
                                                onSearch={handleAuthorSearch}
                                                isLoading={isLoadingAuthors}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium text-gray-600">
                                                Thể loại
                                            </Label>
                                            <Select
                                                value={bookInput.category}
                                                onValueChange={(val) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        category: val,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    
                                                    {bookInput.category? BookCategoryLabel[bookInput.category] : 'Chọn thể lại'}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {BookCategoryLabel[
                                                                    category as keyof typeof BOOK_CATEGORIES_LABEL
                                                                ] || category}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-medium text-gray-600">
                                                Nhà xuất bản
                                            </Label>
                                            <SearchableMultiSelect
                                                options={publisherOptions}
                                                selectedIds={
                                                    bookInput.publisherIds
                                                }
                                                onSelectionChange={(ids) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        publisherIds: ids,
                                                    })
                                                }
                                                placeholder="Chọn NXB..."
                                                searchPlaceholder="Tìm kiếm..."
                                                onSearch={handlePublisherSearch}
                                                isLoading={isLoadingPublishers}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="year"
                                                className="text-xs font-medium text-gray-600"
                                            >
                                                Năm XB
                                            </Label>
                                            <Input
                                                id="year"
                                                type="number"
                                                value={bookInput.year}
                                                onChange={(e) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        year: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="importPrice"
                                                className="text-xs font-medium text-gray-600"
                                            >
                                                Giá nhập (VNĐ)
                                            </Label>
                                            <Input
                                                id="importPrice"
                                                type="number"
                                                value={bookInput.importPrice}
                                                onChange={(e) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        importPrice:
                                                            e.target.value ===
                                                            ''
                                                                ? ''
                                                                : parseInt(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                    })
                                                }
                                                placeholder="0"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="quantity"
                                                className="text-xs font-medium text-gray-600"
                                            >
                                                Số lượng
                                            </Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                value={bookInput.quantity}
                                                onChange={(e) =>
                                                    setBookInput({
                                                        ...bookInput,
                                                        quantity:
                                                            e.target.value ===
                                                            ''
                                                                ? ''
                                                                : parseInt(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                    })
                                                }
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="button"
                                    onClick={handleAddBookToList}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    Thêm xuống danh sách
                                </Button>
                            </div>
                        </div>
                    </div>

                    {formData.details && formData.details.length > 0 && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left table-fixed">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="w-[30%] px-4 py-3 font-medium">
                                            Mã sách
                                        </th>
                                        <th className="w-[15%] px-4 py-3 font-medium text-center">
                                            Loại
                                        </th>
                                        <th className="w-[18%] px-4 py-3 font-medium text-right">
                                            SL
                                        </th>
                                        <th className="w-[22%] px-4 py-3 font-medium text-right">
                                            Đơn giá
                                        </th>
                                        <th className="w-[20%] px-4 py-3 font-medium text-right">
                                            Thành tiền
                                        </th>
                                        <th className="w-[5%] px-4 py-3 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {formData.details.map(
                                        (item: any, idx: number) => (
                                            <tr
                                                key={idx}
                                                className="bg-white hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3 font-medium truncate">
                                                    {item.type === 'existing'
                                                        ? item.bookCode
                                                        : item.newBookCode}
                                                </td>
                                                <td className="px-4 py-3 text-center text-xs">
                                                    <span
                                                        className={`px-2 py-1 rounded-full ${
                                                            item.type ===
                                                            'existing'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-purple-100 text-purple-700'
                                                        }`}
                                                    >
                                                        {item.type ===
                                                        'existing'
                                                            ? 'Cũ'
                                                            : 'Mới'}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex justify-end">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            className="w-full max-w-14 text-right h-9 text-sm font-semibold border-gray-300 focus:border-orange-500"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateBookInList(
                                                                    idx,
                                                                    'quantity',
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="flex justify-end">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            className="w-full max-w-[130px] text-right h-9 text-sm font-semibold border-gray-300 focus:border-orange-500"
                                                            value={
                                                                item.importPrice
                                                            }
                                                            onChange={(e) =>
                                                                handleUpdateBookInList(
                                                                    idx,
                                                                    'importPrice',
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ) || 0,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-sm text-orange-600 truncate">
                                                    {(
                                                        item.quantity *
                                                        item.importPrice
                                                    ).toLocaleString()}
                                                    đ
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveBookFromList(
                                                                idx,
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
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
                                    
                                    {   
                                        !formData.status ? <SelectValue placeholder=''/>  : ImportStatusLabel[formData.status]
                                    }
                                     
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="COMPLETE">
                                        Hoàn thành
                                    </SelectItem>
                                    <SelectItem value="PENDING">
                                        Chờ xử lý
                                    </SelectItem>
                                    <SelectItem value="CANCEL">
                                        Đã hủy
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* <div className="space-y-2">
                            <Label
                                htmlFor={`${isEdit ? 'edit-' : ''}createdBy`}
                                className="text-sm font-medium"
                            >k
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
                            />
                        </div> */}
                        <div className="space-y-2 col-span-2">
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

                    <div className="flex justify-between items-center bg-orange-50 p-4 rounded-lg border border-orange-100 mt-2">
                        <div className="text-sm text-gray-700">
                            Tổng số lượng:{' '}
                            <span className="font-bold text-lg text-gray-900">
                                {formData.totalItems || 0}
                            </span>{' '}
                            cuốn
                        </div>
                        <div className="text-sm text-gray-700">
                            Tổng tiền:{' '}
                            <span className="font-bold text-xl text-orange-600">
                                {(formData.totalAmount || 0).toLocaleString()}đ
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 border-t pt-4">
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
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        disabled={
                            !formData.details || formData.details.length === 0
                        }
                    >
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
