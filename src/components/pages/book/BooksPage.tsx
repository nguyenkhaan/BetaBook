import { useState } from 'react';
import { Book, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select } from '../../ui/select';
import { toast } from 'sonner';

interface BookItem {
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

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBook = () => {
    const newBook: BookItem = {
      id: books.length + 1,
      bookCode: formData.bookCode || 'BK' + (books.length + 1).toString().padStart(3, '0'),
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
    setFormData({ bookCode: '', title: '', author: '', category: '', publisher: '', price: '', stock: '', year: '2026' });
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
        : book
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sách</h1>
          <p className="text-gray-600 mt-1">Quản lý kho sách của Beta Book</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Thêm sách mới
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách, tác giả hoặc thể loại..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng đầu sách</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{books.length}</p>
            </div>
            <Book className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng số lượng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {books.reduce((sum, book) => sum + book.stock, 0)}
              </p>
            </div>
            <Book className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Giá trị kho</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(books.reduce((sum, book) => sum + book.price * book.stock, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <Book className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sắp hết hàng</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {books.filter((b) => b.stock < 30).length}
              </p>
            </div>
            <Book className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã sách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tác giả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thể loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NXB
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                  {book.bookCode}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {book.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {book.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {book.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {book.publisher}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {book.price.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.stock < 30
                        ? 'bg-red-100 text-red-800'
                        : book.stock < 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {book.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(book)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(book)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openViewDialog(book)}>
                      <Eye className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm sách mới</DialogTitle>
            <DialogDescription>
              Thêm thông tin sách mới vào kho của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bookCode">Mã sách</Label>
              <Input
                id="bookCode"
                value={formData.bookCode}
                onChange={(e) => setFormData({ ...formData, bookCode: e.target.value })}
                className="col-span-3"
                placeholder="VD: BK001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title">Tên sách</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author">Tác giả</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category">Thể loại</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="publisher">NXB</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input
                id="stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year">Năm xuất bản</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleAddBook}>
              Thêm sách
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật thông tin sách</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin sách trong kho của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title">Tên sách</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author">Tác giả</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category">Thể loại</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="publisher">NXB</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input
                id="stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year">Năm xuất bản</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleEditBook}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Book Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa sách</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sách này khỏi kho không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleDeleteBook} className="bg-red-500 hover:bg-red-600">
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Book Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông tin sách</DialogTitle>
            <DialogDescription>
              Xem thông tin chi tiết về sách này.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="viewBookCode">Mã sách</Label>
              <Input
                id="viewBookCode"
                value={selectedBook?.bookCode || ''}
                readOnly
                className="col-span-3 bg-gray-50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title">Tên sách</Label>
              <Input
                id="title"
                value={selectedBook?.title || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author">Tác giả</Label>
              <Input
                id="author"
                value={selectedBook?.author || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category">Thể loại</Label>
              <Input
                id="category"
                value={selectedBook?.category || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="publisher">NXB</Label>
              <Input
                id="publisher"
                value={selectedBook?.publisher || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                value={selectedBook?.price.toLocaleString('vi-VN') + 'đ' || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input
                id="stock"
                value={selectedBook?.stock.toString() || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year">Năm xuất bản</Label>
              <Input
                id="year"
                value={selectedBook?.year.toString() || ''}
                readOnly
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}