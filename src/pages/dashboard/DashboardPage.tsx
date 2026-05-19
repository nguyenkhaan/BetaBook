import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { StatsCard } from './components/StatsCard';
import { QuickActions } from './components/QuickActions';
import { RecentOrders } from './components/RecentOrders';
import { TopBooks } from './components/TopBooks';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageService } from '../../services/local-store.service';
export function DashboardPage() {
    const navigate = useNavigate();

    const [stats, setStats] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [topBooks, setTopBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const [generalStats, ordersData, booksData] = await Promise.all([
                DashboardService.getDashboardGeneralStatistic(),
                DashboardService.getRecentOrders(5),
                DashboardService.getTopBooks(4),
            ]);
            setStats([
                {
                    title: 'Tổng doanh thu',
                    value: generalStats?.totalRevenue
                        ? `${generalStats.totalRevenue.toLocaleString('vi-VN')}đ`
                        : '0đ',
                    change: generalStats?.revenueChange || '0%',
                    icon: DollarSign,
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                },
                {
                    title: 'Đơn hàng',
                    value: generalStats?.totalOrders
                        ? generalStats.totalOrders.toLocaleString('vi-VN')
                        : '0',
                    change: generalStats?.ordersChange || '0%',
                    icon: ShoppingCart,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                },
                {
                    title: 'Khách hàng',
                    value: generalStats?.totalCustomers
                        ? generalStats.totalCustomers.toLocaleString('vi-VN')
                        : '0',
                    change: generalStats?.customersChange || '0%',
                    icon: Users,
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-100',
                },
                {
                    title: 'Sách bán chạy',
                    value: generalStats?.totalBooksSold
                        ? generalStats.totalBooksSold.toLocaleString('vi-VN')
                        : '0',
                    change: generalStats?.booksChange || '0%',
                    icon: BookOpen,
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-100',
                },
            ]);

            setRecentOrders(ordersData || []);
            setTopBooks(booksData || []);
        } catch (error: any) {
            toast.error(
                'Không thể tải dữ liệu bảng điều khiển: ' +
                    (error.message || 'Lỗi hệ thống'),
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
                onNavigate={(path: string) => navigate(path)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentOrders orders={recentOrders} />
                    <TopBooks books={topBooks} />
                </div>
            }
        </div>
    );
}
