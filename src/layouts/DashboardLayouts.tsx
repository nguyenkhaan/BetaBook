import { ReactNode, useState } from 'react';
import { Sidebar } from '../pages/dashboard/Sidebar';
import { Header } from '../pages/dashboard/Header';
import { LocalStorageService } from '../services/local-store.service';
import { Role } from '../bases/constants/app.constants';

interface Props {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: Props) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const userRoles = LocalStorageService.getValue('me').roles as Role[];
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
                <Header onLogout={() => {}} userName="Nguyễn Văn A" />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};
