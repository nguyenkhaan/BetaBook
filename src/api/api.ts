import axios from 'axios';
import { CookiesService } from '../services/cookies.service';
import { TokenType } from '../bases/enums/jwt.enum';
import toast from 'react-hot-toast'
import { LocalStorageService } from '../services/local-store.service';
const BASE_URL = import.meta.env.VITE_BACKEND_URL
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
        const status = error.response.status;
        if (status === 401) {
            console.log('Invalid session. Please login again');
            //Call something to say user they should login again
        }
        return Promise.reject(error);
    },
);
privateApi.interceptors.request.use(
    (config) => {
        const token = CookiesService.getToken(TokenType.ACCESS_TOKEN);
        if (token && config['headers'])
             {
            {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);
privateApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response.status;
        if (status === 401) {
            toast.error("Đã hết phiên đăng nhập. hãy đăng nhập lại") 
            CookiesService.removeCookie('ACCESS_TOKEN') 
            CookiesService.removeCookie('REFRESH_TOKEN') 
            LocalStorageService.removeValue('me') 
            window.location.href = '/'
        }
		const data = error.response?.data;
        console.log("API error" , data) 
        toast.error(JSON.stringify(data.message))
        return Promise.reject({
            message: data.message, 
            status 
        })
    },
);
export { publicApi, privateApi };

