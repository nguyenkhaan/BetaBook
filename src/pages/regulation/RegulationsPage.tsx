import { useState } from 'react';
import { Sidebar, SidebarProvider } from '../../components/ui/sidebar';
import { RegulationCard } from '../regulation/RegulationCard';
import {
    EditRegulationDialog,
    RegulationData,
} from '../regulation/components/RegulationCardEdit';
import { Search, Plus, Settings, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

// Định nghĩa Interface chuẩn cho toàn bộ trang
export interface Regulation {
    id: number;
    title: string;
    description: string;
    status: 'active' | 'draft' | 'inactive';
    category:
        | 'nhan-su'
        | 'ban-hang'
        | 'kho-van'
        | 'dich-vu-khach-hang'
        | 'tai-chinh'
        | 'an-toan';
    effectiveDate: string;
    updatedDate: string;
    author: string;
    data: RegulationData;
}

export function RegulationsPage() {
    const [regulations, setRegulations] = useState<Regulation[]>([
        {
            id: 1,
            title: 'QĐ1 - Quy định bán hàng',
            description:
                'Chỉ bán cho khách hàng không nợ quá 1.000.000đ. Số lượng nhập tối thiểu và lượng tồn tối thiểu trước khi nhập.',
            status: 'active',
            category: 'ban-hang',
            effectiveDate: '01/01/2026',
            updatedDate: '15/01/2026',
            author: 'A Nguyen Van',
            data: {
                id: 1,
                maxDebt: 1000000,
                minImportQuantity: 150,
                minStockBeforeImport: 50,
                enabled: true,
            },
        },
        {
            id: 2,
            title: 'QĐ2 - Quy định nợ và tồn kho',
            description:
                'Quy định về tiền nợ tối đa của khách hàng và lượng tồn tối thiểu sau khi bán.',
            status: 'active',
            category: 'kho-van',
            effectiveDate: '01/02/2026',
            updatedDate: '20/02/2026',
            author: 'A Nguyen Van',
            data: {
                id: 2,
                maxDebt: 2000000,
                minStockAfterSale: 20,
                enabled: true,
            },
        },
        {
            id: 3,
            title: 'QĐ3 - Quy định nhập hàng',
            description:
                'Chỉ nhập các đầu sách có số lượng tồn ít hơn 300. Số lượng nhập ít nhất là 200. Lượng tồn tối đa sau khi nhập là 500.',
            status: 'active',
            category: 'kho-van',
            effectiveDate: '01/03/2026',
            updatedDate: '25/03/2026',
            author: 'A Nguyen Van',
            data: {
                id: 3,
                maxStockForImport: 300,
                minImportQuantity: 200,
                maxStockAfterImport: 500,
                enabled: true,
            },
        },
        {
            id: 4,
            title: 'QĐ4 - Chính sách giảm giá sách cũ',
            description:
                'Áp dụng giảm giá 10-30% cho các đầu sách đã phát hành quá 12 tháng và tồn kho trên 100 cuốn.',
            status: 'active',
            category: 'ban-hang',
            effectiveDate: '15/02/2026',
            updatedDate: '28/02/2026',
            author: 'B Tran Thi',
            data: { id: 4, enabled: true },
        },
        {
            id: 5,
            title: 'QĐ5 - Quy định hoa hồng nhân viên bán hàng',
            description:
                'Nhân viên bán hàng được hưởng 2% hoa hồng trên doanh thu bán hàng hàng tháng.',
            status: 'active',
            category: 'nhan-su',
            effectiveDate: '01/01/2026',
            updatedDate: '10/03/2026',
            author: 'C Le Van',
            data: { id: 5, enabled: true },
        },
        {
            id: 6,
            title: 'QĐ6 - Quy định giờ làm việc và nghỉ phép',
            description:
                'Giờ làm việc: 8h-17h từ thứ 2 đến thứ 6. Nhân viên được hưởng 12 ngày phép năm.',
            status: 'draft',
            category: 'nhan-su',
            effectiveDate: '01/04/2026',
            updatedDate: '20/03/2026',
            author: 'C Le Van',
            data: { id: 6, enabled: false },
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('tat-ca');
    const [editingRegulation, setEditingRegulation] =
        useState<RegulationData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const filterOptions = [
        { id: 'tat-ca', label: 'Tất cả' },
        { id: 'nhan-su', label: 'Nhân sự' },
        { id: 'ban-hang', label: 'Bán hàng' },
        { id: 'kho-van', label: 'Kho vận' },
        { id: 'dich-vu-khach-hang', label: 'Dịch vụ khách hàng' },
        { id: 'tai-chinh', label: 'Tài chính' },
        { id: 'an-toan', label: 'An toàn' },
    ];

    const stats = [
        {
            label: 'Tổng quy định',
            value: regulations.length,
            color: 'text-[#f97316]',
            icon: Settings,
        },
        {
            label: 'Đang áp dụng',
            value: regulations.filter((r) => r.status === 'active').length,
            color: 'text-green-600',
            icon: Settings,
        },
        {
            label: 'Sắp có hiệu lực',
            value: regulations.filter((r) => r.status === 'draft').length,
            color: 'text-blue-600',
            icon: Settings,
        },
        {
            label: 'Đã hết hiệu lực',
            value: regulations.filter((r) => r.status === 'inactive').length,
            color: 'text-gray-600',
            icon: Settings,
        },
    ];

    const handleEdit = (id: number) => {
        const regulation = regulations.find((r) => r.id === id);
        if (regulation) {
            setEditingRegulation(regulation.data);
            setDialogOpen(true);
        }
    };

    const handleSave = (data: RegulationData) => {
        setRegulations((prev) =>
            prev.map((reg) =>
                reg.id === data.id
                    ? {
                          ...reg,
                          data,
                          updatedDate: new Date().toLocaleDateString('vi-VN'),
                      }
                    : reg,
            ),
        );
        toast.success('Cập nhật quy định thành công!');
    };

    const handleDelete = (id: number) => {
        setRegulations((prev) => prev.filter((r) => r.id !== id));
        toast.info(`Đã xóa quy định thành công`);
    };

    const handleView = (id: number) => {
        const regulation = regulations.find((r) => r.id === id);
        if (regulation) {
            toast.info(`Xem chi tiết: ${regulation.title}`);
        }
    };

    const filteredRegulations = regulations
        .filter(
            (reg) =>
                reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reg.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        )
        .filter(
            (reg) => activeFilter === 'tat-ca' || reg.category === activeFilter,
        );

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-gray-50 w-full">
                <Sidebar activeItem="quy-dinh" />

                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Trang chủ</span>
                                <span>›</span>
                                <span className="font-medium text-gray-900">
                                    Quy định
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-right">
                                    <div className="text-sm font-semibold text-gray-900">
                                        A Nguyen Van
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono">
                                        23520660@gm.uit.edu.vn
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                                    A
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                        Quản lý quy định
                                    </h1>
                                    <p className="text-gray-500 mt-1">
                                        Thiết lập các chính sách vận hành của hệ
                                        thống Beta Book
                                    </p>
                                </div>
                                <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white shadow-md transition-all active:scale-95">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm quy định
                                </Button>
                            </div>

                            {/* Search & Filters */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Tìm kiếm nhanh tiêu đề hoặc mô tả quy định..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-12 py-7 text-lg border-gray-200 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() =>
                                                setActiveFilter(option.id)
                                            }
                                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                                activeFilter === option.id
                                                    ? 'bg-[#f97316] text-white shadow-lg shadow-orange-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                                    {stat.label}
                                                </p>
                                                <p
                                                    className={`text-3xl font-bold mt-1 ${stat.color}`}
                                                >
                                                    {stat.value}
                                                </p>
                                            </div>
                                            <stat.icon
                                                className={`w-10 h-10 ${stat.color} opacity-20`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cards List */}
                            <div className="grid grid-cols-1 gap-4">
                                {filteredRegulations.map((regulation) => (
                                    <RegulationCard
                                        key={regulation.id}
                                        title={regulation.title}
                                        description={regulation.description}
                                        status={regulation.status}
                                        effectiveDate={regulation.effectiveDate}
                                        updatedDate={regulation.updatedDate}
                                        author={regulation.author}
                                        enabled={regulation.data?.enabled}
                                        onEdit={() => handleEdit(regulation.id)}
                                        onDelete={() =>
                                            handleDelete(regulation.id)
                                        }
                                        onView={() => handleView(regulation.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </main>
                </div>

                <EditRegulationDialog
                    key={editingRegulation?.id || 'new'}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    regulation={editingRegulation}
                    onSave={handleSave}
                />
                <Toaster position="top-right" />
            </div>
        </SidebarProvider>
    );
}
