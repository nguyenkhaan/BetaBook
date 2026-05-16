import { privateApi } from '../api/api';
import { ImportOrder } from '../pages/import/ImportPage';

export const ImportService = {
    getAll: async (): Promise<ImportOrder[]> => {
        const response = await privateApi.get('/income');
        return response.data;
    },

    getById: async (id: number): Promise<ImportOrder> => {
        const response = await privateApi.get(`/income/${id}`);
        return response.data;
    },

    create: async (dto: any) => {
        const response = await privateApi.post('/income', dto);
        return response.data;
    },

    createWithNewBook: async (formData: FormData) => {
        const response = await privateApi.post(
            '/income/with-new-book',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.data;
    },

    update: async (id: number, dto: any) => {
        const response = await privateApi.put(`/income/${id}`, dto);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await privateApi.delete(`/income/${id}`);
        return response.data;
    },
};
