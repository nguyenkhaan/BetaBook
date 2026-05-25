'use client';

import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Statistic } from './components/Statistic';
import { FilterBar } from './components/FilterBar';
import { BookTable } from './components/BookTable';
import { BookDialogs } from './components/BookDialogs';
import { BookService } from '../../services/book.service';
import { exportToPDF } from './components/ExportToExcel';

export const BookCategoryLabel: Record<string, string> = {
    VAN_HOC: 'Văn học',
    TRINH_THAM: 'Trinh thám',
    THIEU_NHI: 'Thiếu nhi',
    GIAO_DUC: 'Giáo dục',
    KINH_TE: 'Kinh tế',
    KY_NANG_SONG: 'Kỹ năng sống',
};

export interface BookItem {
    id: number;
    code: string;
    title: string;
    category: any;
    categoryName?: string;
    cost: number;
    coverImage?: string;
    publishers?: any[];
    year: number;
    stock: number;
    authors?: any[];
    author?: string;
    publisher?: string;
}

const formatNames = (data: any): string => {
    if (!data) return '';

    if (typeof data === 'string') {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                return parsed
                    .map(
                        (item: any) =>
                            item?.name ||
                            item?.fullName ||
                            item?.authorName ||
                            item?.publisherName ||
                            '',
                    )
                    .filter(Boolean)
                    .join(', ');
            }
        } catch (e) {
            return data;
        }
        return data;
    }

    if (Array.isArray(data)) {
        return data
            .map((item: any) => {
                if (!item) return '';
                if (typeof item === 'string') return item;
                return (
                    item.name ||
                    item.fullName ||
                    item.authorName ||
                    item.publisherName ||
                    item.author?.name ||
                    item.author?.fullName ||
                    item.publisher?.name ||
                    item.publisher?.fullName ||
                    ''
                );
            })
            .filter(Boolean)
            .join(', ');
    }

    if (typeof data === 'object') {
        return (
            data.name ||
            data.fullName ||
            data.authorName ||
            data.publisherName ||
            ''
        );
    }

    return String(data);
};

const resolveAuthor = (book: BookItem): string => {
    const fromArray = formatNames(book.authors);
    if (fromArray) return fromArray;
    const fromField = formatNames(book.author);
    if (fromField) return fromField;
    return 'N/A';
};

const resolvePublisher = (book: BookItem): string => {
    const fromArray = formatNames(book.publishers);
    if (fromArray) return fromArray;
    const fromField = formatNames(book.publisher);
    if (fromField) return fromField;
    return 'N/A';
};

