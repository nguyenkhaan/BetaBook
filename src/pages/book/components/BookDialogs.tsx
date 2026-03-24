import React from 'react';
import { BookItem } from '../BooksPage';
import { Button } from '../../../components/ui/button';
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
    handleAddBook: () => void;
    handleEditBook: () => void;
    handleDeleteBook: () => void;
}

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
    return (
        <>
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
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bookCode: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder="VD: BK001"
                            />
                        </div>
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="author">Tác giả</Label>
                            <Input
                                id="author"
                                value={formData.author}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        author: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category">Thể loại</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="publisher">NXB</Label>
                            <Input
                                id="publisher"
                                value={formData.publisher}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        publisher: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price">Giá</Label>
                            <Input
                                id="price"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock">Tồn kho</Label>
                            <Input
                                id="stock"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stock: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="year">Năm xuất bản</Label>
                            <Input
                                id="year"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        year: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleAddBook}>
                            Thêm sách
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="author">Tác giả</Label>
                            <Input
                                id="author"
                                value={formData.author}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        author: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category">Thể loại</Label>
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="publisher">NXB</Label>
                            <Input
                                id="publisher"
                                value={formData.publisher}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        publisher: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price">Giá</Label>
                            <Input
                                id="price"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock">Tồn kho</Label>
                            <Input
                                id="stock"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        stock: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="year">Năm xuất bản</Label>
                            <Input
                                id="year"
                                value={formData.year}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        year: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleEditBook}>
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
                                value={
                                    selectedBook?.price.toLocaleString(
                                        'vi-VN',
                                    ) + 'đ' || ''
                                }
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
