import { privateApi } from '../api/api';

export interface Rule {
    id: number;
    title: string;
    content: string;
    shortDescription: string;
    appliedAt: string;
    status: string;
    type: string;
    creatorId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRuleDto {
    title: string;
    content: string;
    shortDescription: string;
    appliedAt: string;
    status: string;
    type: string;
}

export interface UpdateRuleDto extends Partial<CreateRuleDto> {}

export const RegulationService = {
    getAll: async (): Promise<Rule[]> => {
        const response = await privateApi.get('/rule');
        return response.data;
    },

    create: async (dto: CreateRuleDto): Promise<Rule> => {
        const response = await privateApi.post('/rule', dto);
        return response.data;
    },

    update: async (id: number, dto: UpdateRuleDto): Promise<Rule> => {
        const response = await privateApi.put(`/rule/${id}`, dto);
        return response.data;
    },

    delete: async (id: number): Promise<Rule> => {
        const response = await privateApi.delete(`/rule/${id}`);
        return response.data;
    },
};
