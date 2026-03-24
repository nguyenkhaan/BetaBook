import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Statistic } from './components/Statistic';
import { FilterBar } from './components/FilterBar';
import { BookTable } from './components/BookTable';
import { BookDialogs } from './components/BookDialogs';
import { ExcelImportDialog } from './components/ExcelImportDialog';

export interface BookItem {
    id: number;
    bookCode: string;
    title: string;
    author: string;
    category: string;
    price: number;
    stock: number;
    publisher: string;
    year: number;
}

const mockBooks: BookItem[] = [
    {
        id: 1,
        bookCode: 'BK001',
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        category: 'Kỹ năng sống',
        price: 120000,
        stock: 45,
        publisher: 'NXB Tổng Hợp',
        year: 2024,
    },
    {
        id: 2,
        bookCode: 'BK002',
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        category: 'Tiểu thuyết',
        price: 95000,
        stock: 32,
        publisher: 'NXB Văn Học',
        year: 2023,
    },
    {
        id: 3,
        bookCode: 'BK003',
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        category: 'Lịch sử',
        price: 180000,
        stock: 28,
        publisher: 'NXB Tri Thức',
        year: 2024,
    },
    {
        id: 4,
        bookCode: 'BK004',
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Kỹ năng sống',
        price: 150000,
        stock: 52,
        publisher: 'NXB Thế Giới',
        year: 2024,
    },
    {
        id: 5,
        bookCode: 'BK005',
        title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        category: 'Kỹ năng sống',
        price: 85000,
        stock: 67,
        publisher: 'NXB Hội Nhà Văn',
        year: 2023,
    },
];

export function BooksPage() {
    const [books, setBooks] = useState<BookItem[]>(mockBooks);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
    const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');

    const [formData, setFormData] = useState({
        bookCode: '',
        title: '',
        author: '',
        category: '',
        publisher: '',
        price: '',
        stock: '',
        year: '2026',
    });

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === '' ||
            selectedCategory === 'Tất cả' ||
            book.category === selectedCategory;

        let matchesPrice = true;
        if (selectedPriceRange === '<100.000') {
            matchesPrice = book.price < 100000;
        } else if (selectedPriceRange === '100.000 - 200.000') {
            matchesPrice = book.price >= 100000 && book.price <= 200000;
        } else if (selectedPriceRange === '200.000 - 500.000') {
            matchesPrice = book.price > 200000 && book.price <= 500000;
        } else if (selectedPriceRange === 'Hơn 500.000') {
            matchesPrice = book.price > 500000;
        }

        return matchesSearch && matchesCategory && matchesPrice;
    });

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedPriceRange('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            toast.success(`Đã chọn file: ${file.name}`);
        }
    };

    const handleAddBook = () => {
        const newBook: BookItem = {
            id: books.length + 1,
            bookCode:
                formData.bookCode ||
                'BK' + (books.length + 1).toString().padStart(3, '0'),
            title: formData.title,
            author: formData.author,
            category: formData.category,
            publisher: formData.publisher,
            price: parseInt(formData.price),
            stock: parseInt(formData.stock),
            year: parseInt(formData.year),
        };
        setBooks([...books, newBook]);
        setIsAddDialogOpen(false);
        setFormData({
            bookCode: '',
            title: '',
            author: '',
            category: '',
            publisher: '',
            price: '',
            stock: '',
            year: '2026',
        });
        toast.success('Đã thêm sách mới thành công!');
    };

    const handleEditBook = () => {
        if (!selectedBook) return;
        const updatedBooks = books.map((book) =>
            book.id === selectedBook.id
                ? {
                      ...book,
                      title: formData.title,
                      author: formData.author,
                      category: formData.category,
                      publisher: formData.publisher,
                      price: parseInt(formData.price),
                      stock: parseInt(formData.stock),
                      year: parseInt(formData.year),
                  }
                : book,
        );
        setBooks(updatedBooks);
        setIsEditDialogOpen(false);
        setSelectedBook(null);
        toast.success('Đã cập nhật thông tin sách thành công!');
    };

    const handleDeleteBook = () => {
        if (!selectedBook) return;
        setBooks(books.filter((book) => book.id !== selectedBook.id));
        setIsDeleteDialogOpen(false);
        setSelectedBook(null);
        toast.success('Đã xóa sách thành công!');
    };

    const openEditDialog = (book: BookItem) => {
        setSelectedBook(book);
        setFormData({
            bookCode: book.bookCode,
            title: book.title,
            author: book.author,
            category: book.category,
            publisher: book.publisher,
            price: book.price.toString(),
            stock: book.stock.toString(),
            year: book.year.toString(),
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
                totalBooks={books.length}
                totalStock={books.reduce((sum, book) => sum + book.stock, 0)}
                inventoryValue={books.reduce(
                    (sum, book) => sum + book.price * book.stock,
                    0,
                )}
                lowStockBooks={books.filter((b) => b.stock < 30).length}
            />

            <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                handleResetFilters={handleResetFilters}
            />

            <BookTable
                books={filteredBooks}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onView={openViewDialog}
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
            />
        </div>
    );
}
