// src/components/ProtectedRoute.tsx
import { Navigate, useNavigate } from 'react-router-dom';
import { LocalStorageService } from '../services/local-store.service';
import type { Role } from '../bases/constants/app.constants';
import { useEffect } from 'react';
import { AuthService } from '../services/auth.service';

interface Props {
    children: React.ReactNode;
    neededRoles?: Role[];
}

export const ProtectedRoute = ({ children, neededRoles }: Props) => {
    const navigate = useNavigate();
    useEffect(() => {
        const result = AuthService.checkLogin();
        if (!result) navigate('/');
    }, []);

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
