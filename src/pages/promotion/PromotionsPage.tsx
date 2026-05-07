import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { PromotionStats } from './components/PromotionStats';
import { PromotionFilterBar } from './components/PromotionFilterBar';
import { PromotionTable } from './components/PromotionTable';
import { PromotionDialogs } from './components/PromotionDialogs';
import {
    VoucherService,
    Voucher,
    VoucherData,
} from '../../services/voucher.service';

export function PromotionsPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(
        null,
    );

    const initialFormData: VoucherData = {
        name: '',
        code: '',
        eventName: '',
        description: '',
        sale: 0,
        type: 'PERCENT',
        quantity: 100,
        usedNumber: 0,
        startDate: new Date().toISOString().split('T')[0],
        expiresAt: new Date().toISOString().split('T')[0],
        status: 'APPLYING',
    };

    const [formData, setFormData] = useState<VoucherData>(initialFormData);

    const loadVouchers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await VoucherService.getAllVoucher();
            setVouchers(data);
        } catch (error) {
            toast.error('Không thể tải danh sách khuyến mãi');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVouchers();
    }, [loadVouchers]);

    const filteredVouchers = vouchers.filter(
        (v) =>
            v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.code.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPLYING':
                return 'bg-green-100 text-green-800';
            case 'UPCOMING':
                return 'bg-blue-100 text-blue-800';
            case 'ENDED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCreatePromotion = async () => {
        try {
            const payload = {
                ...formData,
                sale: Number(formData.sale),
                quantity: Number(formData.quantity),
                usedNumber: Number(formData.usedNumber || 0),
                startDate: new Date(
                    formData.startDate || new Date(),
                ).toISOString(),
                expiresAt: new Date(
                    formData.expiresAt || new Date(),
                ).toISOString(),
            };

            await VoucherService.createVoucher(payload);
            toast.success('Tạo khuyến mãi thành công!');
            setIsCreateDialogOpen(false);
            resetFormData();
            loadVouchers();
        } catch (error: any) {
            const msg = error.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg[0] : msg || 'Lỗi khi tạo');
        }
    };

    const handleEditPromotion = async () => {
        if (!selectedVoucher) return;
        try {
            const payload = {
                ...formData,
                sale: Number(formData.sale),
                quantity: Number(formData.quantity),
                usedNumber: Number(formData.usedNumber || 0),
                startDate: new Date(
                    formData.startDate || new Date(),
                ).toISOString(),
                expiresAt: new Date(
                    formData.expiresAt || new Date(),
                ).toISOString(),
            };

            await VoucherService.updateVoucher(selectedVoucher.id, payload);
            toast.success('Cập nhật thành công!');
            setIsEditDialogOpen(false);
            loadVouchers();
        } catch (error: any) {
            const msg = error.response?.data?.message;
            toast.error(
                Array.isArray(msg) ? msg[0] : msg || 'Lỗi khi cập nhật',
            );
        }
    };

    const handleDeletePromotion = async () => {
        if (!selectedVoucher) return;
        try {
            await VoucherService.deleteVoucher(selectedVoucher.id);
            toast.success('Đã xóa khuyến mãi');
            setIsDeleteDialogOpen(false);
            loadVouchers();
        } catch (error) {
            toast.error('Lỗi khi xóa');
        }
    };

    const handleDownloadPromotion = (promo: any) => {
        toast.info(`Đang xuất dữ liệu ${promo.code}...`);
    };

    const handleViewPromotion = (promo: any) => {
        setSelectedVoucher(promo);
        setIsViewDialogOpen(true);
    };

    const handleEditPromotionOpen = (promo: any) => {
        setSelectedVoucher(promo);
        setFormData({
            name: promo.name || '',
            code: promo.code || '',
            eventName: promo.eventName || '',
            description: promo.description || '',
            sale: promo.sale || 0,
            type: promo.type || 'PERCENT',
            quantity: promo.quantity || 0,
            usedNumber: promo.usedNumber || 0,
            startDate: promo.startDate
                ? new Date(promo.startDate).toISOString().split('T')[0]
                : '',
            expiresAt: promo.expiresAt
                ? new Date(promo.expiresAt).toISOString().split('T')[0]
                : '',
            status: promo.status || 'APPLYING',
        });
        setIsEditDialogOpen(true);
    };

    const handleDeletePromotionOpen = (promo: any) => {
        setSelectedVoucher(promo);
        setIsDeleteDialogOpen(true);
    };

    const resetFormData = () => setFormData(initialFormData);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý khuyến mãi
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Hệ thống quản lý Voucher Beta Book
                    </p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                        resetFormData();
                        setIsCreateDialogOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo khuyến mãi
                </Button>
            </div>

            <PromotionFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            {!loading && <PromotionStats promotions={vouchers as any} />}

            <PromotionTable
                promotions={filteredVouchers as any}
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
                selectedPromotion={selectedVoucher as any}
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
