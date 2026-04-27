import { privateApi } from '../api/api';

export interface GeneralRevenue {
    monthRevenue: number;
    revenueProportionRate: number;
    countBills: number;
    countBillsProportionRate: number;
    avgBills: number | null;
    avgBillsProportionRate: number;
}

export interface ChartData {
    month: string;
    revenue: number;
}

export interface TopBook {
    id: number;
    code: string;
    title: string;
    sum: number;
}

export interface InventoryByCategory {
    category: string;
    count: number;
    totalValue: number;
}

export interface CustomerGrade {
    grade: string;
    total: number;
}

export interface DebtItem {
    id: number | string;
    customerName: string;
    beginningDebt: number;
    transactions: number;
    endingDebt: number;
}

export interface DebtSummary {
    totalBeginningDebt: number;
    totalTransactions: number;
    totalEndingDebt: number;
}

const parseDate = (monthStr: string) => {
    const [year, month] = monthStr.split('-').map(Number);
    return { month, year };
};

export const ReportService = {
    // 1. Thống kê tổng quan (Tháng hiện tại)
    getGeneralRevenue: async (): Promise<GeneralRevenue> => {
        const response = await privateApi.get('/statistic/revenue');
        return response.data;
    },

    // 2. Biểu đồ doanh thu 6 tháng (Truyền đúng param vào URL)
    getRevenueChart: async (months: number = 6): Promise<ChartData[]> => {
        const response = await privateApi.get(
            `/statistic/revenue/month/${months}`,
        );
        return response.data.map((item: any) => ({
            month: item.month,
            revenue: Number(item.revenue) || 0, // Đảm bảo luôn là kiểu number
        }));
    },
    // 3. Biểu đồ đơn hàng 6 tháng
    getOrdersChart: async (months: number = 6): Promise<ChartData[]> => {
        const response = await privateApi.get(
            `/statistic/revenue/bill/${months}`,
        );
        return response.data.map((item: any) => ({
            month: item.month,
            revenue: Number(item.revenue), // BE dùng Alias 'revenue' trong queryRaw
        }));
    },

    getTopBooks: async (): Promise<TopBook[]> => {
        const response = await privateApi.get('/statistic/top-books');
        return response.data;
    },

    getInventoryByCategory: async (): Promise<InventoryByCategory[]> => {
        const response = await privateApi.get('/statistic/inventory');
        return response.data;
    },

    getCustomersByGrade: async (): Promise<CustomerGrade[]> => {
        const response = await privateApi.get('/statistic/customers');
        return response.data;
    },

    // 4. Báo cáo công nợ (Đã sửa lại để đồng bộ Backend query)
    getDebtData: async (
        monthStr: string,
    ): Promise<{ list: DebtItem[]; summary: DebtSummary }> => {
        const { month, year } = parseDate(monthStr);
        // Lưu ý: Endpoint này bạn cần tạo thêm ở Backend hoặc dùng /statistic/:month hiện có
        const response = await privateApi.get(`/statistic/debt`, {
            params: { month, year },
        });

        return {
            list: response.data?.list || [],
            summary: response.data?.summary || {
                totalBeginningDebt: 0,
                totalTransactions: 0,
                totalEndingDebt: 0,
            },
        };
    },

    exportReport: async (type: string, monthStr: string) => {
        const { month, year } = parseDate(monthStr);
        const response = await privateApi.get(`/statistic/export`, {
            params: { type, month, year },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
            'download',
            `Bao-cao-${type}-thang-${month}-${year}.xlsx`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
