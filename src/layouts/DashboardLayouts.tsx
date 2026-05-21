import { ReactNode, useState } from 'react';
import { Sidebar } from '../pages/dashboard/Sidebar';
import { Header } from '../pages/dashboard/Header';
import { AuthService } from '../services/auth.service';
import { CookiesService } from '../services/cookies.service';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
interface Props {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: Props) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const navigate = useNavigate();
    const { user, roles, logout } = useAuth();
    const [headerUser, setHeaderUser] = useState({
        name: 'Nguyen Kha An',
        email: 'nguyenkhaan2006@gmail.com',
    });

    const handleLogout = async () => {
        try {
            const logoutResult = await AuthService.logout();
            if (logoutResult) {
                CookiesService.removeCookie('ACCESS_TOKEN');
                CookiesService.removeCookie('REFRESH_TOKEN');
                logout();
                navigate('/');
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setHeaderUser({
            name: typeof user?.name === 'string' ? user.name : '',
            email: typeof user?.email === 'string' ? user.email : '',
        });
    }, [user]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                userRoles={roles}
            />
            <div
                className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}
            >
                <Header onLogout={handleLogout} user={headerUser} />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};
