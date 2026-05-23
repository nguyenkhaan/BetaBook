import { privateApi } from '../api/api';
export class AdminService {
    static async resetEmployeePassword(id: number) {
        const response = await privateApi.post(
            `/admin/employee/reset-password/${id}`,
        );
        return response.data;
    }
    static async resetCustomerPassword(id: number) {
        const response = await privateApi.post(
            `/admin/customer/reset-password/${id}`,
        );
        return response.data;
    }
}
