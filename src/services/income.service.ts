import { privateApi } from '../api/api';

export type IncomePaymentMethod = 'CASH' | 'TRANSFER' | 'CARD';
export type IncomeStatus = 'COMPLETE' | 'PENDING' | 'CANCEL';

export interface IncomeReceipt {
    id: number;
    code: string;
    cost: number;
    paymentMethod: IncomePaymentMethod;
    createdAt: string;
    updatedAt: string;
    status: IncomeStatus;
    shortDescription: string;
    bill: {
        billId: number;
        billCode: string;
    };
    employee: {
        employeeId: number;
        employeeName: string;
    };
    customer: {
        customerId: number;
        customerName: string;
    };
}

export interface CreateIncomeDto {
    code: string;
    cost: number;
    billCode: string;
    status : string; 
    shortDescription: string;
    paymentMethod: IncomePaymentMethod;
}

export interface UpdateIncomeDto extends Partial<CreateIncomeDto> {}

export interface BillLookupResponse {
    id: number;
    code: string;
    cost: number;
    status: string;
    customer: {
        id: number;
        name: string;
    };
}

export const IncomeService = {
    async getAll() {
        const response = await privateApi.get('/income');
        return response.data
    },

    async getById(id: number) {
        const response = await privateApi.get(`/income/${id}`);
        return response.data;
    },

    async create(dto: CreateIncomeDto) {
        console.log("Du lieu gui di: " , dto) 
        const response = await privateApi.post('/income', dto);
        return response.data;
    },

    async update(id: number, dto: UpdateIncomeDto) {
        const response = await privateApi.put(`/income/${id}`, dto);
        return response;
    },

    async delete(id: number) {
        const response = await privateApi.delete(`/income/${id}`);
        return response.data
    },

    async getBillByCode(code: string) {
        const response = await privateApi.get(`/bill/code/${code}`);
        return (response.data ?? null);
    },
};
