import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
interface HeaderProps {
    onLogout: () => void;
    user?: {
        name?: string;
        email?: string;
    } | null;
}

export function Header({
    onLogout,
    user,
}: HeaderProps) {
    const handleLogout = async () => {
        onLogout();
    };
    const navigate = useNavigate() 
    // const getPageTitle = (page: string) => {
    //     const titles: Record<string, string> = {
    //         dashboard: 'Trang chủ',
    //         invoice: 'Trang chủ > Hóa đơn',
    //         books: 'Trang chủ > Quản lý sách',
    //         customers: 'Trang chủ > Khách hàng',
    //         receipts: 'Trang chủ > Phiếu thu',
    //         import: 'Trang chủ > Phiếu nhập',
    //         promotions: 'Trang chủ > Khuyến mãi',
    //         employees: 'Trang chủ > Nhân viên',
    //         reports: 'Trang chủ > Báo cáo',
    //         regulations: 'Trang chủ > Quy định',
    //         'regulation-detail': 'Trang chủ > Quy định > Chi tiết',
    //         'employee-profile': 'Trang chủ > Hồ sơ nhân viên',
    //         resignation: 'Trang chủ > Đơn xin nghỉ việc',
    //         approval: 'Trang chủ > Duyệt đơn',
    //         leaveoff: 'Trang chủ > Nghỉ phép',
    //         mypage: 'Trang chủ > Trang cá nhân',
    //     };
    //     return titles[page] || 'Beta Book';
    // };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Breadcrumb */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Utahime Book 
                    </h2>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-4 cursor-pointer">
                    {/* User Info Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name || ''}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.email ||
                                            ''}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 py-4 px-2 gap-6 bg-white">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className='cursor-pointer py-2'
                                onClick={() => navigate('/eProfile')}
                            >
                                <UserIcon className="w-4 h-4 mr-2" />
                                Hồ sơ nhân viên
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-600 mt-2 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
