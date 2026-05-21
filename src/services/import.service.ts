import { privateApi } from '../api/api';
import { ImportOrder } from '../pages/import/ImportPage';

export interface BackendOutcomeBookItem {
    bookId: number;
    bookCode: string;
    bookTitle: string;
    bookCost: number | string;
    importUnitCost: number | string;
    quantity: number;
    lineTotal: number | string;
    year: number;
    category: string;
}

export interface BackendOutcome {
    id: number;
    code: string;
    cost: number | string;
    status: 'COMPLETE' | 'PENDING' | 'CANCEL';
    quantity?: number;
    publisherId?: number;
    publisherName?: string;
    createdBy?: string;
    createdAt: string;
    book?: {
        id: number;
        code: string;
        title: string;
        cost: number | string;
        year: number;
        category: string;
    };
    bookItemList?: BackendOutcomeBookItem[];
}

export interface CreateOutcomePayload {
    publisherId: number;
    status: 'COMPLETE' | 'PENDING' | 'CANCEL';
    items: Array<{
        code: string;
        baseCost: number;
        quantity: number;
        bookTitle?: string;
        year?: number;
    }>;
}

const extractPayload = <T,>(response: any): T => {
    if (response && typeof response === 'object' && 'data' in response) {
        return response.data as T;
    }

    return response as T;
};

const mapOutcomeToImportOrder = (outcome: BackendOutcome): ImportOrder => {
    const createdAt = new Date(outcome.createdAt);
    const details = (outcome.bookItemList || []).map((item) => ({
        type: 'existing' as const,
        bookId: item.bookId,
        bookCode: item.bookCode,
        bookName: item.bookTitle,
        importPrice: Number(item.importUnitCost || 0),
        quantity: Number(item.quantity || 0),
        lineTotal: Number(item.lineTotal || 0),
        year: item.year,
        category: item.category,
        bookCost: Number(item.bookCost || 0),
    }));

    return {
        id: outcome.id,
        importNumber: outcome.code,
        supplier: outcome.publisherName || '',
        supplierId: outcome.publisherId,
        date: createdAt.toISOString().split('T')[0],
        time: createdAt.toTimeString().slice(0, 5),
        totalAmount: Number(outcome.cost || 0),
        totalItems: Number(outcome.quantity || 0),
        status: outcome.status,
        createdBy: outcome.createdBy || '',
        note: '',
        details,
    };
};

export const ImportService = {
    getAll: async (): Promise<ImportOrder[]> => {
        const response = await privateApi.get('/outcome');
        const payload = extractPayload<BackendOutcome[]>(response);
        return Array.isArray(payload)
            ? payload.map(mapOutcomeToImportOrder)
            : [];
    },

    getById: async (id: number): Promise<ImportOrder> => {
        const response = await privateApi.get(`/outcome/${id}`);
        return mapOutcomeToImportOrder(extractPayload<BackendOutcome>(response));
    }, 

    create: async (dto: CreateOutcomePayload): Promise<ImportOrder[]> => {
        const response = await privateApi.post('/outcome', dto);
        const payload = extractPayload<BackendOutcome[]>(response);
        return Array.isArray(payload)
            ? payload.map(mapOutcomeToImportOrder)
            : [];
    },

    update: async (
        id: number,
        dto: {
            code?: string;
            baseCost?: number;
            quantity?: number;
            publisherId?: number;
            status?: 'COMPLETE' | 'PENDING' | 'CANCEL';
        },
    ): Promise<ImportOrder> => {
        const response = await privateApi.put(`/outcome/${id}`, dto);
        return mapOutcomeToImportOrder(extractPayload<BackendOutcome>(response));
    },

    delete: async (id: number): Promise<void> => {
        await privateApi.delete(`/outcome/${id}`);
    },
};
