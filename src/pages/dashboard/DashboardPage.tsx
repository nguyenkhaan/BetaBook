import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    FileText,
    BookOpen,
    UserPlus,
    Tag,
    BarChart3,
    Receipt,
    Settings,
    Plus,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardPageProps {
    onNavigate?: (page: string) => void;
}

// Mock discount codes for invoice
const mockDiscountCodes = [
    {
        id: 1,
        code: 'BOOK10',
        description: 'Giảm 10%',
        type: 'percentage',
        value: 10,
    },
    {
        id: 2,
        code: 'BOOK50K',
        description: 'Giảm 50,000đ',
        type: 'fixed',
        value: 50000,
    },
    {
        id: 3,
        code: 'VIP15',
        description: 'Giảm 15% cho VIP',
        type: 'percentage',
        value: 15,
    },
];

export function DashboardPage() {
    const onNavigate = (x : string) => {

    }
    const stats = [
        {
            title: 'Tổng doanh thu',
            value: '245,680,000đ',
            change: '+12.5%',
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Đơn hàng',
            value: '1,234',
            change: '+8.2%',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Khách hàng',
            value: '856',
            change: '+15.3%',
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Sách bán chạy',
            value: '342',
            change: '+23.1%',
            icon: BookOpen,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ];

    const recentOrders = [
        {
            id: 'HD001',
            customer: 'Nguyễn Văn A',
            amount: '450,000đ',
            status: 'Hoàn thành',
            date: '05/03/2026',
        },
        {
            id: 'HD002',
            customer: 'Trần Thị B',
            amount: '320,000đ',
            status: 'Đang xử lý',
            date: '05/03/2026',
        },
        {
            id: 'HD003',
            customer: 'Lê Văn C',
            amount: '680,000đ',
            status: 'Hoàn thành',
            date: '04/03/2026',
        },
        {
            id: 'HD004',
            customer: 'Phạm Thị D',
            amount: '290,000đ',
            status: 'Chờ xác nhận',
            date: '04/03/2026',
        },
        {
            id: 'HD005',
            customer: 'Hoàng Văn E',
            amount: '520,000đ',
            status: 'Hoàn thành',
            date: '03/03/2026',
        },
    ];

    const topBooks = [
        {
            title: 'Đắc Nhân Tâm',
            author: 'Dale Carnegie',
            sold: 156,
            revenue: '23,400,000đ',
        },
        {
            title: 'Sapiens',
            author: 'Yuval Noah Harari',
            sold: 132,
            revenue: '19,800,000đ',
        },
        {
            title: 'Nhà Giả Kim',
            author: 'Paulo Coelho',
            sold: 128,
            revenue: '12,800,000đ',
        },
        {
            title: 'Tâm Lý Học Tội Phạm',
            author: 'Diệu Thùy',
            sold: 98,
            revenue: '14,700,000đ',
        },
    ];

    // Dialog states
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
    const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
    const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
    const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
    const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
    const [isRegulationDialogOpen, setIsRegulationDialogOpen] = useState(false);

    // Invoice form data
    const [createFormData, setCreateFormData] = useState({
        invoiceNumber: '',
        customer: '',
        date: new Date().toISOString().split('T')[0],
        books: [] as Array<{ title: string; quantity: number; price: number }>,
        status: 'Chưa thanh toán' as const,
        discountCode: '',
        discountAmount: 0,
    });
    const [newBook, setNewBook] = useState({
        title: '',
        quantity: 1,
        price: 0,
    });

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

    // Customer form data
    const [customerFormData, setCustomerFormData] = useState({
        customerCode: '',
        name: '',
        email: '',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
    });

    // Receipt form data
    const [receiptFormData, setReceiptFormData] = useState({
        receiptNumber: '',
        customerName: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        amount: 0,
        paymentMethod: 'Tiền mặt' as const,
        collector: 'A Nguyen Van',
        status: 'Đã thu' as const,
    });

    // Import form data
    const [importFormData, setImportFormData] = useState({
        importNumber: '',
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        totalItems: 0,
        totalAmount: 0,
        createdBy: 'A Nguyen Van',
        status: 'Hoàn thành' as const,
    });

    // Promotion form data
    const [promotionFormData, setPromotionFormData] = useState({
        code: '',
        name: '',
        description: '',
        type: 'Phần trăm' as const,
        discount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        maxUses: 100,
        usedCount: 0,
    });

    // Employee form data
    const [employeeFormData, setEmployeeFormData] = useState({
        employeeCode: '',
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        joinDate: new Date().toISOString().split('T')[0],
        salary: 0,
        status: 'Đang làm việc' as const,
    });

    // Regulation form data
    const [regulationFormData, setRegulationFormData] = useState({
        title: '',
        category: 'Nhân sự',
        effectiveDate: new Date().toISOString().split('T')[0],
        status: 'Đang áp dụng' as const,
        description: '',
        content: '',
    });

    // Invoice handlers
    const handleAddBook = () => {
        if (newBook.title && newBook.price > 0) {
            setCreateFormData({
                ...createFormData,
                books: [...createFormData.books, newBook],
            });
            setNewBook({ title: '', quantity: 1, price: 0 });
            toast.success('Đã thêm sách vào hóa đơn');
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin sách');
        }
    };

    const handleRemoveBook = (index: number) => {
        setCreateFormData({
            ...createFormData,
            books: createFormData.books.filter((_, i) => i !== index),
        });
        toast.info('Đã xóa sách khỏi hóa đơn');
    };

    const calculateTotalItems = () => {
        return createFormData.books.reduce(
            (sum, book) => sum + book.quantity,
            0,
        );
    };

    const calculateTotalAmount = () => {
        return createFormData.books.reduce(
            (sum, book) => sum + book.quantity * book.price,
            0,
        );
    };

    const calculateDiscountAmount = () => {
        if (!createFormData.discountCode) return 0;
        const discount = mockDiscountCodes.find(
            (d) => d.code === createFormData.discountCode,
        );
        if (!discount) return 0;

        const total = calculateTotalAmount();
        if (discount.type === 'percentage') {
            return Math.floor((total * discount.value) / 100);
        } else {
            return discount.value;
        }
    };

    const calculateFinalTotal = () => {
        return calculateTotalAmount() - calculateDiscountAmount();
    };

    const handleDiscountCodeChange = (value: string) => {
        setCreateFormData({
            ...createFormData,
            discountCode: value,
            discountAmount: value ? calculateDiscountAmount() : 0,
        });
    };

    const handleCreateInvoice = () => {
        if (createFormData.customer && createFormData.books.length > 0) {
            toast.success('Hóa đơn mới đã được tạo thành công!');
            setIsInvoiceDialogOpen(false);
            setCreateFormData({
                invoiceNumber: '',
                customer: '',
                date: new Date().toISOString().split('T')[0],
                books: [],
                status: 'Chưa thanh toán',
                discountCode: '',
                discountAmount: 0,
            });
            setNewBook({ title: '', quantity: 1, price: 0 });
            onNavigate && onNavigate('invoice');
        } else {
            toast.error(
                'Vui lòng nhập đầy đủ thông tin và thêm ít nhất 1 sách!',
            );
        }
    };

    // Book handler
    const handleAddBookQuick = () => {
        if (bookFormData.title && bookFormData.author && bookFormData.price) {
            toast.success('Sách mới đã được thêm thành công!');
            setIsBookDialogOpen(false);
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
            onNavigate && onNavigate('books');
        } else {
            toast.error(
                'Vui lòng nhập đầy đủ thông tin cơ bản (Tên sách, Tác giả, Giá)!',
            );
        }
    };

    // Customer handler
    const handleAddCustomer = () => {
        if (customerFormData.name && customerFormData.phone) {
            toast.success('Khách hàng mới đã được thêm thành công!');
            setIsCustomerDialogOpen(false);
            setCustomerFormData({
                customerCode: '',
                name: '',
                email: '',
                phone: '',
                joinDate: new Date().toISOString().split('T')[0],
                totalOrders: 0,
                totalSpent: 0,
            });
            onNavigate && onNavigate('customers');
        } else {
            toast.error('Vui lòng nhập tên và số điện thoại!');
        }
    };

    // Receipt handler
    const handleCreateReceipt = () => {
        if (receiptFormData.customerName && receiptFormData.amount > 0) {
            toast.success('Phiếu thu mới đã được tạo thành công!');
            setIsReceiptDialogOpen(false);
            setReceiptFormData({
                receiptNumber: '',
                customerName: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().slice(0, 5),
                amount: 0,
                paymentMethod: 'Tiền mặt',
                collector: 'A Nguyen Van',
                status: 'Đã thu',
            });
            onNavigate && onNavigate('receipts');
        } else {
            toast.error('Vui lòng nhập tên khách hàng và số tiền!');
        }
    };

    // Import handler
    const handleCreateImport = () => {
        if (importFormData.supplier && importFormData.totalAmount > 0) {
            toast.success('Phiếu nhập đã được tạo thành công!');
            setIsImportDialogOpen(false);
            setImportFormData({
                importNumber: '',
                supplier: '',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().slice(0, 5),
                totalItems: 0,
                totalAmount: 0,
                createdBy: 'A Nguyen Van',
                status: 'Hoàn thành',
            });
            onNavigate && onNavigate('import');
        } else {
            toast.error('Vui lòng nhập nhà cung cấp và tổng tiền!');
        }
    };

    // Promotion handler
    const handleCreatePromotion = () => {
        if (
            promotionFormData.code &&
            promotionFormData.name &&
            promotionFormData.discount > 0 &&
            promotionFormData.startDate
        ) {
            toast.success('Khuyến mãi mới đã được tạo thành công!');
            setIsPromotionDialogOpen(false);
            setPromotionFormData({
                code: '',
                name: '',
                description: '',
                type: 'Phần trăm',
                discount: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                maxUses: 100,
                usedCount: 0,
            });
            onNavigate && onNavigate('promotions');
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin cơ bản!');
        }
    };

    // Employee handler
    const handleAddEmployee = () => {
        if (
            employeeFormData.name &&
            employeeFormData.email &&
            employeeFormData.phone &&
            employeeFormData.position
        ) {
            toast.success('Nhân viên mới đã được thêm thành công!');
            setIsEmployeeDialogOpen(false);
            setEmployeeFormData({
                employeeCode: '',
                name: '',
                email: '',
                phone: '',
                position: '',
                department: '',
                joinDate: new Date().toISOString().split('T')[0],
                salary: 0,
                status: 'Đang làm việc',
            });
            onNavigate && onNavigate('employees');
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin cơ bản!');
        }
    };

    // Regulation handler
    const handleAddRegulation = () => {
        if (
            regulationFormData.title &&
            regulationFormData.category &&
            regulationFormData.content
        ) {
            toast.success('Quy định mới đã được thêm thành công!');
            setIsRegulationDialogOpen(false);
            setRegulationFormData({
                title: '',
                category: 'Nhân sự',
                effectiveDate: new Date().toISOString().split('T')[0],
                status: 'Đang áp dụng',
                description: '',
                content: '',
            });
            onNavigate && onNavigate('regulations');
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Bảng điều khiển
                </h1>
                <p className="text-gray-600 mt-1">
                    Tổng quan hoạt động kinh doanh
                </p>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        Thao tác nhanh
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {/* Tạo hóa đơn */}
                        <button
                            className="group p-4 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-orange-300 hover:shadow-lg"
                            onClick={() => setIsInvoiceDialogOpen(true)}
                        >
                            <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                Tạo hóa đơn
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Hóa đơn mới
                            </p>
                        </button>

                        {/* Thêm sách */}
                        <button
                            className="group p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-blue-300 hover:shadow-lg"
                            onClick={() => setIsBookDialogOpen(true)}
                        >
                            <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                Thêm sách
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Sách mới
                            </p>
                        </button>

                        {/* Thêm khách hàng */}
                        <button
                            className="group p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-green-300 hover:shadow-lg"
                            onClick={() => setIsCustomerDialogOpen(true)}
                        >
                            <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                Thêm KH
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Khách hàng
                            </p>
                        </button>

                        {/* Phiếu thu */}
                        <button
                            className="group p-4 bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-teal-300 hover:shadow-lg"
                            onClick={() => setIsReceiptDialogOpen(true)}
                        >
                            <div className="w-12 h-12 bg-teal-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Receipt className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                Phiếu thu
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Tạo mới
                            </p>
                        </button>

                        {/* Phiếu nhập */}
                        {/* <button className="group p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-purple-300 hover:shadow-lg" onClick={() => setIsImportDialogOpen(true)}>
              <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Phiếu nhập</p>
              <p className="text-xs text-gray-600 mt-1">Nhập hàng</p>
            </button> */}

                        {/* Khuyến mãi */}
                        <button
                            className="group p-4 bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-pink-300 hover:shadow-lg"
                            onClick={() => setIsPromotionDialogOpen(true)}
                        >
                            <div className="w-12 h-12 bg-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                Khuyến mãi
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Tạo mới
                            </p>
                        </button>

                        {/* Thêm nhân viên
            <button className="group p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-cyan-300 hover:shadow-lg" onClick={() => setIsEmployeeDialogOpen(true)}>
              <div className="w-12 h-12 bg-cyan-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Nhân viên</p>
              <p className="text-xs text-gray-600 mt-1">Thêm mới</p>
            </button> */}

                        {/* Thêm quy định
            <button className="group p-4 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-amber-300 hover:shadow-lg" onClick={() => setIsRegulationDialogOpen(true)}>
              <div className="w-12 h-12 bg-amber-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Quy định</p>
              <p className="text-xs text-gray-600 mt-1">Tạo mới</p>
            </button> */}

                        {/* Xem báo cáo */}
                        <button
                            className="group p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-xl transition-all duration-200 text-center border-2 border-transparent hover:border-indigo-300 hover:shadow-lg"
                            onClick={() => onNavigate && onNavigate('reports')}
                        >
                            <div className="w-12 h-12 bg-indigo-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                Báo cáo
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Thống kê
                            </p>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* CREATE INVOICE DIALOG */}
            <Dialog
                open={isInvoiceDialogOpen}
                onOpenChange={setIsInvoiceDialogOpen}
            >
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo hóa đơn mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin hóa đơn mới
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-3">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customer" className="text-sm">
                                Khách hàng
                            </Label>
                            <Input
                                id="customer"
                                value={createFormData.customer}
                                onChange={(e) =>
                                    setCreateFormData({
                                        ...createFormData,
                                        customer: e.target.value,
                                    })
                                }
                                className="col-span-3"
                                placeholder="Nhập tên khách hàng"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-sm">
                                Ngày
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={createFormData.date}
                                onChange={(e) =>
                                    setCreateFormData({
                                        ...createFormData,
                                        date: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="mt-2 text-sm">
                                Danh sách sách
                            </Label>
                            <div className="col-span-3 border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-32 overflow-y-auto">
                                {createFormData.books.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-2">
                                        Chưa có sách nào
                                    </p>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                                                    Tên sách
                                                </th>
                                                <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                                                    SL
                                                </th>
                                                <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                                                    Giá
                                                </th>
                                                <th className="text-left py-1 px-2 text-xs font-medium text-gray-500"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {createFormData.books.map(
                                                (book, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="border-b border-gray-100 last:border-0"
                                                    >
                                                        <td className="py-1 px-2">
                                                            {book.title}
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            {book.quantity}
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            {book.price.toLocaleString(
                                                                'vi-VN',
                                                            )}
                                                            đ
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    handleRemoveBook(
                                                                        idx,
                                                                    )
                                                                }
                                                                className="h-6 px-2 text-xs"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Add Book Section - Compact */}
                        <div className="border-t pt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Thêm sách
                            </p>
                            <div className="grid grid-cols-12 gap-2">
                                <Input
                                    placeholder="Tên sách"
                                    value={newBook.title}
                                    onChange={(e) =>
                                        setNewBook({
                                            ...newBook,
                                            title: e.target.value,
                                        })
                                    }
                                    className="col-span-5 text-sm"
                                />
                                <Input
                                    type="number"
                                    placeholder="SL"
                                    min="1"
                                    value={newBook.quantity}
                                    onChange={(e) =>
                                        setNewBook({
                                            ...newBook,
                                            quantity:
                                                parseInt(e.target.value) || 1,
                                        })
                                    }
                                    className="col-span-2 text-sm"
                                />
                                <Input
                                    type="number"
                                    placeholder="Giá"
                                    min="0"
                                    value={newBook.price}
                                    onChange={(e) =>
                                        setNewBook({
                                            ...newBook,
                                            price:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="col-span-3 text-sm"
                                />
                                <Button
                                    onClick={handleAddBook}
                                    className="col-span-2 bg-orange-500 hover:bg-orange-600 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4 border-t pt-3">
                            <Label className="text-sm">Số mặt hàng</Label>
                            <Input
                                value={calculateTotalItems().toString()}
                                readOnly
                                className="col-span-3 bg-gray-50 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-sm">Tạm tính</Label>
                            <Input
                                value={`${calculateTotalAmount().toLocaleString('vi-VN')}đ`}
                                readOnly
                                className="col-span-3 bg-gray-50 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="discountCode" className="text-sm">
                                Mã giảm giá
                            </Label>
                            <Select
                                value={createFormData.discountCode}
                                onValueChange={handleDiscountCodeChange}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn mã giảm giá (tùy chọn)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">
                                        Không áp dụng
                                    </SelectItem>
                                    {mockDiscountCodes.map((discount) => (
                                        <SelectItem
                                            key={discount.id}
                                            value={discount.code}
                                        >
                                            {discount.code} -{' '}
                                            {discount.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {createFormData.discountCode && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-sm">Giảm giá</Label>
                                <Input
                                    value={`-${calculateDiscountAmount().toLocaleString('vi-VN')}đ`}
                                    readOnly
                                    className="col-span-3 bg-orange-50 text-orange-600 font-medium text-sm"
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="font-semibold text-sm">
                                Tổng tiền
                            </Label>
                            <Input
                                value={`${calculateFinalTotal().toLocaleString('vi-VN')}đ`}
                                readOnly
                                className="col-span-3 bg-gray-50 font-semibold text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-sm">
                                Trạng thái
                            </Label>
                            <Select
                                value={createFormData.status}
                                onValueChange={(value) =>
                                    setCreateFormData({
                                        ...createFormData,
                                        status: value as typeof createFormData.status,
                                    })
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Đã thanh toán">
                                        Đã thanh toán
                                    </SelectItem>
                                    <SelectItem value="Chưa thanh toán">
                                        Chưa thanh toán
                                    </SelectItem>
                                    <SelectItem value="Quá hạn">
                                        Quá hạn
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsInvoiceDialogOpen(false);
                                setCreateFormData({
                                    invoiceNumber: '',
                                    customer: '',
                                    date: new Date()
                                        .toISOString()
                                        .split('T')[0],
                                    books: [],
                                    status: 'Chưa thanh toán',
                                    discountCode: '',
                                    discountAmount: 0,
                                });
                                setNewBook({
                                    title: '',
                                    quantity: 1,
                                    price: 0,
                                });
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleCreateInvoice}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            Tạo hóa đơn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD BOOK DIALOG */}
            <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
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
                            onClick={() => setIsBookDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleAddBookQuick}>
                            Thêm sách
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD CUSTOMER DIALOG */}
            <Dialog
                open={isCustomerDialogOpen}
                onOpenChange={setIsCustomerDialogOpen}
            >
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm khách hàng mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin khách hàng mới. Hạng sẽ được tự động
                            tính dựa trên tổng chi tiêu.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        {/* Mã khách hàng */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="customerCode"
                                className="text-sm font-medium"
                            >
                                Mã khách hàng
                            </Label>
                            <Input
                                id="customerCode"
                                value={customerFormData.customerCode || 'KH001'}
                                onChange={(e) =>
                                    setCustomerFormData({
                                        ...customerFormData,
                                        customerCode: e.target.value,
                                    })
                                }
                                className="bg-gray-50"
                                placeholder="Tự động tạo"
                                readOnly
                            />
                        </div>

                        {/* Thông tin cơ bản */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin cơ bản
                            </h4>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Tên khách hàng
                                </Label>
                                <Input
                                    id="name"
                                    value={customerFormData.name}
                                    onChange={(e) =>
                                        setCustomerFormData({
                                            ...customerFormData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập tên khách hàng"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={customerFormData.email}
                                    onChange={(e) =>
                                        setCustomerFormData({
                                            ...customerFormData,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-sm font-medium"
                                >
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="phone"
                                    value={customerFormData.phone}
                                    onChange={(e) =>
                                        setCustomerFormData({
                                            ...customerFormData,
                                            phone: e.target.value,
                                        })
                                    }
                                    placeholder="0901234567"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="joinDate"
                                    className="text-sm font-medium"
                                >
                                    Ngày tham gia
                                </Label>
                                <Input
                                    id="joinDate"
                                    type="date"
                                    value={customerFormData.joinDate}
                                    onChange={(e) =>
                                        setCustomerFormData({
                                            ...customerFormData,
                                            joinDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Thông tin giao dịch */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin giao dịch
                            </h4>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="totalOrders"
                                    className="text-sm font-medium"
                                >
                                    Số đơn hàng
                                </Label>
                                <Input
                                    id="totalOrders"
                                    type="number"
                                    value={customerFormData.totalOrders}
                                    onChange={(e) =>
                                        setCustomerFormData({
                                            ...customerFormData,
                                            totalOrders:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="totalSpent"
                                    className="text-sm font-medium"
                                >
                                    Tổng chi tiêu (VNĐ)
                                </Label>
                                <Input
                                    id="totalSpent"
                                    type="number"
                                    value={customerFormData.totalSpent}
                                    onChange={(e) =>
                                        setCustomerFormData({
                                            ...customerFormData,
                                            totalSpent:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCustomerDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleAddCustomer}>
                            Thêm khách hàng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CREATE RECEIPT DIALOG */}
            <Dialog
                open={isReceiptDialogOpen}
                onOpenChange={setIsReceiptDialogOpen}
            >
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo phiếu thu mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin phiếu thu mới
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        {/* Số phiếu thu */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="receiptNumber"
                                className="text-sm font-medium"
                            >
                                Số phiếu thu
                            </Label>
                            <Input
                                id="receiptNumber"
                                value={receiptFormData.receiptNumber || 'PT001'}
                                onChange={(e) =>
                                    setReceiptFormData({
                                        ...receiptFormData,
                                        receiptNumber: e.target.value,
                                    })
                                }
                                className="bg-gray-50"
                                placeholder="Tự động tạo"
                                readOnly
                            />
                        </div>

                        {/* Thông tin khách hàng */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin khách hàng
                            </h4>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="customerName"
                                    className="text-sm font-medium"
                                >
                                    Tên khách hàng
                                </Label>
                                <Input
                                    id="customerName"
                                    value={receiptFormData.customerName}
                                    onChange={(e) =>
                                        setReceiptFormData({
                                            ...receiptFormData,
                                            customerName: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập tên khách hàng"
                                />
                            </div>
                        </div>

                        {/* Thông tin thanh toán */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin thanh toán
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="date"
                                        className="text-sm font-medium"
                                    >
                                        Ngày thu
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={receiptFormData.date}
                                        onChange={(e) =>
                                            setReceiptFormData({
                                                ...receiptFormData,
                                                date: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="time"
                                        className="text-sm font-medium"
                                    >
                                        Giờ thu
                                    </Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={receiptFormData.time}
                                        onChange={(e) =>
                                            setReceiptFormData({
                                                ...receiptFormData,
                                                time: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="amount"
                                    className="text-sm font-medium"
                                >
                                    Số tiền (VNĐ)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={receiptFormData.amount}
                                    onChange={(e) =>
                                        setReceiptFormData({
                                            ...receiptFormData,
                                            amount:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="paymentMethod"
                                    className="text-sm font-medium"
                                >
                                    Hình thức thanh toán
                                </Label>
                                <Select
                                    value={receiptFormData.paymentMethod}
                                    onValueChange={(value) =>
                                        setReceiptFormData({
                                            ...receiptFormData,
                                            paymentMethod:
                                                value as typeof receiptFormData.paymentMethod,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn hình thức" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Tiền mặt">
                                            Tiền mặt
                                        </SelectItem>
                                        <SelectItem value="Chuyển khoản">
                                            Chuyển khoản
                                        </SelectItem>
                                        <SelectItem value="Thẻ">Thẻ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="collector"
                                    className="text-sm font-medium"
                                >
                                    Người thu
                                </Label>
                                <Input
                                    id="collector"
                                    value={receiptFormData.collector}
                                    onChange={(e) =>
                                        setReceiptFormData({
                                            ...receiptFormData,
                                            collector: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập tên người thu"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="status"
                                    className="text-sm font-medium"
                                >
                                    Trạng thái
                                </Label>
                                <Select
                                    value={receiptFormData.status}
                                    onValueChange={(value) =>
                                        setReceiptFormData({
                                            ...receiptFormData,
                                            status: value as typeof receiptFormData.status,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Đã thu">
                                            Đã thu
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
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsReceiptDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleCreateReceipt}>
                            Tạo phiếu thu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CREATE IMPORT DIALOG */}
            <Dialog
                open={isImportDialogOpen}
                onOpenChange={setIsImportDialogOpen}
            >
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo phiếu nhập mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin phiếu nhập hàng mới
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        {/* Số phiếu nhập */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="importNumber"
                                className="text-sm font-medium"
                            >
                                Số phiếu nhập
                            </Label>
                            <Input
                                id="importNumber"
                                value={importFormData.importNumber || 'PN001'}
                                onChange={(e) =>
                                    setImportFormData({
                                        ...importFormData,
                                        importNumber: e.target.value,
                                    })
                                }
                                className="bg-gray-50"
                                placeholder="Tự động tạo"
                                readOnly
                            />
                        </div>

                        {/* Thông tin nhà cung cấp */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin nhà cung cấp
                            </h4>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="supplier"
                                    className="text-sm font-medium"
                                >
                                    Nhà cung cấp
                                </Label>
                                <Input
                                    id="supplier"
                                    value={importFormData.supplier}
                                    onChange={(e) =>
                                        setImportFormData({
                                            ...importFormData,
                                            supplier: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập tên nhà cung cấp"
                                />
                            </div>
                        </div>

                        {/* Thông tin nhập hàng */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin nhập hàng
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="date"
                                        className="text-sm font-medium"
                                    >
                                        Ngày nhập
                                    </Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={importFormData.date}
                                        onChange={(e) =>
                                            setImportFormData({
                                                ...importFormData,
                                                date: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="time"
                                        className="text-sm font-medium"
                                    >
                                        Giờ nhập
                                    </Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={importFormData.time}
                                        onChange={(e) =>
                                            setImportFormData({
                                                ...importFormData,
                                                time: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="totalItems"
                                    className="text-sm font-medium"
                                >
                                    Số lượng
                                </Label>
                                <Input
                                    id="totalItems"
                                    type="number"
                                    value={importFormData.totalItems}
                                    onChange={(e) =>
                                        setImportFormData({
                                            ...importFormData,
                                            totalItems:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="totalAmount"
                                    className="text-sm font-medium"
                                >
                                    Tổng tiền (VNĐ)
                                </Label>
                                <Input
                                    id="totalAmount"
                                    type="number"
                                    value={importFormData.totalAmount}
                                    onChange={(e) =>
                                        setImportFormData({
                                            ...importFormData,
                                            totalAmount:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="createdBy"
                                    className="text-sm font-medium"
                                >
                                    Người tạo
                                </Label>
                                <Input
                                    id="createdBy"
                                    value={importFormData.createdBy}
                                    onChange={(e) =>
                                        setImportFormData({
                                            ...importFormData,
                                            createdBy: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập tên người tạo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="status"
                                    className="text-sm font-medium"
                                >
                                    Trạng thái
                                </Label>
                                <Select
                                    value={importFormData.status}
                                    onValueChange={(value) =>
                                        setImportFormData({
                                            ...importFormData,
                                            status: value as typeof importFormData.status,
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
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsImportDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleCreateImport}>
                            Tạo phiếu nhập
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CREATE PROMOTION DIALOG */}
            <Dialog
                open={isPromotionDialogOpen}
                onOpenChange={setIsPromotionDialogOpen}
            >
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin chương trình khuyến mãi mới
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
                                    htmlFor="code"
                                    className="text-sm font-medium"
                                >
                                    Mã khuyến mãi
                                </Label>
                                <Input
                                    id="code"
                                    value={promotionFormData.code}
                                    onChange={(e) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            code: e.target.value.toUpperCase(),
                                        })
                                    }
                                    placeholder="VD: BOOK2026"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Tên chương trình
                                </Label>
                                <Input
                                    id="name"
                                    value={promotionFormData.name}
                                    onChange={(e) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập tên chương trình"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="text-sm font-medium"
                                >
                                    Mô tả
                                </Label>
                                <Input
                                    id="description"
                                    value={promotionFormData.description}
                                    onChange={(e) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Mô tả chương trình (tùy chọn)"
                                />
                            </div>
                        </div>

                        {/* Thông tin giảm giá */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin giảm giá
                            </h4>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="type"
                                    className="text-sm font-medium"
                                >
                                    Loại giảm giá
                                </Label>
                                <Select
                                    value={promotionFormData.type}
                                    onValueChange={(value) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            type: value as typeof promotionFormData.type,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại giảm giá" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Phần trăm">
                                            Phần trăm (%)
                                        </SelectItem>
                                        <SelectItem value="Số tiền">
                                            Số tiền (VNĐ)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="discount"
                                    className="text-sm font-medium"
                                >
                                    Giá trị giảm{' '}
                                    {promotionFormData.type === 'Phần trăm'
                                        ? '(%)'
                                        : '(VNĐ)'}
                                </Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={promotionFormData.discount}
                                    onChange={(e) =>
                                        setPromotionFormData({
                                            ...promotionFormData,
                                            discount:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Thông tin thời gian và sử dụng */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thời gian và giới hạn
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="startDate"
                                        className="text-sm font-medium"
                                    >
                                        Ngày bắt đầu
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={promotionFormData.startDate}
                                        onChange={(e) =>
                                            setPromotionFormData({
                                                ...promotionFormData,
                                                startDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="endDate"
                                        className="text-sm font-medium"
                                    >
                                        Ngày kết thúc
                                    </Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={promotionFormData.endDate}
                                        onChange={(e) =>
                                            setPromotionFormData({
                                                ...promotionFormData,
                                                endDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="maxUses"
                                        className="text-sm font-medium"
                                    >
                                        Số lượt tối đa
                                    </Label>
                                    <Input
                                        id="maxUses"
                                        type="number"
                                        value={promotionFormData.maxUses}
                                        onChange={(e) =>
                                            setPromotionFormData({
                                                ...promotionFormData,
                                                maxUses:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        placeholder="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="usedCount"
                                        className="text-sm font-medium"
                                    >
                                        Đã sử dụng
                                    </Label>
                                    <Input
                                        id="usedCount"
                                        type="number"
                                        value={promotionFormData.usedCount}
                                        onChange={(e) =>
                                            setPromotionFormData({
                                                ...promotionFormData,
                                                usedCount:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsPromotionDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleCreatePromotion}>
                            Tạo khuyến mãi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD EMPLOYEE DIALOG */}
            <Dialog
                open={isEmployeeDialogOpen}
                onOpenChange={setIsEmployeeDialogOpen}
            >
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm nhân viên mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin nhân viên mới vào hệ thống
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        {/* Mã nhân viên */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="employeeCode"
                                className="text-sm font-medium"
                            >
                                Mã nhân viên
                            </Label>
                            <Input
                                id="employeeCode"
                                value={employeeFormData.employeeCode || 'NV001'}
                                onChange={(e) =>
                                    setEmployeeFormData({
                                        ...employeeFormData,
                                        employeeCode: e.target.value,
                                    })
                                }
                                className="bg-gray-50"
                                placeholder="Tự động tạo"
                                readOnly
                            />
                        </div>

                        {/* Thông tin cá nhân */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin cá nhân
                            </h4>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Tên nhân viên
                                </Label>
                                <Input
                                    id="name"
                                    value={employeeFormData.name}
                                    onChange={(e) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập tên nhân viên"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={employeeFormData.email}
                                    onChange={(e) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="example@company.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone"
                                    className="text-sm font-medium"
                                >
                                    Số điện thoại
                                </Label>
                                <Input
                                    id="phone"
                                    value={employeeFormData.phone}
                                    onChange={(e) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            phone: e.target.value,
                                        })
                                    }
                                    placeholder="0901234567"
                                />
                            </div>
                        </div>

                        {/* Thông tin công việc */}
                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin công việc
                            </h4>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="position"
                                    className="text-sm font-medium"
                                >
                                    Chức vụ
                                </Label>
                                <Input
                                    id="position"
                                    value={employeeFormData.position}
                                    onChange={(e) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            position: e.target.value,
                                        })
                                    }
                                    placeholder="VD: Nhân viên bán hàng"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="department"
                                    className="text-sm font-medium"
                                >
                                    Phòng ban
                                </Label>
                                <Input
                                    id="department"
                                    value={employeeFormData.department}
                                    onChange={(e) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            department: e.target.value,
                                        })
                                    }
                                    placeholder="VD: Bán hàng"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="joinDate"
                                    className="text-sm font-medium"
                                >
                                    Ngày vào làm
                                </Label>
                                <Input
                                    id="joinDate"
                                    type="date"
                                    value={employeeFormData.joinDate}
                                    onChange={(e) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            joinDate: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="salary"
                                    className="text-sm font-medium"
                                >
                                    Lương (VNĐ)
                                </Label>
                                <Input
                                    id="salary"
                                    type="number"
                                    value={employeeFormData.salary}
                                    onChange={(e) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            salary:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="10000000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="status"
                                    className="text-sm font-medium"
                                >
                                    Trạng thái
                                </Label>
                                <Select
                                    value={employeeFormData.status}
                                    onValueChange={(value) =>
                                        setEmployeeFormData({
                                            ...employeeFormData,
                                            status: value as typeof employeeFormData.status,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Đang làm việc">
                                            Đang làm việc
                                        </SelectItem>
                                        <SelectItem value="Nghỉ phép">
                                            Nghỉ phép
                                        </SelectItem>
                                        <SelectItem value="Đã nghỉ việc">
                                            Đã nghỉ việc
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEmployeeDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleAddEmployee}>
                            Thêm nhân viên
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD REGULATION DIALOG */}
            <Dialog
                open={isRegulationDialogOpen}
                onOpenChange={setIsRegulationDialogOpen}
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
                                    value={regulationFormData.title}
                                    onChange={(e) =>
                                        setRegulationFormData({
                                            ...regulationFormData,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="VD: Quy định về giờ làm việc"
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
                                        value={regulationFormData.category}
                                        onValueChange={(value) =>
                                            setRegulationFormData({
                                                ...regulationFormData,
                                                category: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Nhân sự">
                                                Nhân sự
                                            </SelectItem>
                                            <SelectItem value="Bán hàng">
                                                Bán hàng
                                            </SelectItem>
                                            <SelectItem value="Kho vận">
                                                Kho vận
                                            </SelectItem>
                                            <SelectItem value="Dịch vụ khách hàng">
                                                Dịch vụ khách hàng
                                            </SelectItem>
                                            <SelectItem value="Tài chính">
                                                Tài chính
                                            </SelectItem>
                                            <SelectItem value="An toàn">
                                                An toàn
                                            </SelectItem>
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
                                        value={regulationFormData.effectiveDate}
                                        onChange={(e) =>
                                            setRegulationFormData({
                                                ...regulationFormData,
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
                                    value={regulationFormData.status}
                                    onValueChange={(value) =>
                                        setRegulationFormData({
                                            ...regulationFormData,
                                            status: value as typeof regulationFormData.status,
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
                                    value={regulationFormData.description}
                                    onChange={(e) =>
                                        setRegulationFormData({
                                            ...regulationFormData,
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
                                <Textarea
                                    id="content"
                                    value={regulationFormData.content}
                                    onChange={(e) =>
                                        setRegulationFormData({
                                            ...regulationFormData,
                                            content: e.target.value,
                                        })
                                    }
                                    placeholder="Nhập nội dung chi tiết của quy định..."
                                    className="min-h-[200px] resize-y"
                                    rows={10}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsRegulationDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button type="button" onClick={handleAddRegulation}>
                            Thêm quy định
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="border-0 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-600 font-medium">
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                                >
                                    <stat.icon
                                        className={`w-6 h-6 ${stat.color}`}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders & Top Books */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card className="border-0 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-orange-500" />
                            Đơn hàng gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {order.customer}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Mã: {order.id} • {order.date}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            {order.amount}
                                        </p>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                order.status === 'Hoàn thành'
                                                    ? 'bg-green-100 text-green-700'
                                                    : order.status ===
                                                        'Đang xử lý'
                                                      ? 'bg-blue-100 text-blue-700'
                                                      : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Books */}
                <Card className="border-0 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-orange-500" />
                            Sách bán chạy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topBooks.map((book, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {book.title}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {book.author}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            {book.revenue}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {book.sold} cuốn
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
