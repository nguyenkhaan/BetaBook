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

export interface CustomerGrade {
    grade: string;
    total: number;
    revenue?: number;
    avgOrder?: number;
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

export const ReportService = {
    getGeneralRevenue: async (): Promise<GeneralRevenue> => {
        const response = await privateApi.get('/statistic/revenue');
        return response.data;
    },

    getRevenueChart: async (months: number = 6): Promise<ChartData[]> => {
        const response = await privateApi.get(
            `/statistic/revenue/month/${months}`,
        );
        return response.data;
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

    getCustomersByGrade: async (): Promise<CustomerGrade[]> => {
        const response = await privateApi.get('/statistic/customers');
        return response.data;
    },

    getDebtReport: async (month: string): Promise<DebtItem[]> => {
        const response = await privateApi.get('/statistic/debt', {
            params: { month },
        });
        return response.data;
    },

    getDebtSummary: async (month: string): Promise<DebtSummary> => {
        const response = await privateApi.get('/statistic/debt/summary', {
            params: { month },
        });
        return response.data;
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
