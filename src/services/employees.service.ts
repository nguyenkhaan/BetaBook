import { privateApi } from '../api/api';

export interface Employees {
    id: number;
    code: string;
    email: string;
    phone: string;
    avatar: string | null;
    departmentName: string;
    positionName: string;
    status?: string;
    name?: string;
}

export class EmployeesService {
    static async getAllEmployees(): Promise<Employees[]> {
        const response = await privateApi.get('/employee');
        const data = response.data;

        return data.map((emp: any) => ({
            id: emp.id,
            code: emp.code,
            email: emp.email,
            phone: emp.phone,
            avatar: emp.avatar,
            departmentName: emp.department?.name || 'N/A',
            positionName: emp.position?.name || 'N/A',
            name: emp.name || emp.email.split('@')[0], 
        }));
    }

   
    static async getMyProfile(): Promise<Employees> {
        const response = await privateApi.get('/employee/profile');
        return response.data;
    }

    static async getEmployeeByCode(
        code: string,
    ): Promise<{ id: number; code: string }> {
        const response = await privateApi.get(`/employee/code?code=${code}`);
        return response.data;
    }

    static async verifyAccount(token: string) {
        const response = await privateApi.get(
            `/employee/verify?token=${token}`,
        );
        return response.data;
    }

    static async createEmployee(
        data: Omit<Employees, 'id' | 'departmentName' | 'positionName'>,
    ) {
        const response = await privateApi.post('/employee', data);
        return response.data;
    }

    static async updateEmployee(id: number, data: any) {
        const response = await privateApi.patch(`/employee/${id}`, data);
        return response.data;
    }

    static async getStatistics() {
        const response = await privateApi.get('/employee/statistic');
        return response.data;
    }
    
}
