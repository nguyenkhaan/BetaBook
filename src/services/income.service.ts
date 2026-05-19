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
    cost: number;
    billCode: string;
    status: IncomeStatus;
    shortDescription: string;
    paymentMethod: IncomePaymentMethod;
}

export interface UpdateIncomeDto extends Partial<CreateIncomeDto> {}

export interface BillLookupResponse {
    id: number;
    code: string;
    cost: number;
    debit: number;
    status: string;
    customer: {
        id: number;
        name: string;
    };
}

type RawIncomeReceipt = Partial<IncomeReceipt> & {
    bill?: Partial<IncomeReceipt['bill']>;
    employee?: Partial<IncomeReceipt['employee']>;
    customer?: Partial<IncomeReceipt['customer']>;
};

type RawBillLookupResponse = Partial<BillLookupResponse> & {
    customer?: Partial<BillLookupResponse['customer']>;
};

const isIncomePaymentMethod = (
    value: unknown,
): value is IncomePaymentMethod =>
    value === 'CASH' || value === 'TRANSFER' || value === 'CARD';

const isIncomeStatus = (value: unknown): value is IncomeStatus =>
    value === 'COMPLETE' || value === 'PENDING' || value === 'CANCEL';

const normalizeIncomeReceipt = (value: unknown): IncomeReceipt => {
    const receipt = (value ?? {}) as RawIncomeReceipt;

    return {
        id: Number(receipt.id ?? 0),
        code: typeof receipt.code === 'string' ? receipt.code : '',
        cost: Number(receipt.cost ?? 0),
        paymentMethod: isIncomePaymentMethod(receipt.paymentMethod)
            ? receipt.paymentMethod
            : 'CASH',
        createdAt:
            typeof receipt.createdAt === 'string' ? receipt.createdAt : '',
        updatedAt:
            typeof receipt.updatedAt === 'string' ? receipt.updatedAt : '',
        status: isIncomeStatus(receipt.status)
            ? receipt.status
            : 'PENDING',
        shortDescription:
            typeof receipt.shortDescription === 'string'
                ? receipt.shortDescription
                : '',
        bill: {
            billId: Number(receipt.bill?.billId ?? 0),
            billCode:
                typeof receipt.bill?.billCode === 'string'
                    ? receipt.bill.billCode
                    : '',
        },
        employee: {
            employeeId: Number(receipt.employee?.employeeId ?? 0),
            employeeName:
                typeof receipt.employee?.employeeName === 'string'
                    ? receipt.employee.employeeName
                    : '',
        },
        customer: {
            customerId: Number(receipt.customer?.customerId ?? 0),
            customerName:
                typeof receipt.customer?.customerName === 'string'
                    ? receipt.customer.customerName
                    : 'Khách vãng lai',
        },
    };
};

const normalizeBillLookup = (value: unknown): BillLookupResponse | null => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const bill = value as RawBillLookupResponse;
    const customerId = Number(bill.customer?.id ?? 0);
    const billId = Number(bill.id ?? 0);

    if (!billId || !customerId) {
        return null;
    }

    return {
        id: billId,
        code: typeof bill.code === 'string' ? bill.code : '',
        cost: Number(bill.cost ?? 0),
        debit: Number((bill as { debit?: unknown }).debit ?? bill.cost ?? 0),
        status: typeof bill.status === 'string' ? bill.status : '',
        customer: {
            id: customerId,
            name:
                typeof bill.customer?.name === 'string'
                    ? bill.customer.name
                    : 'Chưa có thông tin',
        },
    };
};

export const IncomeService = {
    async getAll(): Promise<IncomeReceipt[]> {
        const response = await privateApi.get('/income');
        
        if (!Array.isArray(response.data)) {
            return [];
        }

        return response.data.map(normalizeIncomeReceipt);
    },

    async getById(id: number): Promise<IncomeReceipt> {
        const response = await privateApi.get(`/income/${id}`);
        console.log("Chi tiet: " , response.data)
        return normalizeIncomeReceipt(response.data);
    },

    async create(dto: CreateIncomeDto): Promise<IncomeReceipt> {
        const response = await privateApi.post('/income', dto);
        return normalizeIncomeReceipt(response.data);
    },

    async update(id: number, dto: UpdateIncomeDto): Promise<IncomeReceipt> {
        const response = await privateApi.put(`/income/${id}`, dto);
        return normalizeIncomeReceipt(response.data);
    },

    async delete(id: number): Promise<void> {
        await privateApi.delete(`/income/${id}`);
    },

    async getBillByCode(code: string): Promise<BillLookupResponse | null> {
        const response = await privateApi.get(`/bill/code/${code}`);
        return normalizeBillLookup(response.data);
    },
};
