import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarProvider } from '../../components/ui/sidebar';
import { RegulationCard } from '../regulation/RegulationCard';
import {
    EditRegulationDialog,
    RegulationFormData,
} from '../regulation/components/RegulationCardEdit';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';
import { RegulationService, Rule, RuleStatistic } from '../../services/regulation.service';

export function RegulationsPage() {
    const navigate = useNavigate();
    const [regulations, setRegulations] = useState<Rule[]>([]);
    const [stats, setStats] = useState<RuleStatistic | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [editingRegulation, setEditingRegulation] =
        useState<RegulationFormData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [ruleTypes, setRuleTypes] = useState<string[]>([]);

    useEffect(() => {
        fetchRegulations();
        fetchOptions();
    }, []);

    const fetchRegulations = async () => {
        setIsLoading(true);
        try {
            const [data, statistics] = await Promise.all([
                RegulationService.getAll(),
                RegulationService.getStatistic(),
            ]);
            setRegulations(data);
            setStats(statistics);
        } catch (error) {
            toast.error('Không thể tải danh sách quy định');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const options = await RegulationService.getOptions();
            setRuleTypes(options.type);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleEdit = (id: number) => {
        const rule = regulations.find((r) => r.id === id);
        if (rule) {
            setEditingRegulation({
                id: rule.id,
                title: rule.title,
                content: rule.content,
                shortDescription: rule.shortDescription,
                appliedAt: rule.appliedAt,
                status: rule.status,
                type: rule.type,
            });
            setDialogOpen(true);
        }
    };

    const handleSave = async (data: RegulationFormData) => {
        try {
            if (data.id) {
                await RegulationService.update(data.id, {
                    title: data.title,
                    content: data.content,
                    shortDescription: data.shortDescription,
                    appliedAt: data.appliedAt,
                    status: data.status,
                    type: data.type,
                });
                toast.success('Cập nhật quy định thành công!');
            } else {
                await RegulationService.create({
                    title: data.title,
                    content: data.content,
                    shortDescription: data.shortDescription,
                    appliedAt: data.appliedAt,
                    status: data.status,
                    type: data.type,
                });
                toast.success('Tạo quy định thành công!');
            }
            fetchRegulations();
            setDialogOpen(false);
            setEditingRegulation(null);
        } catch (error) {
            toast.error('Lỗi khi lưu quy định');
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa quy định này?')) return;
        try {
            await RegulationService.delete(id);
            setRegulations((prev) => prev.filter((r) => r.id !== id));
            toast.success('Đã xóa quy định thành công');
            fetchRegulations();
        } catch (error) {
            toast.error('Lỗi khi xóa quy định');
            console.error(error);
        }
    };

    const handleView = (id: number) => {
        navigate(`/regulation/${id}`);
    };

    const filterOptions = [
        { id: 'all', label: 'Tất cả', type: 'all' },
        ...ruleTypes.map((type) => ({ id: type, label: type, type })),
    ];

    const filteredRegulations = regulations.filter((reg) => {
        const matchesSearch =
            reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.shortDescription
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || reg.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const displayStats = stats || {
        totalRules: regulations.length,
        applying: regulations.filter((r) => r.status === 'APPLYING').length,
        upcoming: regulations.filter((r) => r.status === 'UPCOMING').length,
        reject: regulations.filter((r) => r.status === 'REJECT').length,
    };

    const statsList = [
        {
            label: 'Tổng quy định',
            value: displayStats.totalRules,
            color: 'text-[#f97316]',
        },
        {
            label: 'Đang áp dụng',
            value: displayStats.applying,
            color: 'text-green-600',
        },
        {
            label: 'Sắp có hiệu lực',
            value: displayStats.upcoming,
            color: 'text-blue-600',
        },
        {
            label: 'Đã hết hiệu lực',
            value: displayStats.reject,
            color: 'text-gray-600',
        },
    ];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-gray-50 w-full">
                <Sidebar activeItem="quy-dinh" />
                <div className="flex-1 flex flex-col">
                    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Trang chủ</span> ›{' '}
                            <span className="font-medium text-gray-900">
                                Quy định
                            </span>
                        </div>
                    </header>

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
                                <Button
                                    onClick={() => {
                                        setEditingRegulation(null);
                                        setDialogOpen(true);
                                    }}
                                    className="bg-orange-500 font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Thêm quy
                                    định
                                </Button>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                                <div className="relative mb-6">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-12 py-7 text-lg"
                                    />
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {filterOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() =>
                                                setActiveFilter(opt.id)
                                            }
                                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                                activeFilter === opt.id
                                                    ? 'bg-orange-500 p-2 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                {statsList.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                                    >
                                        <p className="text-sm font-medium text-gray-400 uppercase">
                                            {stat.label}
                                        </p>
                                        <p
                                            className={`text-3xl font-bold mt-1 ${stat.color}`}
                                        >
                                            {stat.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredRegulations.map((reg) => (
                                        <RegulationCard
                                            key={reg.id}
                                            id={reg.id}
                                            title={reg.title}
                                            description={reg.shortDescription}
                                            status={reg.status}
                                            effectiveDate={new Date(
                                                reg.appliedAt,
                                            ).toLocaleDateString('vi-VN')}
                                            updatedDate={new Date(
                                                reg.updatedAt || reg.appliedAt,
                                            ).toLocaleDateString('vi-VN')}
                                            author="Hệ thống"
                                            onEdit={() => handleEdit(reg.id)}
                                            onDelete={() =>
                                                handleDelete(reg.id)
                                            }
                                            onView={() => handleView(reg.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                <EditRegulationDialog
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