export function BooksPage() {
    const [books, setBooks] = useState<BookItem[]>([]);
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [selectedPublisher, setSelectedPublisher] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [selectedStockStatus, setSelectedStockStatus] = useState('');

    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [publishers, setPublishers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        code: '',
        title: '',
        category: '',
        cost: '',
        stock: '',
        year: new Date().getFullYear().toString(),
        authorIds: [] as number[],
        publisherIds: [] as number[],
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [booksData, statsData] = await Promise.all([
                BookService.getAllBook(),
                BookService.getStatistics(),
            ]);

            const normalizedBooks = booksData.map((book: any) => {
                const categoryCode =
                    typeof book.category === 'string'
                        ? book.category.toUpperCase()
                        : book.category?.code || '';

                const mappedAuthor =
                    formatNames(book.authors) || formatNames(book.author);
                const mappedPublisher =
                    formatNames(book.publishers) || formatNames(book.publisher);

                return {
                    ...book,
                    category: book.category,
                    categoryName:
                        BookCategoryLabel[categoryCode] || categoryCode,
                    author: mappedAuthor,
                    publisher: mappedPublisher,
                };
            });

            setBooks(normalizedBooks);
            setStatistics(statsData);
        } catch (error: any) {
            toast.error('Không thể tải dữ liệu từ máy chủ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilterData = async () => {
        try {
            const [categoryData, authorData, publisherData] = await Promise.all(
                [
                    BookService.getCategories(),
                    BookService.getAllAuthors(),
                    BookService.getAllPublishers(),
                ],
            );
            setCategories(categoryData);
            setAuthors(authorData);
            setPublishers(publisherData);
        } catch (error: any) {
            console.error(
                'Không thể tải dữ liệu bộ lọc',
                error.message || error,
            );
        }
    };

    useEffect(() => {
        fetchData();
        fetchFilterData();
    }, []);

const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.code.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            !selectedCategory ||
            selectedCategory === 'Tất cả' ||
            book.categoryName === selectedCategory ||
            (typeof book.category === 'string' &&
                book.category === selectedCategory) ||
            (typeof book.category === 'object' &&
                book.category !== null &&
                ((book.category as any).code === selectedCategory ||
                    (book.category as any).name === selectedCategory));

        const matchesAuthor =
            !selectedAuthor ||
            selectedAuthor === 'Tất cả' ||
            (book.author?.toLowerCase() || '').includes(
                selectedAuthor.toLowerCase(),
            );

        const matchesPublisher =
            !selectedPublisher ||
            selectedPublisher === 'Tất cả' ||
            (book.publisher?.toLowerCase() || '').includes(
                selectedPublisher.toLowerCase(),
            );

        let matchesPrice = true;
        if (selectedPriceRange === '0-100000') {
            matchesPrice = book.cost < 100000;
        } else if (selectedPriceRange === '100000-200000') {
            matchesPrice = book.cost >= 100000 && book.cost <= 200000;
        } else if (selectedPriceRange === '200000-500000') {
            matchesPrice = book.cost > 200000 && book.cost <= 500000;
        } else if (selectedPriceRange === '500000+') {
            matchesPrice = book.cost > 500000;
        }

        let matchesStock = true;
        if (selectedStockStatus === 'Dưới 30') {
            matchesStock = book.stock < 30;
        } else if (selectedStockStatus === '30 - 100') {
            matchesStock = book.stock >= 30 && book.stock <= 100;
        } else if (selectedStockStatus === '100-200') {
            matchesStock = book.stock > 100 && book.stock <= 200;
        } else if (selectedStockStatus === 'Trên 200') {
            matchesStock = book.stock > 200;
        }

        return (
            matchesSearch &&
            matchesCategory &&
            matchesAuthor &&
            matchesPublisher &&
            matchesPrice &&
            matchesStock
        );
    });

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedAuthor('');
        setSelectedPublisher('');
        setSelectedPriceRange('');
        setSelectedStockStatus('');
    };

    const handleAddBook = async (file?: File) => {
        try {
            const payload = {
                ...formData,
                cost: Number(formData.cost),
                stock: Number(formData.stock),
                year: Number(formData.year),
                authorIds: JSON.stringify(
                    formData.authorIds.filter(
                        (id): id is number => id !== undefined && id !== null,
                    ),
                ),
                publisherIds: JSON.stringify(
                    formData.publisherIds.filter(
                        (id): id is number => id !== undefined && id !== null,
                    ),
                ),
            };
            await BookService.createBook(payload, file);
            toast.success('Đã thêm sách mới thành công!');
            setIsAddDialogOpen(false);
            fetchData();
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
        } catch (error: any) {
            toast.error(error.message || 'Lỗi khi thêm sách');
        }
    };

    const handleEditBook = async (file?: File) => {
        if (!selectedBook) return;
        try {
            const payload = {
                ...formData,
                cost: Number(formData.cost),
                stock: Number(formData.stock),
                year: Number(formData.year),
                authorIds: JSON.stringify(
                    formData.authorIds.filter(
                        (id): id is number => id !== undefined && id !== null,
                    ),
                ),
                publisherIds: JSON.stringify(
                    formData.publisherIds.filter(
                        (id): id is number => id !== undefined && id !== null,
                    ),
                ),
            };
            await BookService.updateBook(selectedBook.id, payload, file);
            toast.success('Cập nhật thành công');
            setIsEditDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error('Lỗi xuất hiện khi cập nhật: ' + error.message);
        }
    };

    const handleDeleteBook = async () => {
        if (!selectedBook) return;
        try {
            await BookService.deleteBook(selectedBook.id);
            toast.success('Đã xoá sách thành công!');
            setIsDeleteDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error('Có lỗi xuất hiện khi xoá: ' + error.message);
        }
    };

    const exportBooksToPDF = async () => {
        try {
            if (filteredBooks.length === 0) {
                toast.error('Không có dữ liệu để xuất!');
                return;
            }

            const exportData = filteredBooks.map((book) => ({
                'Mã sách': book.code,
                'Tên sách': book.title,
                'Thể loại': book.categoryName || book.category || 'N/A',
                'Tác giả': resolveAuthor(book),
                'Nhà xuất bản': resolvePublisher(book),
                'Năm xuất bản': book.year || 'N/A',
                'Giá bán (VNĐ)': book.cost || 0,
                'Tồn kho': book.stock || 0,
            }));

            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `Danh_sach_sach_${currentDate}.pdf`;

            await exportToPDF(exportData, fileName, 'DANH SÁCH QUẢN LÝ SÁCH');

            toast.success(
                `Đã xuất ${filteredBooks.length} quyển sách ra file PDF!`,
            );
        } catch (error: any) {
            console.error('Error exporting to PDF:', error);
            toast.error('Có lỗi xảy ra khi xuất file PDF');
        }
    };

    const openEditDialog = (book: BookItem) => {
        setSelectedBook(book);

        const categoryValue =
            typeof book.category === 'string'
                ? book.category
                : (book.category as any)?.code || '';

        setFormData({
            code: book.code,
            title: book.title,
            category: categoryValue,
            cost: book.cost.toString(),
            stock: (book.stock || 0).toString(),
            year: book.year.toString(),
            authorIds:
                book.authors?.map((a) => a.id || a.authorId || a.author?.id) ||
                [],
            publisherIds:
                book.publishers?.map(
                    (p) => p.id || p.publisherId || p.publisher?.id,
                ) || [],
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (book: BookItem) => {
        setSelectedBook(book);
        setIsDeleteDialogOpen(true);
    };

    const openViewDialog = (book: BookItem) => {
        setSelectedBook(book);
        setIsViewDialogOpen(true);
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý sách
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý kho sách của Beta Book
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        onClick={exportBooksToPDF}
                    >
                        <FileText className="w-4 cursor-pointer h-4 mr-2" />
                        Xuất PDF
                    </Button>
                </div>
            </div>

            <Statistic
                totalBooks={statistics?.totalBookTitle || books.length}
                totalStock={statistics?.totalQuantity || 0}
                inventoryValue={statistics?.totalStockValue || 0}
                lowStockBooks={statistics?.outOfStocks || 0}
            />

            <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedAuthor={selectedAuthor}
                setSelectedAuthor={setSelectedAuthor}
                selectedPublisher={selectedPublisher}
                setSelectedPublisher={setSelectedPublisher}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                selectedStockStatus={selectedStockStatus}
                setSelectedStockStatus={setSelectedStockStatus}
                handleResetFilters={handleResetFilters}
                allBooks={books}
                categories={categories}
                authors={authors}
                publishers={publishers}
                onSelectBook={(book) => {
                    openViewDialog(book);
                }}
            />

            <BookTable
                books={filteredBooks}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
                lowStockThreshold={30}
            />

            <BookDialogs
                isAddDialogOpen={isAddDialogOpen}
                setIsAddDialogOpen={setIsAddDialogOpen}
                isEditDialogOpen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                isDeleteDialogOpen={isDeleteDialogOpen}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                isViewDialogOpen={isViewDialogOpen}
                setIsViewDialogOpen={setIsViewDialogOpen}
                selectedBook={selectedBook}
                formData={formData}
                setFormData={setFormData}
                handleAddBook={handleAddBook}
                handleEditBook={handleEditBook}
                handleDeleteBook={handleDeleteBook}
            />
        </div>
    );
}
