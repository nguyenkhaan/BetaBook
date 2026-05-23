import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    ShoppingCart,
    Users,
    BookOpen,
    LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { StatsCard } from './components/StatsCard';
import { QuickActions } from './components/QuickActions';
import { RecentOrders } from './components/RecentOrders';
import { TopBooks } from './components/TopBooks';
import {
    DashboardService,
    GeneralStatistic,
    RecentOrder,
    TopBook,
} from '../../services/dashboard.service';

interface StatItem {
    title: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

function buildStats(data: GeneralStatistic): StatItem[] {
    return [
        {
            title: 'Tổng doanh thu',
            value: `${data.totalRevenue.toLocaleString('vi-VN')}đ`,
            change: '0%',
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Đơn hàng',
            value: data.totalBills.toLocaleString('vi-VN'),
            change: '0%',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Khách hàng',
            value: data.totalCustomers.toLocaleString('vi-VN'),
            change: '0%',
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Sách đã bán',
            value: data.totalBooks.toLocaleString('vi-VN'),
            change: '0%',
            icon: BookOpen,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ];
}

export function DashboardPage() {
    const navigate = useNavigate();

    const [stats, setStats] = useState<StatItem[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [topBooks, setTopBooks] = useState<TopBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [general, orders, books] = await Promise.all([
                DashboardService.getGeneralStatistic(),
                DashboardService.getRecentOrders(5),
                DashboardService.getTopBooks(4),
            ]);

            setStats(buildStats(general));
            setRecentOrders(orders);
            setTopBooks(books);
        } catch (err: any) {
            const message = err.message || 'Lỗi hệ thống';
            setError(message);
            toast.error('Không thể tải dữ liệu bảng điều khiển: ' + message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                <p className="text-red-500 text-sm">{error}</p>
                <button
                    onClick={fetchDashboardData}
                    className="text-sm text-orange-500 underline"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Bảng điều khiển
                </h1>
                <p className="text-gray-600 mt-1">
                    Tổng quan hoạt động kinh doanh
                </p>
            </div>

            <QuickActions
                onInvoice={() => navigate('/invoice')}
                onBook={() => navigate('/books')}
                onCustomer={() => navigate('/customers')}
                onReceipt={() => navigate('/receipts')}
                onPromotion={() => navigate('/promotions')}
                onReport={() => navigate('/reports')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders orders={recentOrders} />
                <TopBooks books={topBooks} />
            </div>
        </div>
    );
}
