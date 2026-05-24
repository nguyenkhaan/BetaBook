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

export interface RevenueChartData {
    month: string;
    totalRevenue: number;
    actualReceived: number;
    debtAdded: number;
}

export interface TopBook {
    bookId: number;
    bookCode: string;
    title: string;
    totalSold: number;
}

export interface InventoryByCategory {
    categoryCode: string;
    categoryName: string;
    value: number;
}

// NEW: inventory flow (import vs export per month)
export interface InventoryFlowData {
    month: string;
    importQuantity: number;
    exportQuantity: number;
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

interface RawDebtItem {
    date: string;
    customer: { id: number; name: string };
    openingDebt: number;
    generatedDebt: number;
    closingDebt: number;
}

const parseDate = (monthStr: string) => {
    const [year, month] = monthStr.split('-').map(Number);
    return { month, year };
};

export const ReportService = {
    getGeneralRevenue: async (): Promise<GeneralRevenue> => {
        const response = await privateApi.get('/statistic/revenue');
        return response.data;
    },

    getRevenueChart: async (
        months: number = 6,
    ): Promise<RevenueChartData[]> => {
        const response = await privateApi.get('/statistic/revenue/chart', {
            params: { month: months },
        });
        return response.data.map((item: any) => ({
            month: item.month,
            totalRevenue: Number(item.totalRevenue) || 0,
            actualReceived: Number(item.actualReceived) || 0,
            debtAdded: Number(item.debtAdded) || 0,
        }));
    },

    getOrdersChart: async (months: number = 6): Promise<ChartData[]> => {
        const response = await privateApi.get(
            `/statistic/revenue/bill/${months}`,
        );
        return response.data.map((item: any) => ({
            month: item.month,
            revenue: Number(item.bill_count) || 0,
        }));
    },

    getTopBooks: async (limit: number = 5): Promise<TopBook[]> => {
        const response = await privateApi.get('/statistic/top-books', {
            params: { limit },
        });
        return response.data.map((item: any) => ({
            bookId: item.bookId,
            bookCode: item.bookCode,
            title: item.title,
            totalSold: Number(item.totalSold) || 0,
        }));
    },

    getInventoryByCategory: async (): Promise<InventoryByCategory[]> => {
        const response = await privateApi.get('/statistic/inventory');
        return response.data.map((item: any) => ({
            categoryCode: item.categoryCode,
            categoryName: item.categoryName,
            value: Number(item.value) || 0,
        }));
    },

    // NEW: fetches monthly import vs export quantities
    getInventoryFlow: async (
        months: number = 6,
    ): Promise<InventoryFlowData[]> => {
        const response = await privateApi.get('/statistic/inventory-flow', {
            params: { limit: months },
        });
        return response.data.map((item: any) => ({
            month: item.month,
            importQuantity: Number(item.importQuantity) || 0,
            exportQuantity: Number(item.exportQuantity) || 0,
        }));
    },

    getCustomersByGrade: async (): Promise<CustomerGrade[]> => {
        const response = await privateApi.get('/statistic/customers');
        return response.data;
    },

    // Internal: returns the raw server response for debt progression (all months)
    getRawDebt: async () => {
        const response = await privateApi.get('/statistic/customer/debit');
        return response.data ?? [];
    },

    getDebtData: async (
        monthStr: string,
    ): Promise<{ list: DebtItem[]; summary: DebtSummary }> => {
        const response = await privateApi.get('/statistic/customer/debit');
        const allRows: RawDebtItem[] = response.data || [];

        const filtered = allRows.filter((row) => row.date === monthStr);

        const list: DebtItem[] = filtered.map((row) => ({
            id: row.customer.id,
            customerName: row.customer.name,
            beginningDebt: Number(row.openingDebt) || 0,
            transactions: Number(row.generatedDebt) || 0,
            endingDebt: Number(row.closingDebt) || 0,
        }));

        const summary: DebtSummary = {
            totalBeginningDebt: list.reduce((s, r) => s + r.beginningDebt, 0),
            totalTransactions: list.reduce((s, r) => s + r.transactions, 0),
            totalEndingDebt: list.reduce((s, r) => s + r.endingDebt, 0),
        };

        return { list, summary };
    },

    exportReport: async (type: string, monthStr: string) => {
        const { month, year } = parseDate(monthStr);
        const response = await privateApi.get('/statistic/export', {
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