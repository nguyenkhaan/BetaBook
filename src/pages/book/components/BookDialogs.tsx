import React, { useState, useEffect } from 'react';
import { BookItem } from '../BooksPage';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../components/ui/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import {
    SearchableMultiSelect,
    SearchableOption,
} from '../../../components/common/SearchableMultiSelect';
import { BOOK_CATEGORIES_LABEL } from '../../../bases/constants/book.constants';
import { BookService } from '../../../services/book.service';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookDialogsProps {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (isOpen: boolean) => void;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: (isOpen: boolean) => void;
    isDeleteDialogOpen: boolean;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    isViewDialogOpen: boolean;
    setIsViewDialogOpen: (isOpen: boolean) => void;
    selectedBook: BookItem | null;
    formData: any;
    setFormData: (data: any) => void;
    handleAddBook: (file?: File) => void;
    handleEditBook: (file?: File) => void;
    handleDeleteBook: () => void;
}

const PLACEHOLDER_IMAGE =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmQs8xbIseku59onHMpZ6bQ3XaeaSjeLgzMQ&s';

export function BookDialogs({
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedBook,
    formData,
    setFormData,
    handleAddBook,
    handleEditBook,
    handleDeleteBook,
}: BookDialogsProps) {
    // State management for images and search results
    const [addCoverImage, setAddCoverImage] = useState<File | null>(null);
    const [addCoverPreview, setAddCoverPreview] = useState<string>('');
    const [editCoverImage, setEditCoverImage] = useState<File | null>(null);
    const [editCoverPreview, setEditCoverPreview] = useState<string>('');

    const [authorOptions, setAuthorOptions] = useState<SearchableOption[]>([]);
    const [publisherOptions, setPublisherOptions] = useState<
        SearchableOption[]
    >([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
    const [isLoadingPublishers, setIsLoadingPublishers] = useState(false);

    // Initialize authors, publishers, and categories on component mount
    useEffect(() => {
        loadAuthorsAndPublishers();
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
            console.error('Error loading authors and publishers:', error);
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
            console.error('Error loading categories:', error);
        }
    };

    const handleAuthorSearch = async (query: string): Promise<SearchableOption[]> => {
        try {
            const results = await BookService.searchAuthors(query);
            return results.map((a: any) => ({
                id: a.id || a.authorId,
                label: a.name || a.authorName,
            }));
        } catch (error) {
            console.error('Error searching authors:', error);
            return [];
        }
    };

    const handlePublisherSearch = async (query: string): Promise<SearchableOption[]> => {
        try {
            const results = await BookService.searchPublishers(query);
            return results.map((p: any) => ({
                id: p.id || p.publisherId,
                label: p.name || p.publisherName,
            }));
        } catch (error) {
            console.error('Error searching publishers:', error);
            return [];
        }
    };

    const handleCoverImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'add' | 'edit',
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Định dạng ảnh không phù hợp');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file phải nhỏ hơn 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = event.target?.result as string;
                if (type === 'add') {
                    setAddCoverImage(file);
                    setAddCoverPreview(preview);
                } else {
                    setEditCoverImage(file);
                    setEditCoverPreview(preview);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveCoverImage = (type: 'add' | 'edit') => {
        if (type === 'add') {
            setAddCoverImage(null);
            setAddCoverPreview('');
        } else {
            setEditCoverImage(null);
            setEditCoverPreview('');
        }
    };

    const resetAddDialog = () => {
        setAddCoverImage(null);
        setAddCoverPreview('');
        setFormData({
            code: '',
            title: '',
            category: '',
            cost: '',
            stock: '',
            year: new Date().getFullYear().toString(),
            authorIds: [],
            publisherIds: [],
        });
    };

    const resetEditDialog = () => {
        setEditCoverImage(null);
        setEditCoverPreview('');
    };

    const handleAddBookClick = () => {
        handleAddBook(editCoverImage || undefined);
        // resetAddDialog();
    };

    const handleEditBookClick = () => {
        handleEditBook(editCoverImage || undefined);
        resetEditDialog();
    };

    const handleCloseAddDialog = () => {
        resetAddDialog();
        setIsAddDialogOpen(false);
    };

    const handleCloseEditDialog = () => {
        resetEditDialog();
        setIsEditDialogOpen(false);
    };

    return (
        <>
            {/* Add Book Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm sách mới</DialogTitle>
                        <DialogDescription>
                            Thêm thông tin sách mới vào kho của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Book Code */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bookCode">Mã sách</Label>
                            <Input
                                id="bookCode"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder="VD: BK001"
                            />
                        </div>

                        {/* Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title">Tên sách</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>

                        {/* Authors */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="authors">Tác giả</Label>
                            <div className="col-span-3">
                                <SearchableMultiSelect
                                    options={authorOptions}
                                    selectedIds={formData.authorIds}
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
                        </div>

                        {/* Category */}
                        <div className="grid grid-cols-4 w-full items-center gap-4">
                            <Label>Thể loại</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) =>
                                    setFormData({ ...formData, category: val })
                                }
                                className="col-span-3" // <--- This ensures the whole component fills the grid
                            >
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Chọn thể loại..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {BOOK_CATEGORIES_LABEL[category as keyof typeof BOOK_CATEGORIES_LABEL] || category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Publishers */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="publishers">NXB</Label>
                            <div className="col-span-3">
                                <SearchableMultiSelect
                                    options={publisherOptions}
                                    selectedIds={formData.publisherIds}
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
                        </div>

                        {/* Price */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price">Giá</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.cost}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cost: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder="0"
                            />
                        </div>

                        {/* Stock */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock">Tồn kho</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stock: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder="0"
                            />
                        </div>

                        {/* Year */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="year">Năm xuất bản</Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        year: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder={new Date()
                                    .getFullYear()
                                    .toString()}
                            />
                        </div>

                        {/* Cover Image Upload */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="mt-2 text-gray-700 font-semibold">
                                Bìa sách
                            </Label>
                            <div className="col-span-3">
                                {/* The actual input is hidden. We trigger it via the label's htmlFor or a ref */}
                                <input
                                    id="editCoverImage"
                                    type="file"
                                    accept="image/*"
                                    className="hidden" // Ensure this has no display
                                    onChange={(e) =>
                                        handleCoverImageChange(e, 'edit')
                                    }
                                />

                                <div className="relative group w-32 h-32">
                                    <div
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    'editCoverImage',
                                                )
                                                ?.click()
                                        }
                                        className={cn(
                                            'w-full h-full rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all flex items-center justify-center',
                                            editCoverPreview
                                                ? 'border-gray-200 hover:border-orange-400 shadow-sm'
                                                : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 bg-gray-50',
                                        )}
                                    >
                                        {editCoverPreview ? (
                                            <>
                                                <img
                                                    src={editCoverPreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Overlay: Icon only, no text */}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="w-8 h-8 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Upload className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Remove button (The small X) */}
                                    {editCoverPreview && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCoverImage('edit');
                                            }}
                                            className="absolute -top-2 -right-2 bg-white text-gray-500 p-1 rounded-full shadow-md border border-gray-200 hover:text-red-500 transition-colors z-10"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseAddDialog}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleAddBookClick}>
                            Thêm sách
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Book Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Cập nhật thông tin sách</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin sách trong kho của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editTitle">Tên sách</Label>
                            <Input
                                id="editTitle"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        {/* Authors */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="editAuthors">Tác giả</Label>
                            <div className="col-span-3">
                                <SearchableMultiSelect
                                    options={authorOptions}
                                    selectedIds={formData.authorIds}
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
                        </div>
                        {/* Category */}
                        <div className="grid grid-cols-4 w-full items-center gap-4">
                            <Label>Thể loại</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) =>
                                    setFormData({ ...formData, category: val })
                                }
                                className="col-span-3" // <--- This ensures the whole component fills the grid
                            >
                                <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Chọn thể loại..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {BOOK_CATEGORIES_LABEL[category as keyof typeof BOOK_CATEGORIES_LABEL] || category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Publishers */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="editPublishers">NXB</Label>
                            <div className="col-span-3">
                                <SearchableMultiSelect
                                    options={publisherOptions}
                                    selectedIds={formData.publisherIds}
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
                        </div>
                        {/* Price */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editPrice">Giá</Label>
                            <Input
                                id="editPrice"
                                type="number"
                                value={formData.cost}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        cost: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder="0"
                            />
                        </div>
                        {/* Stock */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editStock">Tồn kho</Label>
                            <Input
                                id="editStock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stock: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder="0"
                            />
                        </div>
                        {/* Year */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editYear">Năm xuất bản</Label>
                            <Input
                                id="editYear"
                                type="number"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        year: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder={new Date()
                                    .getFullYear()
                                    .toString()}
                            />
                        </div>
                        {/* Cover Image Upload */}
                        sách{' '}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="mt-2 text-gray-700 font-semibold">
                                Bìa sách
                            </Label>
                            <div className="col-span-3">
                                {/* The actual input is hidden. We trigger it via the label's htmlFor or a ref */}
                                <input
                                    id="editCoverImage"
                                    type="file"
                                    accept="image/*"
                                    className="hidden" // Ensure this has no display
                                    onChange={(e) =>
                                        handleCoverImageChange(e, 'edit')
                                    }
                                />

                                <div className="relative group w-32 h-32">
                                    <div
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    'editCoverImage',
                                                )
                                                ?.click()
                                        }
                                        className={cn(
                                            'w-full h-full rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all flex items-center justify-center',
                                            editCoverPreview
                                                ? 'border-gray-200 hover:border-orange-400 shadow-sm'
                                                : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50 bg-gray-50',
                                        )}
                                    >
                                        {editCoverPreview ? (
                                            <>
                                                <img
                                                    src={editCoverPreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Overlay: Icon only, no text */}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="w-8 h-8 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Upload className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Remove button (The small X) */}
                                    {editCoverPreview && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCoverImage('edit');
                                            }}
                                            className="absolute -top-2 -right-2 bg-white text-gray-500 p-1 rounded-full shadow-md border border-gray-200 hover:text-red-500 transition-colors z-10"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseEditDialog}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleEditBookClick}>
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xóa sách</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa sách này khỏi kho không?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDeleteBook}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Book Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thông tin sách</DialogTitle>
                        <DialogDescription>
                            Xem thông tin chi tiết về sách này.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Cover Image Display */}
                        <div className="flex justify-center">
                            <img
                                src={
                                    selectedBook?.coverImage ||
                                    PLACEHOLDER_IMAGE
                                }
                                alt={selectedBook?.title || 'Book Cover'}
                                className="w-32 h-48 object-cover rounded-lg shadow-md"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        PLACEHOLDER_IMAGE;
                                }}
                            />
                        </div>

                        {/* Book Code */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="viewBookCode">Mã sách</Label>
                            <Input
                                id="viewBookCode"
                                value={selectedBook?.code || ''}
                                readOnly
                                className="col-span-3 bg-gray-50"
                            />
                        </div>

                        {/* Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="viewTitle">Tên sách</Label>
                            <Input
                                id="viewTitle"
                                value={selectedBook?.title || ''}
                                readOnly
                                className="col-span-3 bg-gray-50"
                            />
                        </div>

                        {/* Authors */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label>Tác giả</Label>
                            <div className="col-span-3 bg-gray-50 border border-gray-300 rounded px-3 py-2">
                                <p className="text-sm">
                                    {selectedBook?.authors
                                        ?.map(
                                            (a: any) => a.name || a.authorName || a,
                                        )
                                        .join(', ') || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label>Thể loại</Label>
                            <Input
                                value={
                                    BOOK_CATEGORIES_LABEL[
                                        selectedBook?.category || ''
                                    ] ||
                                    selectedBook?.category ||
                                    ''
                                }
                                readOnly
                                className="col-span-3 bg-gray-50"
                            />
                        </div>

                        {/* Publishers */}
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label>NXB</Label>
                            <div className="col-span-3 bg-gray-50 border border-gray-300 rounded px-3 py-2">
                                <p className="text-sm">
                                    {selectedBook?.publishers
                                        ?.map(
                                            (p: any) =>
                                                p.name || p.publisherName || p,
                                        )
                                        .join(', ') || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="viewPrice">Giá</Label>
                            <Input
                                id="viewPrice"
                                value={
                                    selectedBook?.cost
                                        ? selectedBook.cost.toLocaleString(
                                              'vi-VN',
                                          ) + 'đ'
                                        : ''
                                }
                                readOnly
                                className="col-span-3 bg-gray-50"
                            />
                        </div>

                        {/* Stock */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="viewStock">Tồn kho</Label>
                            <Input
                                id="viewStock"
                                value={selectedBook?.stock?.toString() || ''}
                                readOnly
                                className="col-span-3 bg-gray-50"
                            />
                        </div>

                        {/* Year */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="viewYear">Năm xuất bản</Label>
                            <Input
                                id="viewYear"
                                value={selectedBook?.year?.toString() || ''}
                                readOnly
                                className="col-span-3 bg-gray-50"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsViewDialogOpen(false)}
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
