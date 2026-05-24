import axios from 'axios';
import { CookiesService } from '../services/cookies.service';
import { TokenType } from '../bases/enums/jwt.enum';
import {toast} from 'sonner'
// import { LocalStorageService } from '../services/local-store.service';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const publicApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

const privateApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

publicApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        const message = data?.message || data?.error || 'Có lỗi xảy ra trong quá trình xử lý';

        toast.error(message);

        if (status === 401) {
            console.log('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại');
        }

        return Promise.reject({
            message,
            status,
        });
    },
);
privateApi.interceptors.request.use(
    (config) => {
        const token = CookiesService.getToken(TokenType.ACCESS_TOKEN);

        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);
privateApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        const message =
            data?.message ||
            data?.error ||
            'Có lỗi xảy ra trong quá trình xử lý';
        toast.error(message);

        if (status === 401) {
            CookiesService.removeCookie('ACCESS_TOKEN');
            CookiesService.removeCookie('REFRESH_TOKEN');

            localStorage.removeItem('me');

            window.location.href = '/';
        }

        return Promise.reject({
            message,
            status,
        });
    },
);

export { publicApi, privateApi };
