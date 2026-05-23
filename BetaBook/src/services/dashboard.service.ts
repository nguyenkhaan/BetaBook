import { privateApi } from '../api/api';

export class DashboardService {
    static async getDashboardGeneralStatistic() {
        const response = await privateApi.get('/statistic/general');
        return response.data;
    }

    static async getRecentOrders(limit: number = 5) {
        const response = await privateApi.get('/statistic/recent-orders', {
            params: { limit },
        });
        return response.data;
    }

    static async getTopBooks(limit: number = 4) {
        const response = await privateApi.get('/statistic/top-books', {
            params: { limit },
        });
        return response.data;
    }
}
