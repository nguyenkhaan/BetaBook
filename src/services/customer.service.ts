import { privateApi } from '../api/api';
import { Customer } from '../pages/customer/CustomersPage';
import { MemberGradeLabel } from '../utilis/label_mapper';
export class CustomerService {
    static async getAllCustomers(): Promise<Customer[]> {
        const response = await privateApi.get('/customer');
        const data = response.data;

        return data.map((item: any) => ({
            id: item.id,
            code: item.code,
            name: item.name,
            email: item.email,
            phone: item.phone,
            totalOrders: 0,
            totalSpent: item.totalPaid,
            grade: item.grade, 
            joinDate: new Date().toISOString().split('T')[0],
        }));
    }
   

    static async getGeneralStatistics() {
        const response = await privateApi.get('/customer/statistic');
        return response.data;
    }

    static async getCustomerByPhone(phone: string): Promise<Customer> {
        const response = await privateApi.get(`/customer/phone?phone=${phone}`);
        return response.data;
    }

    static async createCustomer(data: Omit<Customer, 'id' | 'code' | 'joinDate' | 'totalOrders' | 'totalSpent'>) {
        // Chú ý: BE hiện tại chưa có hàm create trong Controller bạn gửi
        console.log(data) 
        const response = await privateApi.post('/customer', data);
        return response.data;
    }

    static async updateCustomer(id: number, data: Partial<Customer>) {
        const updateData: Partial<Customer> & { grade?: string } = {};
        if (data.email) updateData.email = data.email;
        if (data.name) updateData.name = data.name;
        if (data.phone) updateData.phone = data.phone;
        if (data.grade
        ) updateData.grade = data.grade;
        const response = await privateApi.put(`/customer/${id}`, updateData);
        return response.data;
    }

    static async deleteCustomer(id: number) {
        const response = await privateApi.delete(`/customer/${id}`);
        return response.data;
    }
}
