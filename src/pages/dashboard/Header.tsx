import { Breadcrumb } from './components/Breadcrumb';
import { UserNav } from './components/UserNav';

interface HeaderProps {
    onLogout?: () => void;
    currentPage?: string;
    onNavigate?: (page: string) => void;
    userName: string;
}

const pageLabels: Record<string, string> = {
    dashboard: 'Bảng điều khiển',
    invoice: 'Hóa đơn',
    books: 'Sách',
    customers: 'Khách hàng',
    receipts: 'Phiếu thu',
    import: 'Phiếu nhập',
    promotions: 'Khuyến mãi',
    employees: 'Nhân viên',
    reports: 'Báo cáo',
    regulations: 'Quy định',
    'regulation-detail': 'Chi tiết quy định',
    approval: 'Quản lý phê duyệt',
    mypage: 'Trang của tôi',
    'employee-profile': 'Trang cá nhân',
};

export function Header({
    onLogout,
    currentPage = 'resignation',
    onNavigate,
    userName,
}: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Breadcrumb
                        currentPage={currentPage}
                        pageLabels={pageLabels}
                        onNavigate={onNavigate}
                    />
                </div>

                <UserNav userName={userName} onLogout={onLogout} />
            </div>
        </header>
    );
}
