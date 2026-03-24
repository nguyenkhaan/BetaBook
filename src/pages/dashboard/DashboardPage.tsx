import { useState } from 'react';
import {
    DollarSign,
    ShoppingCart,
    Users,
    BookOpen,
} from 'lucide-react';
import CreateBill from '../../components/bill/CreateBill';
import CreateBook from '../../components/book/CreateBook';
import CreateCustomer from '../../components/customer/CreateCustomer';
import CreateIncome from '../../components/income/CreateIncome';
import CreateOutcome from '../../components/outcome/CreateOutcome';
import CreateRegulation from '../../components/regulation/CreateRegulation';
import CreateEmployee from '../../components/employee/CreateEmployee';
import CreatePromotion from '../../components/promotion/CreatePromotion';
import { StatsCard } from './components/StatsCard';
import { QuickActions } from './components/QuickActions';
import { RecentOrders } from './components/RecentOrders';
import { TopBooks } from './components/TopBooks';

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
            <QuickActions
                onInvoice={() => setIsInvoiceDialogOpen(true)}
                onBook={() => setIsBookDialogOpen(true)}
                onCustomer={() => setIsCustomerDialogOpen(true)}
                onReceipt={() => setIsReceiptDialogOpen(true)}
                onPromotion={() => setIsPromotionDialogOpen(true)}
                onNavigate={onNavigate}
            />

            {/* Dialogs */}
            <CreateBill
                isDialogOpen={isInvoiceDialogOpen}
                setDialogOpen={setIsInvoiceDialogOpen}
            />
            <CreateBook
                isDialogOpen={isBookDialogOpen}
                setDialogOpen={setIsBookDialogOpen}
            />
            <CreateCustomer
                isDialogOpen={isCustomerDialogOpen}
                setDialogOpen={setIsCustomerDialogOpen}
            />
            <CreateIncome
                isDialogOpen={isReceiptDialogOpen}
                setDialogOpen={setIsReceiptDialogOpen}
            />
            <CreateOutcome
                isDialogOpen={isImportDialogOpen}
                setDialogOpen={setIsImportDialogOpen}
            />
            <CreatePromotion
                isDialogOpen={isPromotionDialogOpen}
                setDialogOpen={setIsPromotionDialogOpen}
            />
            <CreateEmployee
                isDialogOpen={isEmployeeDialogOpen}
                setDialogOpen={setIsEmployeeDialogOpen}
            />
            <CreateRegulation
                isDialogOpen={isRegulationDialogOpen}
                setDialogOpen={setIsRegulationDialogOpen}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Orders & Top Books */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders orders={recentOrders} />
                <TopBooks books={topBooks} />
            </div>
        </div>
    );
}
