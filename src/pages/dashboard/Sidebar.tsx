import { Link, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { routePermission } from '../../routes/route.permission';
import { Role } from '../../bases/constants/app.constants';
import { LocalStorageService } from '../../services/local-store.service';
interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    userRoles: Role[]; //role hien tai cua user +))
}

interface MenuItem {
    icon: any;
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
    {
        icon: UserCircle,
        label: 'Hồ sơ cá nhân',
        path: '/employee-profile',
        roles: routePermission.profile,
    },
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
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-700">
                <UserCircle size={42} className="text-orange-500" />
                {!isCollapsed && (
                    <div className="text-orange-500 font-bold text-xl">
                        Beta Book
                    </div>
                )}
            </div>

            {/* Menu */}
            <nav className="mt-4 px-3 overflow-y-auto max-h-[calc(100vh-140px)]">
                {filteredMenu.map((item, index) => {
                    const isActive = location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className={`flex items-center mb-1 transition-all duration-300 rounded-lg py-3 ${
                                isCollapsed
                                    ? 'justify-center px-0'
                                    : 'justify-start px-4 gap-3'
                            } ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
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
