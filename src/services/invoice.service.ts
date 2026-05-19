import { privateApi } from '../api/api';

export interface BillDetail {
    bookId: number;
    bookCode: string;
    quantity: number;
}

export interface VoucherUsage {
    voucherId: number;
}

export interface CreateInvoiceDto {
    customerId?: number;
    customerPhone: string;
    status: string;
    temporaryCost?: number;
    cost?: number;
    billDetails: BillDetail[];
    vouchers?: VoucherUsage[];
}

export interface UpdateInvoiceDto extends Partial<CreateInvoiceDto> {}

export interface Invoice {
    id: number;
    code: string;
    customerId: number;
    cost?: number;
    status: string;
    createdAt: string;
    billDetail?: any[];
    voucherUsage?: any[];
}


export class InvoiceService {
    private static readonly BASE_URL = '/bill'; 

    static async getAll(): Promise<Invoice[]> {
        const response = await privateApi.get(this.BASE_URL);
        return response.data;
    }

    static async create(dto: CreateInvoiceDto) {
        // console.log("Du lieu hoa don la: " , dto) 
        const response = await privateApi.post(this.BASE_URL, dto);
        return response.data;
    }

    static async update(id: number, dto: UpdateInvoiceDto): Promise<Invoice> {
        const response = await privateApi.put(`${this.BASE_URL}/${id}`, dto);
        return response.data;
    }

    static async delete(id: number): Promise<any> {
        const response = await privateApi.delete(`${this.BASE_URL}/${id}`);
        return response.data;
    }
}
