import { privateApi, publicApi } from '../api/api';
import { TokenType } from '../bases/enums/jwt.enum';
import { CookiesService } from './cookies.service';
import { LocalStorageService } from './local-store.service';
export class AuthService {
    static async login(email: string, password: string) {
        const responseData = await publicApi.post(
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
    static async me() {
        const responseData = await privateApi.get('auth/me');
        return responseData.data;
    }
    static checkLogin() {
        if (
            CookiesService.getToken(TokenType.ACCESS_TOKEN) &&
            CookiesService.getToken(TokenType.REFRESH_TOKEN) &&
            LocalStorageService.getValue('me')
        )
            return true;
        return false;
    }
    static async getMyProfile() {
        const response = await privateApi.get('/auth/profile');
        return response.data;
    }
    static async logout() {
        const responseData = await privateApi.get('auth/logout');
        return responseData.data;
    }
}
