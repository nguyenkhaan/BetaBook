import { privateApi } from '../api/api';
export class DashboardService {
    static async getDashboardGeneralStatistic() {
        const response = await privateApi.get('/statistic/general');
        return response;
    }
}
