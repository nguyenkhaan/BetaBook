import { privateApi } from '../api/api';

export interface GeneralStatistic {
    totalRevenue: number;
    totalCustomers: number;
    totalBills: number;
    totalBooks: number;
}

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

export interface DynamicReportData {
    date: string;
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

export interface BestSellingBook {
    bookId: number;
    bookCode: string;
    title: string;
    quantitySold: number;
}

export interface InventoryByCategory {
    categoryCode: string;
    categoryName: string;
    value: number;
}

export interface InventoryFlowData {
    month: string;
    importQuantity: number;
    exportQuantity: number;
}

export interface CustomerGrade {
    grade: string;
    total: number;
}

export interface TopCustomer {
    customerId: number;
    customerCode: string;
    customerName: string;
    email: string;
    phone: string;
    grade: string;
    totalPaid: number;
}

export interface RecentOrder {
    id: number;
    code: string;
    amount: number;
    status: string;
    date: string;
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

export const ReportService = {
    getGeneralStatistic: async (): Promise<GeneralStatistic> => {
        const response = await privateApi.get('/statistic/general');
        return response.data;
    },

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

    getRevenueInMonths: async (months: number): Promise<ChartData[]> => {
        const response = await privateApi.get(
            `/statistic/revenue/month/${months}`,
        );
        return response.data.map((item: any) => ({
            month: item.month,
            revenue: Number(item.revenue) || 0,
        }));
    },

    getBillCountChart: async (months: number = 6): Promise<ChartData[]> => {
        const response = await privateApi.get(
            `/statistic/revenue/bill/${months}`,
        );
        return response.data.map((item: any) => ({
            month: item.month,
            revenue: Number(item.bill_count) || 0,
        }));
    },

    getDynamicReport: async (
        startDate: string,
        endDate: string,
    ): Promise<DynamicReportData[]> => {
        const response = await privateApi.get(
            '/statistic/revenue/dynamic-report',
            {
                params: { startDate, endDate },
            },
        );
        return response.data.map((item: any) => ({
            date: item.date,
            totalRevenue: Number(item.totalRevenue) || 0,
            actualReceived: Number(item.actualReceived) || 0,
            debtAdded: Number(item.debtAdded) || 0,
        }));
    },

    getTopCustomers: async (limit: number = 10): Promise<TopCustomer[]> => {
        const response = await privateApi.get('/statistic/top-customer', {
            params: { limit },
        });
        return response.data.map((item: any) => ({
            customerId: item.customerId,
            customerCode: item.customerCode,
            customerName: item.customerName,
            email: item.email,
            phone: item.phone,
            grade: item.grade,
            totalPaid: Number(item.totalPaid) || 0,
        }));
    },

    getRecentOrders: async (limit: number = 10): Promise<RecentOrder[]> => {
        const response = await privateApi.get('/statistic/recent-orders', {
            params: { limit },
        });
        return response.data.map((item: any) => ({
            id: item.id,
            code: item.code,
            amount: Number(item.amount) || 0,
            status: item.status,
            date: item.date,
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

    getTop5BestSellingBooks: async (): Promise<BestSellingBook[]> => {
        const response = await privateApi.get(
            '/statistic/top-books/best-selling',
        );
        return response.data.map((item: any) => ({
            bookId: item.bookId,
            bookCode: item.bookCode,
            title: item.title,
            quantitySold: Number(item.quantitySold) || 0,
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

    getTotalBooksImportedInMonth: async (): Promise<{
        totalBooksImported: number;
    }> => {
        const response = await privateApi.get(
            '/statistic/inventory/imported-month',
        );
        return {
            totalBooksImported: Number(response.data.totalBooksImported) || 0,
        };
    },

    getCustomersByGrade: async (): Promise<CustomerGrade[]> => {
        const response = await privateApi.get('/statistic/customers');
        return response.data;
    },

    getTotalOrdersInCurrentMonth: async (): Promise<{
        totalOrdersInMonth: number;
    }> => {
        const response = await privateApi.get(
            '/statistic/orders/current-month',
        );
        return {
            totalOrdersInMonth: Number(response.data.totalOrdersInMonth) || 0,
        };
    },

    getRawDebt: async (): Promise<RawDebtItem[]> => {
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
};
