import { privateApi } from '../api/api';

export interface GeneralRevenue {
    monthRevenue: number;
    revenueProportionRate: number;
    countBills: number;
    countBillsProportionRate: number;
    avgBills: number;
    avgBillsProportionRate: number;
}

export interface ChartData {
    month: string;
    revenue: number;
    orders?: number;
}

export interface TopBook {
    id: number;
    code: string;
    title: string;
    sum: number;
    revenue?: number;
}

export interface InventoryByCategory {
    category: string;
    count: number;
    totalValue: number;
    stock?: number;
}

export interface DebtItem {
    date: string;
    customer: {
        id: number;
        name: string;
    };
    openingDebt: number;
    generatedDebt: number;
    closingDebt: number;
}

export interface DebtSummary {
    totalBeginningDebt: number;
    totalTransactions: number;
    totalEndingDebt: number;
}

export interface TopCustomerItem {
    customerId: number;
    customerCode: string;
    customerName: string;
    email?: string | null;
    phone?: string | null;
    grade?: string;
    totalPaid: number;
}

export const ReportService = {
    getGeneralRevenue: async (): Promise<GeneralRevenue> => {
        const response = await privateApi.get('/statistic/revenue');
        return response.data;
    },

    getRevenueChart: async (month: number = 6): Promise<ChartData[]> => {
        const response = await privateApi.get('/statistics/revenue/chart', {
            params: { month },
        });
        return (response.data ?? []).map((item: any) => ({
            month: String(item?.month ?? ''),
            revenue: Number(item?.revenue ?? 0),
        }));
    },

    getOrdersChart: async (months: number = 6): Promise<ChartData[]> => {
        const response = await privateApi.get(
            `/statistic/revenue/bill/${months}`,
        );
        return response.data;
    },

    getTopBooks: async (): Promise<TopBook[]> => {
        const response = await privateApi.get('/statistic/top-books');
        return response.data;
    },

    getInventoryByCategory: async (): Promise<InventoryByCategory[]> => {
        const response = await privateApi.get('/statistic/inventory');
        return response.data;
    },

    getCustomerDebit: async (): Promise<DebtItem[]> => {
        const response = await privateApi.get('/statistics/customer/debit');
        return response.data;
    },

    getTopCustomers: async (limit: number = 10): Promise<TopCustomerItem[]> => {
        const response = await privateApi.get('/statistics/top-customer', {
            params: { limit },
        });
        return (response.data ?? []).map((item: any) => ({
            customerId: Number(item?.customerId ?? 0),
            customerCode: String(item?.customerCode ?? ''),
            customerName: String(item?.customerName ?? ''),
            email: item?.email ?? null,
            phone: item?.phone ?? null,
            grade: item?.grade ?? '',
            totalPaid: Number(item?.totalPaid ?? 0),
        }));
    },

    exportReport: async (type: string, month: string) => {
        const response = await privateApi.get(`/statistic/export`, {
            params: { type, month },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report-${type}-${month}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
