import { privateApi } from '../api/api';

export interface BillDetail {
    bookId: string;
    quantity: number;
}

export interface Voucher {
    id: number;
    code: string;
    name: string;
    description: string;
    type: 'PERCENT' | 'VND';
    sale: number; // value
    status: string;
    quantity: number;
    expiresAt: string;
}
 
export interface CreateInvoiceDto {
    code: string;
    customerId: number;
    status: string;
    cost?: number; 
    billDetail: BillDetail[];
    voucherUsage?: VoucherUsage[];
}

export interface UpdateInvoiceDto extends Partial<CreateInvoiceDto> {}

export interface Invoice {
    id: number;
    code: string;
    customerId: number;
    cost: number;
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
    static async update(billId : number , data : any) {
        console.log(billId , "Data la: " , data) 
        const response = await privateApi.put(`/bill/${billId}` , data)
        console.log(response.data) 
        return response.data 
        
    }
    static async create(dto: CreateInvoiceDto): Promise<{ bill: Invoice }> {
        const response = await privateApi.post(this.BASE_URL, dto);
        return response.data;
    }

    static async getVouchers(): Promise<Voucher[]> {
        const response = await privateApi.get('/voucher/use');
        return response.data;
    }

    static async delete(id: number): Promise<any> {
        const response = await privateApi.delete(`${this.BASE_URL}/${id}`);
        return response.data;
    }
}
