//Thuc hien tach component trong dashboard thanh nhieu component rieng re ===== Gop chung lai component trong cac trang phu hop
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Users,
    FileText,
    BookOpen,
    UserPlus,
    Tag,
    BarChart3,
    Receipt,
} from 'lucide-react';
import CreateBill from '../../components/bill/CreateBill';
import CreateBook from '../../components/book/CreateBook';
import CreateCustomer from '../../components/customer/CreateCustomer';
import CreateIncome from '../../components/income/CreateIncome';
import CreateOutcome from '../../components/outcome/CreateOutcome';
import CreateRegulation from '../../components/regulation/CreateRegulation';
import CreateEmployee from '../../components/employee/CreateEmployee';
import CreatePromotion from '../../components/promotion/CreatePromotion';

export function DashboardPage() {
    const onNavigate = (x: string) => {
        console.log(x);
    };
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

            {/* CREATE INVOICE DIALOG - Tạo hóa đơn */}
            <CreateBill
                isDialogOpen={isInvoiceDialogOpen}
                setDialogOpen={setIsInvoiceDialogOpen}
            />

            {/* ADD BOOK DIALOG */}
            <CreateBook
                isDialogOpen={isBookDialogOpen}
                setDialogOpen={setIsBookDialogOpen}
            />

            {/* ADD CUSTOMER DIALOG */}

            <CreateCustomer
                isDialogOpen={isCustomerDialogOpen}
                setDialogOpen={setIsCustomerDialogOpen}
            />
            {/* CREATE IMPORT DIALOG */}
            <CreateIncome
                isDialogOpen={isReceiptDialogOpen}
                setDialogOpen={setIsReceiptDialogOpen}
            />
            {/* CREATE OUTCOME DIALOG */}
            <CreateOutcome
                isDialogOpen={isImportDialogOpen}
                setDialogOpen={setIsImportDialogOpen}
            />

            {/* CREATE PROMOTION DIALOG */}
            <CreatePromotion
                isDialogOpen={isPromotionDialogOpen}
                setDialogOpen={setIsPromotionDialogOpen}
            />
            {/* ADD EMPLOYEE DIALOG */}
            <CreateEmployee
                isDialogOpen={isEmployeeDialogOpen}
                setDialogOpen={setIsEmployeeDialogOpen}
            />
            {/* ADD REGULATION DIALOG */}
            <CreateRegulation
                isDialogOpen={isRegulationDialogOpen}
                setDialogOpen={setIsRegulationDialogOpen}
            />

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
