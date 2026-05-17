import { privateApi } from '../api/api';
import { ImportOrder } from '../pages/import/ImportPage';

export const ImportService = {
    getAll: async (): Promise<ImportOrder[]> => {
        const response = await privateApi.get('/imports');
        return response.data;
    },

    getById: async (id: number): Promise<ImportOrder> => {
        const response = await privateApi.get(`/imports/${id}`);
        return response.data;
    },

    create: async (dto: any): Promise<ImportOrder> => {
        const response = await privateApi.post('/imports', dto);
        return response.data;
    },

    createWithNewBook: async (formData: FormData): Promise<ImportOrder> => {
        const response = await privateApi.post(
            '/imports/with-new-book',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.data;
    },

    update: async (id: number, dto: any): Promise<ImportOrder> => {
        const response = await privateApi.put(`/imports/${id}`, dto);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        const response = await privateApi.delete(`/imports/${id}`);
        return response.data;
    },
};
