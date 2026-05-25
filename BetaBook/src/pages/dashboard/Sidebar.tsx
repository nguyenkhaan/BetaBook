import { useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    FileText,
    Book,
    Users,
    DollarSign,
    FileDown,
    Ticket,
    User,
    ClipboardList,
    Settings,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    LucideIcon,
} from 'lucide-react';
import { routePermission } from '../../routes/route.permission';
import { Role } from '../../bases/constants/app.constants';
import { SidebarLogo } from './components/SidebarLogo';
import { SidebarItem } from './components/SidebarItem';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    userRoles: Role[]; //role hien tai cua user +))
}

interface MenuItem {
    icon: LucideIcon;
    label: string;
    path: string;
    roles: Role[];
}

// Khởi tạo menu items
const menuItems: MenuItem[] = [
    {
        icon: LayoutGrid,
        label: 'Bảng điều khiển',
        path: '/dashboard',
        roles: routePermission.dashboard,
    },
    {
        icon: FileText,
        label: 'Hóa đơn',
        path: '/invoice',
        roles: routePermission.invoice,
    },
    { icon: Book, label: 'Sách', path: '/books', roles: routePermission.books },
    {
        icon: Users,
        label: 'Khách hàng',
        path: '/customers',
        roles: routePermission.customers,
    },
    {
        icon: DollarSign,
        label: 'Phiếu thu',
        path: '/receipts',
        roles: routePermission.receipts,
    },
    {
        icon: FileDown,
        label: 'Phiếu nhập',
        path: '/import',
        roles: routePermission.importPage,
    },
    {
        icon: Ticket,
        label: 'Khuyến mãi',
        path: '/promotions',
        roles: routePermission.promotions,
    },
    {
        icon: User,
        label: 'Nhân viên',
        path: '/employees',
        roles: routePermission.employees,
    },
    // {
    //     icon: UserCircle,
    //     label: 'Hồ sơ cá nhân',
    //     path: '/eProfile',
    //     roles: routePermission.eProfile,
    // },
    {
        icon: ClipboardList,
        label: 'Báo cáo',
        path: '/reports',
        roles: routePermission.reports,
    },
    {
        icon: Settings,
        label: 'Quy định',
        path: '/regulations',
        roles: routePermission.regulations,
    },
];

export function Sidebar({ isCollapsed, onToggle, userRoles }: SidebarProps) {
    const location = useLocation();
    const filteredMenu = menuItems.filter((item) =>
        userRoles.some((role) => item.roles.includes(role)),
    );

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-[#1a2332] text-white transition-all duration-300 z-40 ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}
        >
            <SidebarLogo isCollapsed={isCollapsed} />

            {/* Menu */}
            <nav className="mt-4 px-3 overflow-y-auto max-h-[calc(100vh-140px)]">
                {filteredMenu.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        isActive={location.pathname.startsWith(item.path)}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </nav>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
            >
                {isCollapsed ? (
                    <ChevronRight size={20} />
                ) : (
                    <ChevronLeft size={20} />
                )}
            </button>
        </div>
    );
}
