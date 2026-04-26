import { privateApi } from '../api/api';

export interface Rule {
    id: number;
    title: string;
    content: string;
    shortDescription: string;
    appliedAt: string;
    status: 'APPLYING' | 'UPCOMING' | 'REJECT';
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
    status: 'APPLYING' | 'UPCOMING' | 'REJECT';
    type: string;
}

export interface UpdateRuleDto extends Partial<CreateRuleDto> {}

export interface RuleOptions {
    type: string[];
    status: string[];
}

export interface RuleStatistic {
    totalRules: number;
    applying: number;
    upcoming: number;
    reject: number;
}

export const RegulationService = {
    getAll: async (): Promise<Rule[]> => {
        const response = await privateApi.get('/rule');
        return response.data;
    },

    getOptions: async (): Promise<RuleOptions> => {
        const response = await privateApi.get('/rule/options');
        return response.data;
    },

    getStatistic: async (): Promise<RuleStatistic> => {
        const response = await privateApi.get('/rule/statistic');
        return response.data;
    },

    getById: async (id: number): Promise<Rule> => {
        const response = await privateApi.get(`/rule/${id}`);
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

    delete: async (id: number): Promise<void> => {
        await privateApi.delete(`/rule/${id}`);
    },
};
