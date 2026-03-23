import api from '../api/api';
export class AuthService {
    static async login(email: string, password: string) {
        const responseData = await api.post(
            'auth/login',
            {
                email,
                password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        return responseData.data;
    }
    static async me(token: string) {
        const responseData = await api.get('auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return responseData.data;
    }
}
