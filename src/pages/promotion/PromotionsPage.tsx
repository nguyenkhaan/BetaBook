import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { PromotionStats } from './components/PromotionStats';
import { PromotionFilterBar } from './components/PromotionFilterBar';
import { PromotionTable } from './components/PromotionTable';
import { PromotionDialogs } from './components/PromotionDialogs';

export interface Promotion {
    id: number;
    code: string;
    name: string;
    discount: number;
    type: 'Phần trăm' | 'Số tiền';
    startDate: string;
    endDate: string;
    status: 'Đang áp dụng' | 'Sắp diễn ra' | 'Đã kết thúc';
    usedCount: number;
    maxUses: number;
    description?: string;
}

const mockPromotions: Promotion[] = [
    {
        id: 1,
        code: 'BOOK2026',
        name: 'Giảm giá đầu năm',
        discount: 20,
        type: 'Phần trăm',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        status: 'Đang áp dụng',
        usedCount: 45,
        maxUses: 100,
        description: 'Chương trình giảm giá đặc biệt chào mừng năm mới',
    },
    {
        id: 2,
        code: 'NEWCUSTOMER',
        name: 'Khách hàng mới',
        discount: 50000,
        type: 'Số tiền',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        status: 'Đang áp dụng',
        usedCount: 23,
        maxUses: 200,
        description: 'Ưu đãi dành riêng cho khách hàng mới',
    },
    {
        id: 3,
        code: 'BESTSELLER',
        name: 'Sách bán chạy',
        discount: 15,
        type: 'Phần trăm',
        startDate: '2026-03-15',
        endDate: '2026-04-15',
        status: 'Sắp diễn ra',
        usedCount: 0,
        maxUses: 150,
        description: 'Giảm giá các đầu sách bán chạy nhất',
    },
    {
        id: 4,
        code: 'WINTER2025',
        name: 'Khuyến mãi mùa đông',
        discount: 30,
        type: 'Phần trăm',
        startDate: '2025-12-01',
        endDate: '2026-02-28',
        status: 'Đã kết thúc',
        usedCount: 98,
        maxUses: 100,
        description: 'Chương trình khuyến mãi mùa đông',
    },
    {
        id: 5,
        code: 'STUDENT2026',
        name: 'Ưu đãi sinh viên',
        discount: 25,
        type: 'Phần trăm',
        startDate: '2026-03-01',
        endDate: '2026-06-30',
        status: 'Đang áp dụng',
        usedCount: 67,
        maxUses: 300,
        description: 'Giảm giá dành cho sinh viên',
    },
];

export function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPromotion, setSelectedPromotion] =
        useState<Promotion | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        discount: 0,
        type: 'Phần trăm' as Promotion['type'],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        status: 'Đang áp dụng' as Promotion['status'],
        usedCount: 0,
        maxUses: 100,
        description: '',
    });

    const filteredPromotions = promotions.filter(
        (promo) =>
            promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getStatusColor = (status: Promotion['status']) => {
        switch (status) {
            case 'Đang áp dụng':
                return 'bg-green-100 text-green-800';
            case 'Sắp diễn ra':
                return 'bg-blue-100 text-blue-800';
            case 'Đã kết thúc':
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCreatePromotion = () => {
        const newPromotion: Promotion = {
            id: promotions.length + 1,
            code: formData.code,
            name: formData.name,
            discount: formData.discount,
            type: formData.type,
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: formData.status,
            usedCount: formData.usedCount,
            maxUses: formData.maxUses,
            description: formData.description,
        };
        setPromotions([...promotions, newPromotion]);
        setIsCreateDialogOpen(false);
        resetFormData();
        toast.success('Khuyến mãi đã được tạo thành công!');
    };

    const handleEditPromotion = () => {
        if (selectedPromotion) {
            const updatedPromotion: Promotion = {
                ...selectedPromotion,
                code: formData.code,
                name: formData.name,
                discount: formData.discount,
                type: formData.type,
                startDate: formData.startDate,
                endDate: formData.endDate,
                status: formData.status,
                usedCount: formData.usedCount,
                maxUses: formData.maxUses,
                description: formData.description,
            };
            setPromotions(
                promotions.map((promo) =>
                    promo.id === selectedPromotion.id
                        ? updatedPromotion
                        : promo,
                ),
            );
            setIsEditDialogOpen(false);
            toast.success('Khuyến mãi đã được cập nhật thành công!');
        }
    };

    const handleDeletePromotion = () => {
        if (selectedPromotion) {
            setPromotions(
                promotions.filter((promo) => promo.id !== selectedPromotion.id),
            );
            setIsDeleteDialogOpen(false);
            toast.success('Khuyến mãi đã được xóa thành công!');
        }
    };

    const handleDownloadPromotion = (promotion: Promotion) => {
        toast.success(`Đang tải khuyến mãi ${promotion.code}...`);
    };

    const handleViewPromotion = (promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setIsViewDialogOpen(true);
    };

    const handleEditPromotionOpen = (promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setFormData({
            code: promotion.code,
            name: promotion.name,
            discount: promotion.discount,
            type: promotion.type,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
            status: promotion.status,
            usedCount: promotion.usedCount,
            maxUses: promotion.maxUses,
            description: promotion.description || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleDeletePromotionOpen = (promotion: Promotion) => {
        setSelectedPromotion(promotion);
        setIsDeleteDialogOpen(true);
    };

    const resetFormData = () => {
        setFormData({
            code: '',
            name: '',
            discount: 0,
            type: 'Phần trăm',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            status: 'Đang áp dụng',
            usedCount: 0,
            maxUses: 100,
            description: '',
        });
    };

    const formatDate = (date: string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý khuyến mãi
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý các chương trình khuyến mãi của Beta Book
                    </p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                        resetFormData();
                        setIsCreateDialogOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4" />
                    Tạo khuyến mãi
                </Button>
            </div>

            <PromotionFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <PromotionStats promotions={promotions} />

            <PromotionTable
                promotions={filteredPromotions}
                onView={handleViewPromotion}
                onEdit={handleEditPromotionOpen}
                onDelete={handleDeletePromotionOpen}
                onDownload={handleDownloadPromotion}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
            />

            <PromotionDialogs
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                isEditDialogOpen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                isViewDialogOpen={isViewDialogOpen}
                setIsViewDialogOpen={setIsViewDialogOpen}
                isDeleteDialogOpen={isDeleteDialogOpen}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                selectedPromotion={selectedPromotion}
                formData={formData}
                setFormData={setFormData}
                handleCreatePromotion={handleCreatePromotion}
                handleEditPromotion={handleEditPromotion}
                handleDeletePromotion={handleDeletePromotion}
                handleDownloadPromotion={handleDownloadPromotion}
                resetFormData={resetFormData}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
            />
        </div>
    );
}
