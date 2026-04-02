import { privateApi } from '../api/api'; // Giả định bạn có instance axios chung
import { ImportOrder } from '../pages/import/ImportPage';

export const ImportService = {
    getAll: async (): Promise<ImportOrder[]> => {
        const response = await privateApi.get('/income'); // Đổi thành /import nếu BE đã đổi route
        return response.data;
    },

    // Lấy chi tiết 1 phiếu
    getById: async (id: number): Promise<ImportOrder> => {
        const response = await privateApi.get(`/income/${id}`);
        return response.data;
    },

    // Tạo mới phiếu nhập
    create: async (dto: any) => {
        const response = await privateApi.post('/income', dto);
        return response.data;
    },

    // Cập nhật phiếu nhập
    update: async (id: number, dto: any) => {
        const response = await privateApi.put(`/income/${id}`, dto);
        return response.data;
    },

    // Xóa (Soft delete)
    delete: async (id: number) => {
        const response = await privateApi.delete(`/income/${id}`);
        return response.data;
    },
};
