import { privateApi } from '../api/api';

export type VoucherStatus = 'APPLYING' | 'EXPIRED' | 'DISABLE';
export type VoucherType = 'PERCENTAGE' | 'FIXED';

export interface Voucher {
    id: number;
    name: string;
    eventName: string;
    sale: number;
    status: VoucherStatus;
    quantity: number;
    usedNumber: number;
    expiresAt: string;
    type: VoucherType;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface VoucherData {
    name: string;
    eventName: string;
    sale: number;
    status: VoucherStatus;
    quantity: number;
    expiresAt: string;
    type: VoucherType;
}

export class PromotionService {
    private static readonly BASE_URL = '/voucher';

    static async getAllVoucher(): Promise<Voucher[]> {
        const responseData = await privateApi.get(this.BASE_URL);
        return responseData.data;
    }

    static async getVouchersInUse(): Promise<Voucher[]> {
        const response = await privateApi.get(`${this.BASE_URL}/use`);
        return response.data;
    }

    static async getVoucherById(id: number): Promise<Voucher> {
        const response = await privateApi.get(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    static async createVoucher(data: VoucherData): Promise<Voucher> {
        const response = await privateApi.post(this.BASE_URL, data);
        return response.data;
    }

    static async updateVoucher(
        id: number,
        data: Partial<VoucherData>,
    ): Promise<Voucher> {
        const response = await privateApi.put(`${this.BASE_URL}/${id}`, data);
        return response.data;
    }

    static async deleteVoucher(id: number): Promise<Voucher> {
        const response = await privateApi.delete(`${this.BASE_URL}/${id}`);
        return response.data;
    }
}
