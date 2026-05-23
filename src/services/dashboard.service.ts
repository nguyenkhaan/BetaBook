import { privateApi } from '../api/api';

export interface GeneralStatistic {
    totalRevenue: number;
    totalCustomers: number;
    totalBills: number;
    totalBooks: number;
}

export interface RecentOrder {
    id: number;
    code: string | number;
    customer: string;
    amount: string;
    status: string;
    date: string;
}

export interface TopBook {
    title: string;
    author: string;
    sold: number;
    revenue: string;
}

export class DashboardService {
    static async getGeneralStatistic(): Promise<GeneralStatistic> {
        const res = await privateApi.get('/statistic/general');
        return res.data;
    }

    static async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
        const res = await privateApi.get('/statistic/recent-orders', {
            params: { limit },
        });
        return (res.data ?? []).map((item: any) => ({
            id: item.id,
            code: item.code,
            customer: item.customer?.name ?? '',
            amount: `${(Number(item.amount) || 0).toLocaleString('vi-VN')}đ`,
            status: item.status,
            date: item.date,
        }));
    }

    static async getTopBooks(limit: number = 4): Promise<TopBook[]> {
        const res = await privateApi.get('/statistic/top-books', {
            params: { limit },
        });
        return (res.data ?? []).map((item: any) => ({
            title: item.title,
            author: item.bookCode ?? '',
            sold: Number(item.totalSold) || 0,
            revenue: '',
        }));
    }
}
