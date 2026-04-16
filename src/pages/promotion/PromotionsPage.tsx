import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { PromotionStats } from './components/PromotionStats';
import { PromotionFilterBar } from './components/PromotionFilterBar';
import { PromotionTable } from './components/PromotionTable';
import { PromotionDialogs } from './components/PromotionDialogs';
import {
    PromotionService,
    Voucher,
    VoucherData,
} from '../../services/promotion.service';
export type Promotion =  {
    id : number; 
    code: string; 
    sale: string; 
    quantity: number; 
    status : string; 
    type : string, 
    eventName: string;  
    name: string 
    description: string; 
    startDate: string; 
    expiresAt: string; 
    usedNumber: number 
}
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
        eventName: '',
        sale: 0,
        type: 'PERCENT',
        quantity: 100,
        expiresAt: new Date().toISOString().split('T')[0],
        status: 'APPLYING',
    };

    const [formData, setFormData] = useState<VoucherData>(initialFormData);

    const loadVouchers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await PromotionService.getAllVoucher();
            setVouchers(data);
        } catch (error) {
            toast.error('Không thể tải danh sách khuyến mãi');
            console.error(error);
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
            v.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getStatusColor = (status: any) => {  //Fix 
        switch (status) {
            case 'APPLYING':
                return 'bg-green-100 text-green-800';
            case 'UPCOMING':
                return 'bg-gray-100 text-gray-800';
            case 'ENDED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const handleCreatePromotion = async () => {
        try {
            await PromotionService.createVoucher(formData);
            toast.success('Khuyến mãi đã được tạo thành công!');
            setIsCreateDialogOpen(false);
            loadVouchers();
        } catch (error : any) 
        {
            console.log(error) 
            toast.error('Xảy ra lỗi khi tạo khuyến mãi: ' + error.message);
        }
    };

    const handleEditPromotion = async () => {
        if (selectedVoucher) {
            try {
                await PromotionService.updateVoucher(
                    selectedVoucher.id,
                    formData,
                );
                toast.success('Cập nhật thành công!');
                setIsEditDialogOpen(false);
                loadVouchers();
            } catch (error) {
                toast.error('Lỗi khi cập nhật');
            }
        }
    };

    const handleDeletePromotion = async () => {
        if (selectedVoucher) {
            try {
                await PromotionService.deleteVoucher(selectedVoucher.id);
                toast.success('Đã xóa khuyến mãi');
                setIsDeleteDialogOpen(false);
                loadVouchers();
            } catch (error) {
                toast.error('Lỗi khi xóa');
            }
        }
    };

    const handleDownloadPromotion = (voucher: any) => {
        toast.success(`Đang tải khuyến mãi ${voucher.name}...`);
    };

    const handleViewPromotion = (voucher: any) => {
        setSelectedVoucher(voucher);
        setIsViewDialogOpen(true);
    };

    const handleEditPromotionOpen = (voucher: any) => {
        setSelectedVoucher(voucher);
        setFormData({
            name: voucher.name,
            eventName: voucher.eventName,
            sale: voucher.sale,
            type: voucher.type,
            quantity: voucher.quantity,
            expiresAt: new Date(voucher.expiresAt).toISOString().split('T')[0],
            status: voucher.status,
        });
        setIsEditDialogOpen(true);
    };

    const handleDeletePromotionOpen = (voucher: any) => {
        setSelectedVoucher(voucher);
        setIsDeleteDialogOpen(true);
    };

    const resetFormData = () => setFormData(initialFormData);

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
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
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo khuyến mãi
                </Button>
            </div>

            <PromotionFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <PromotionStats promotions={vouchers as any} />

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
