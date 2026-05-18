import { privateApi } from '../api/api';
import { Customer } from '../pages/customer/CustomersPage';

export interface CustomerPayload {
    name: string;
    email: string;
    phone: string;
    grade: Customer['grade'];
    password: string;
}

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

    static async createCustomer(data: CustomerPayload) {
        const payload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password ?? '',
            grade: data.grade,
        };
        const response = await privateApi.post('/customer', payload);
        return response.data;
    }

    static async updateCustomer(id: number, data: Partial<CustomerPayload>) {
        const updateData: Partial<CustomerPayload> = {};
        if (typeof data.email === 'string') updateData.email = data.email;
        if (typeof data.name === 'string') updateData.name = data.name;
        if (typeof data.phone === 'string') updateData.phone = data.phone;
        if (typeof data.grade === 'string') updateData.grade = data.grade;
        const response = await privateApi.put(`/customer/${id}`, updateData);
        return response.data;
    }

    static async deleteCustomer(id: number) {
        const response = await privateApi.delete(`/customer/${id}`);
        return response.data;
    }
}
