import { privateApi } from '../api/api';

export interface OutcomeStatusOptionsResponse {
    status: string[];
}

export interface OutcomePublisher {
    id: number;
    name: string;
}

export interface OutcomeBook {
    id: number;
    code: string;
    title: string;
}

export interface OutcomeListItemResponse {
    id: number;
    code: string;
    cost: number;
    status: string;
    quantity?: number;
    createdAt: string;
    publisher?: {
        name?: string;
    };
    creator?: {
        name?: string;
    };
}

export interface CreateOutcomeDto {
    code: string;
    publisherId: number;
    cost: number;
    status: string;
    quantity: number;
    bookCode: string;
}

export interface UpdateOutcomeDto extends Partial<CreateOutcomeDto> {}

export const OutcomeService = {
    async getAll() {
        const response = await privateApi.get('/outcome');
        return response.data as OutcomeListItemResponse[];
    },

    async getOptions() {
        const response = await privateApi.get('/outcome/options');
        return response.data as OutcomeStatusOptionsResponse;
    },

    async create(dto: CreateOutcomeDto) {
        const response = await privateApi.post('/outcome', dto);
        return response.data;
    },

    async update(outcomeId: number, dto: UpdateOutcomeDto) {
        const response = await privateApi.put(`/outcome/${outcomeId}`, dto);
        return response.data;
    },

    async delete(outcomeId: number) {
        const response = await privateApi.delete(`/outcome/${outcomeId}`);
        return response.data;
    },

    async getPublishers() {
        const response = await privateApi.get('/publisher/search', {
            params: { name: '' },
        });
        return (response.data ?? []) as OutcomePublisher[];
    },

    async getBooks() {
        const response = await privateApi.get('/book');
        const books = (response.data ?? []) as Array<{
            id?: number;
            code?: string;
            title?: string;
        }>;
        return books
            .filter((book) => Boolean(book?.id) && Boolean(book?.code))
            .map((book) => ({
                id: Number(book.id),
                code: String(book.code),
                title: String(book.title ?? ''),
            })) as OutcomeBook[];
    },
};

