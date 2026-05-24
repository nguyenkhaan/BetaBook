import { privateApi } from '../api/api';

export interface SystemSetting {
    key: string;
    value: string;
    description: string | null;
    updatedAt: string;
}

export interface UpdateSystemSettingDto {
    key: string;
    value: string;
    description: string;
}

export interface UpdateSettingsResponse {
    message: string;
}

const normalizeSetting = (value: unknown): SystemSetting => {
    const setting = (value ?? {}) as Partial<SystemSetting>;

    return {
        key: typeof setting.key === 'string' ? setting.key : '',
        value: typeof setting.value === 'string' ? setting.value : '',
        description:
            typeof setting.description === 'string' ? setting.description : '',
        updatedAt:
            typeof setting.updatedAt === 'string' ? setting.updatedAt : '',
    };
};

export const SettingsService = {
    async getAll(): Promise<SystemSetting[]> {
        const response = await privateApi.get('/settings');

        if (!Array.isArray(response.data)) {
            return [];
        }

        return response.data.map(normalizeSetting);
    },

    async updateAll(
        settings: UpdateSystemSettingDto[],
    ): Promise<UpdateSettingsResponse> {
        const response = await privateApi.patch('/settings', settings);
        return {
            message:
                response.data &&
                typeof response.data === 'object' &&
                'message' in response &&
                typeof response.message === 'string'
                    ? response.message
                    : 'Cập nhật cấu hình hệ thống thành công!',
        };
    },
};
