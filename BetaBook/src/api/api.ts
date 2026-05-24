import axios from 'axios';
import { CookiesService } from '../services/cookies.service';
import { TokenType } from '../bases/enums/jwt.enum';
import toast from 'react-hot-toast';
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

        if (status === 401) {
            console.log('Invalid session. Please login again');
        }

        return Promise.reject(error);
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

        if (status === 401) {
            // Xóa token
            CookiesService.removeCookie('ACCESS_TOKEN');
            CookiesService.removeCookie('REFRESH_TOKEN');
            localStorage.removeItem('me') 
            // Thông báo
            toast.error('Phiên đăng nhập đã hết hạn');

            // Redirect login
            window.location.href = '/';
        } else {
            toast.error(data?.message || 'Có lỗi xảy ra');
        }

        return Promise.reject({
            message: data?.message,
            status,
        });
    },
);

export { publicApi, privateApi };