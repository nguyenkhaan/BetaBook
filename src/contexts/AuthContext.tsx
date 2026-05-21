import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import type { Role } from '../bases/constants/app.constants';
import {
    AUTH_STORAGE_EVENT,
    LocalStorageService,
} from '../services/local-store.service';

interface AuthUser {
    roles?: Role[];
    name?: string;
    email?: string;
    [key: string]: unknown;
}

interface AuthContextType {
    isAdmin: boolean;
    isEmployee: boolean;
    user: AuthUser | null;
    roles: Role[];
    logout: () => void;
    refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAuthStateFromStorage = () => {
    const me = LocalStorageService.getValue('me') as AuthUser | undefined;
    const roles = Array.isArray(me?.roles) ? me.roles : [];

    return {
        user: me ?? null,
        roles,
        isAdmin: roles.includes('ADMIN'),
        isEmployee: roles.includes('EMPLOYEE'),
    };
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState(getAuthStateFromStorage);

    const refreshAuth = () => {
        setAuthState(getAuthStateFromStorage());
    };

    useEffect(() => {
        refreshAuth();

        window.addEventListener(AUTH_STORAGE_EVENT, refreshAuth);
        window.addEventListener('storage', refreshAuth);

        return () => {
            window.removeEventListener(AUTH_STORAGE_EVENT, refreshAuth);
            window.removeEventListener('storage', refreshAuth);
        };
    }, []);

    const logout = () => {
        LocalStorageService.removeValue('me');
        setAuthState({
            user: null,
            roles: [],
            isAdmin: false,
            isEmployee: false,
        });
    };

    const value = useMemo(
        () => ({
            ...authState,
            logout,
            refreshAuth,
        }),
        [authState],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
