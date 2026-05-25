// src/components/ProtectedRoute.tsx
import { Navigate, useNavigate } from 'react-router-dom';
import type { Role } from '../bases/constants/app.constants';
import { useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    children: React.ReactNode;
    neededRoles?: Role[];
}

export const ProtectedRoute = ({ children, neededRoles }: Props) => {
    const navigate = useNavigate();
    const { user, roles } = useAuth();
    useEffect(() => {
        const result = AuthService.checkLogin();
        if (!result) navigate('/');
    }, []);

    if (!user || roles.length === 0) {
        return <Navigate to="/" replace />;
    }

    // Kiểm tra quyền
    if (
        neededRoles &&
        !roles.some((role: Role) => neededRoles.includes(role))
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
