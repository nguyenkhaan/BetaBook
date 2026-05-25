import { useState } from 'react';
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
import toast from 'react-hot-toast';

function CreateBook({
    isDialogOpen,
    setDialogOpen,
}: {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
}) {
    // Book form data
    const [bookFormData, setBookFormData] = useState({
        bookCode: '',
        title: '',
        author: '',
        category: '',
        publisher: '',
        price: '',
        stock: '',
        year: '',
    });
    // Book handler
    const handleAddBookQuick = () => {
        if (bookFormData.title && bookFormData.author && bookFormData.price) {
            toast.success('Sách mới đã được thêm thành công!');
            setDialogOpen(false);
            setBookFormData({
                bookCode: '',
                title: '',
                author: '',
                category: '',
                publisher: '',
                price: '',
                stock: '',
                year: '',
            });
        } else {
            toast.error(
                'Vui lòng nhập đầy đủ thông tin cơ bản (Tên sách, Tác giả, Giá)!',
            );
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
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
                            value={bookFormData.bookCode}
                            onChange={(e) =>
                                setBookFormData({
                                    ...bookFormData,
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
                            value={bookFormData.title}
                            onChange={(e) =>
                                setBookFormData({
                                    ...bookFormData,
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
                            value={bookFormData.author}
                            onChange={(e) =>
                                setBookFormData({
                                    ...bookFormData,
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
                            value={bookFormData.category}
                            onChange={(e) =>
                                setBookFormData({
                                    ...bookFormData,
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
                            value={bookFormData.publisher}
                            onChange={(e) =>
                                setBookFormData({
                                    ...bookFormData,
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
                            value={bookFormData.price}
                            onChange={(e) =>
                                setBookFormData({
                                    ...bookFormData,
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
                            value={bookFormData.stock}
                            onChange={(e) =>
                                setBookFormData({
                                    ...bookFormData,
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
                            value={bookFormData.year}
                            onChange={(e) =>
                                setBookFormData({
                                    ...bookFormData,
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
                        onClick={() => setDialogOpen(false)}
                    >
                        Hủy bỏ
                    </Button>
                    <Button type="button" onClick={handleAddBookQuick}>
                        Thêm sách
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default CreateBook;
