import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { ImportStats } from './components/ImportStats';
import { ImportTable } from './components/ImportTable';
import { ImportFormDialog } from './components/ImportFormDialog';
import { ImportViewDialog } from './components/ImportViewDialog';
import { ImportDeleteDialog } from './components/ImportDeleteDialog';
import { mockImports } from '../import/ImportData';
import { ImportService } from '../../services/import.service';

export interface ImportOrder {
    id: number;
    importNumber: string;
    supplier: string;
    date: string;
    time: string;
    totalAmount: number;
    totalItems: number;
    status: 'Hoàn thành' | 'Đang xử lý' | 'Đã hủy';
    createdBy: string;
    note?: string;
    details?: any[];
}

export function ImportPage() {
    const [imports, setImports] = useState<ImportOrder[]>(mockImports);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedImport, setSelectedImport] = useState<ImportOrder | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        importNumber: '',
        supplier: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        totalAmount: 0,
        totalItems: 0,
        status: 'Đang xử lý' as ImportOrder['status'],
        createdBy: 'A Nguyen Van',
        note: '',
        details: [] as any[],
    });

    useEffect(() => {
        loadImports();
    }, []);

    const loadImports = async () => {
        try {
            const data = await ImportService.getAll();
            if (data && data.length > 0) {
                setImports(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredImports = imports.filter(
        (imp) =>
            imp.importNumber
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            imp.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            imp.createdBy?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getStatusColor = (status: ImportOrder['status']) => {
        switch (status) {
            case 'Hoàn thành':
                return 'bg-green-100 text-green-800';
            case 'Đang xử lý':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCreateImport = async () => {
        if (!formData.supplier.trim()) {
            toast.error('Vui lòng chọn nhà cung cấp');
            return;
        }

        if (!formData.details || formData.details.length === 0) {
            toast.error('Vui lòng thêm ít nhất một sách vào phiếu nhập');
            return;
        }

        try {
            setIsLoading(true);
            const payload = {
                ...formData,
                importNumber:
                    formData.importNumber ||
                    `PN${String(imports.length + 1).padStart(3, '0')}`,
            };

            await ImportService.create(payload);

            toast.success('Phiếu nhập đã được tạo thành công!');
            setIsCreateDialogOpen(false);
            resetFormData();
            await loadImports();
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi tạo phiếu nhập');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditImport = async () => {
        if (!selectedImport) return;

        if (!formData.supplier.trim()) {
            toast.error('Vui lòng chọn nhà cung cấp');
            return;
        }

        if (!formData.details || formData.details.length === 0) {
            toast.error('Vui lòng thêm ít nhất một sách vào phiếu nhập');
            return;
        }

        try {
            setIsLoading(true);
            await ImportService.update(selectedImport.id, formData);
            toast.success('Phiếu nhập đã được cập nhật thành công!');
            setIsEditDialogOpen(false);
            await loadImports();
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi cập nhật phiếu nhập');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteImport = async () => {
        if (!selectedImport) return;

        try {
            setIsLoading(true);
            await ImportService.delete(selectedImport.id);
            toast.success('Phiếu nhập đã được xóa thành công!');
            setIsDeleteDialogOpen(false);
            await loadImports();
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi xóa phiếu nhập');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadImport = (importOrder: ImportOrder) => {
        toast.success(`Đang tải phiếu nhập ${importOrder.importNumber}...`);
    };

    const handleViewImport = (importOrder: ImportOrder) => {
        setSelectedImport(importOrder);
        setIsViewDialogOpen(true);
    };

    const handleEditImportOpen = (importOrder: ImportOrder) => {
        setSelectedImport(importOrder);
        setFormData({
            importNumber: importOrder.importNumber,
            supplier: importOrder.supplier,
            date: importOrder.date,
            time: importOrder.time,
            totalAmount: importOrder.totalAmount,
            totalItems: importOrder.totalItems,
            status: importOrder.status,
            createdBy: importOrder.createdBy,
            note: importOrder.note || '',
            details: importOrder.details || [],
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteImportOpen = (importOrder: ImportOrder) => {
        setSelectedImport(importOrder);
        setIsDeleteDialogOpen(true);
    };

    const resetFormData = () => {
        setFormData({
            importNumber: '',
            supplier: '',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            totalAmount: 0,
            totalItems: 0,
            status: 'Đang xử lý',
            createdBy: 'A Nguyen Van',
            note: '',
            details: [],
        });
    };

    const formatDateTime = (date: string, time: string) => {
        if (!date || !time) return '';
        const parts = date.split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}/${month}/${year} ${time}`;
        }
        return `${date} ${time}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý phiếu nhập hàng
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý nhập hàng của Beta Book
                    </p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                        resetFormData();
                        setIsCreateDialogOpen(true);
                    }}
                    disabled={isLoading}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo phiếu nhập
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo số phiếu nhập, nhà cung cấp hoặc người tạo..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <ImportStats
                totalCount={imports.length}
                totalAmount={imports.reduce(
                    (sum, imp) => sum + (imp.totalAmount || 0),
                    0,
                )}
                completedCount={
                    imports.filter((i) => i.status === 'Hoàn thành').length
                }
                processingCount={
                    imports.filter((i) => i.status === 'Đang xử lý').length
                }
            />

            <ImportTable
                imports={filteredImports}
                onView={handleViewImport}
                onEdit={handleEditImportOpen}
                onDelete={handleDeleteImportOpen}
                onDownload={handleDownloadImport}
                getStatusColor={getStatusColor}
                formatDateTime={formatDateTime}
            />

            <ImportFormDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                title="Tạo phiếu nhập mới"
                description="Nhập thông tin phiếu nhập hàng mới"
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateImport}
                submitLabel={isLoading ? 'Đang xử lý...' : 'Tạo phiếu nhập'}
            />

            <ImportFormDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                title="Chỉnh sửa phiếu nhập"
                description="Cập nhật thông tin phiếu nhập"
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleEditImport}
                submitLabel={isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                isEdit={true}
            />

            <ImportViewDialog
                isOpen={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                selectedImport={selectedImport}
                formatDateTime={formatDateTime}
            />

            <ImportDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteImport}
                importNumber={selectedImport?.importNumber}
            />
        </div>
    );
}
