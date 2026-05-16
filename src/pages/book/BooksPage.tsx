import { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Statistic } from './components/Statistic';
import { FilterBar } from './components/FilterBar';
import { BookTable } from './components/BookTable';
import { BookDialogs } from './components/BookDialogs';
import { ExcelImportDialog } from './components/ExcelImportDialog';
import { BookService } from '../../services/book.service';

export interface BookItem {
    id: number;
    code: string;
    title: string;
    category: string;
    cost: number;
    coverImage?: string;
    publishers?: any[];
    year: number;
    stock: number;
    authors?: any[];
    author?: string;
    publisher?: string;
}

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
    const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            const normalizedBooks = booksData.map((book: any) => ({
                ...book,
                author:
                    book.author ||
                    book.authors?.[0]?.name ||
                    book.authors?.[0]?.authorName ||
                    book.authors?.[0]?.fullName,
                publisher:
                    book.publisher ||
                    book.publishers?.[0]?.name ||
                    book.publishers?.[0]?.publisherName ||
                    book.publishers?.[0]?.fullName,
            }));
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
            book.category === selectedCategory;

        const matchesAuthor =
            !selectedAuthor ||
            selectedAuthor === 'Tất cả' ||
            book.author === selectedAuthor ||
            !!book.authors?.some(
                (author: any) =>
                    author.name === selectedAuthor ||
                    author.authorName === selectedAuthor ||
                    author.fullName === selectedAuthor,
            );

        const matchesPublisher =
            !selectedPublisher ||
            selectedPublisher === 'Tất cả' ||
            book.publisher === selectedPublisher ||
            !!book.publishers?.some(
                (publisher: any) =>
                    publisher.name === selectedPublisher ||
                    publisher.publisherName === selectedPublisher ||
                    publisher.fullName === selectedPublisher,
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
        } else if (selectedStockStatus === 'Trên 100') {
            matchesStock = book.stock > 100;
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            toast.success(`Đã chọn file: ${file.name}`);
        }
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

    const handleImportExcel = async () => {
        if (!selectedFile) return;
        try {
            await BookService.importExcel(selectedFile);
            toast.success('Thêm danh sách bằng file excel thành công');
            setIsExcelDialogOpen(false);
            fetchData();
        } catch (error: any) {
            toast.error(
                'Lỗi khi thêm danh sách bằng file excel: ' + error.message,
            );
        }
    };

    const openEditDialog = (book: BookItem) => {
        setSelectedBook(book);
        setFormData({
            code: book.code,
            title: book.title,
            category: book.category,
            cost: book.cost.toString(),
            stock: (book.stock || 0).toString(),
            year: book.year.toString(),
            authorIds: book.authors?.map((a) => a.id || a.authorId) || [],
            publisherIds:
                book.publishers?.map((p) => p.id || p.publisherId) || [],
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
                        onClick={() => setIsExcelDialogOpen(true)}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Thêm danh sách sách
                    </Button>
                    <Button
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sách mới
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

            <ExcelImportDialog
                isExcelDialogOpen={isExcelDialogOpen}
                setIsExcelDialogOpen={setIsExcelDialogOpen}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                handleFileChange={handleFileChange}
                onImport={handleImportExcel}
            />
        </div>
    );
}
