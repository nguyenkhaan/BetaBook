import { privateApi } from '../api/api';

// Sync với VoucherType trong Prisma
export type VoucherType = 'PERCENT' | 'VND';
// Sync với VoucherStatus trong Prisma
export type VoucherStatus = 'APPLYING' | 'UPCOMING' | 'ENDED';

export interface Voucher {
    id: number;
    name: string;
    code: string; 
    eventName: string;
    sale: number;
    status: VoucherStatus;
    usedNumber: number;
    quantity: number;
    expiresAt: string;
    startDate?: string | null;
    description?: string;
    type: VoucherType;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface VoucherData {
    name: string;
    code: string;
    eventName: string;
    sale: number;
    status: VoucherStatus;
    quantity: number;
    expiresAt: string;
    startDate?: string;
    description?: string;
    type: VoucherType;
    usedNumber?: number;
}

export interface VoucherStatistic {
    totalEvents: number;
    applying: number;
    upcoming: number;
    ended: number;
}

export class VoucherService {
    private static readonly BASE_URL = '/voucher';

    // Lấy các enum Type và Status từ BE
    static async getOptions() {
        const response = await privateApi.get(`${this.BASE_URL}/options`);
        return response.data;
    }

    // Lấy tất cả voucher chưa xóa
    static async getAllVoucher(): Promise<Voucher[]> {
        const response = await privateApi.get(this.BASE_URL);
        return response.data;
    }

    // Lấy danh sách voucher có thể sử dụng (thỏa mãn điều kiện quantity, date, status)
    static async getVouchersInUse(): Promise<Voucher[]> {
        const response = await privateApi.get(`${this.BASE_URL}/use`);
        return response.data;
    }

    // Lấy thống kê tổng quan (Applying, Upcoming, Ended)
    static async getStatistic(): Promise<VoucherStatistic> {
        const response = await privateApi.get(`${this.BASE_URL}/statistic`);
        return response.data;
    }

    static async getVoucherById(id: number): Promise<Voucher> {
        const response = await privateApi.get(`${this.BASE_URL}/${id}`);
        return response.data;
    }

    static async createVoucher(data: Omit<VoucherData , 'code'>): Promise<Voucher> {
        const response = await privateApi.post(this.BASE_URL, data);
        return response.data;
    }

    static async updateVoucher(
        id: number | string,
        data: Partial<VoucherData>,
    ): Promise<Voucher> {
        const response = await privateApi.put(`${this.BASE_URL}/${id}`, data);
        return response.data;
    }

    static async deleteVoucher(id: number | string): Promise<Voucher> {
        const response = await privateApi.delete(`${this.BASE_URL}/${id}`);
        return response.data;
    }
}
