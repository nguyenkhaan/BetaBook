// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { CookiesService } from '../services/cookies.service';
import { LocalStorageService } from '../services/local-store.service';
import type { Role } from '../bases/constants/app.constants';

interface Props {
    children: React.ReactNode;
    neededRoles?: Role[];
}

export const ProtectedRoute = ({ children, neededRoles }: Props) => {
    const accessToken = CookiesService.getCookie('accessToken');
    const refreshToken = CookiesService.getCookie('refreshToken');


    if (!accessToken || !refreshToken) {
        return <Navigate to="/" replace />;
    }


    const me = LocalStorageService.getValue('me');
    if (!me || !me.roles) {
        return <Navigate to="/" replace />;
    }

    // Kiểm tra quyền
    if (
        neededRoles &&
        !me.roles.some((role: Role) => neededRoles.includes(role)) 
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};