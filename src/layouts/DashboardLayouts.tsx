import { ReactNode, useState } from 'react';
import { Sidebar } from '../pages/dashboard/Sidebar';
import { Header } from '../pages/dashboard/Header';
import { LocalStorageService } from '../services/local-store.service';
import { Role } from '../bases/constants/app.constants';
import { AuthService } from '../services/auth.service';
import { CookiesService } from '../services/cookies.service';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
interface Props {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: Props) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    // const [loading , setLoading] = useState(false) 
    const [user , setUser] = useState({
        name: 'Nguyen Kha An', 
        email: 'nguyenkhaan2006@gmail.com' 
    })
    const navigate = useNavigate() 

    const handleLogout = async () => {
        try 
        {
            const logout_result = await AuthService.logout() 
            if (logout_result) 
            {
                CookiesService.removeCookie('ACCESS_TOKEN') 
                CookiesService.removeCookie('REFRESH_TOKEN') 
                localStorage.removeItem('me') 
                navigate('/') 
            }
        } 
        catch (err) 
        {
            console.log(err) 
        }
    }
    
    const userRoles = LocalStorageService.getValue('me').roles as Role[];
    useEffect(() => {
        const me = LocalStorageService.getValue('me') 
        setUser({
            name: me.name,
            email: me.email 
        })
    } , [])

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                userRoles={userRoles}
            />
            <div
                className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}
            >
                <Header onLogout={handleLogout} user={user} />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};
