import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { ImportStats } from './components/ImportStats';
import { ImportTable } from './components/ImportTable';
import { ImportFormDialog } from './components/ImportFormDialog';
import { ImportViewDialog } from './components/ImportViewDialog';
import { ImportDeleteDialog } from './components/ImportDeleteDialog';
import {
    CreateOutcomePayload,
    ImportService,
} from '../../services/import.service';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '../../components/ui/select';
import { ImportStatusLabel } from '../../utilis/label_mapper';

export interface ImportBookItem {
    type: 'existing' | 'new';
    bookId?: number;
    bookCode?: string;
    newBookCode?: string;
    bookName?: string;
    importPrice: number;
    quantity: number;
    lineTotal?: number;
    year?: number;
    category?: string;
    bookCost?: number;
}

export interface ImportOrder {
    id: number;
    importNumber: string;
    supplier: string;
    supplierId?: number;
    date: string;
    time: string;
    totalAmount: number;
    totalItems: number;
    status: 'COMPLETE' | 'PENDING' | 'CANCEL';
    createdBy: string;
    note?: string;
    details?: ImportBookItem[];
}

export function ImportPage() {
    const [imports, setImports] = useState<ImportOrder[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedImport, setSelectedImport] = useState<ImportOrder | null>(
        null,
    );
    const [filterStatus, setFilterStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        importNumber: '',
        supplier: '',
        supplierId: undefined as number | undefined,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        totalAmount: 0,
        totalItems: 0,
        createdBy: '',
        status: 'PENDING' as ImportOrder['status'],
        note: '',
        details: [] as any[],
    });

    useEffect(() => {
        loadImports();
    }, []);

    const loadImports = async () => {
        try {
            const data = await ImportService.getAll();
            setImports(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredImports = imports.filter(
        (imp) =>
            imp.status.includes(filterStatus) &&
            (imp.importNumber
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                imp.supplier
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                imp.createdBy
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())),
    );

    const getStatusColor = (status: ImportOrder['status']) => {
        switch (status) {
            case 'COMPLETE':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCEL':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    console.log(imports);

    const handleCreateImport = async () => {
        if (!formData.supplierId) {
            toast.error('Vui lòng chọn nhà cung cấp');
            return;
        }

        if (!formData.details || formData.details.length === 0) {
            toast.error('Vui lòng thêm ít nhất một sách vào phiếu nhập');
            return;
        }
        if (isNaN(Number(formData.totalAmount))) {
            toast.error('Vui lòng nhập số tiền hợp lệ');
            return;
        }
        if (isNaN(Number(formData.totalItems))) {
            toast.error('Vui lòng nhập số lượng hợp lệ');
            return;
        }

        try {
            setIsLoading(true);
            const payload = buildBackendPayload();

            await ImportService.create(payload);

            toast.success('Phiếu nhập đã được tạo thành công!');
            setIsCreateDialogOpen(false);
            resetFormData();
            await loadImports();
        } catch (error) {
            console.error(error);
            // toast.error('Có lỗi xảy ra khi tạo phiếu nhập');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditImport = async () => {
        if (!selectedImport) return;

        if (!formData.supplierId) {
            toast.error('Vui lòng chọn nhà cung cấp');
            return;
        }

        if (!formData.details || formData.details.length === 0) {
            toast.error('Vui lòng thêm ít nhất một sách vào phiếu nhập');
            return;
        }

        try {
            setIsLoading(true);
            const firstDetail = formData.details?.[0];
            const bookCode =
                firstDetail?.type === 'existing'
                    ? firstDetail.bookCode
                    : firstDetail?.newBookCode;

            if (!bookCode || !firstDetail?.quantity) {
                toast.error(
                    'Backend hiện tại chỉ hỗ trợ chỉnh sửa theo từng dòng phiếu nhập',
                );
                return;
            }

            await ImportService.update(selectedImport.id, {
                code: bookCode,
                baseCost: Number(firstDetail.importPrice || 0),
                quantity: Number(firstDetail.quantity || 0),
                publisherId: formData.supplierId,
                status: mapStatusToBackend(formData.status),
            });
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

    const handleViewImport = async (importOrder: ImportOrder) => {
        try {
            setIsLoading(true);
            const detailImport = await ImportService.getById(importOrder.id);
            setSelectedImport(detailImport);
        } catch (error) {
            console.error(error);
            setSelectedImport(importOrder);
            toast.error('Không tải được chi tiết phiếu nhập');
        } finally {
            setIsLoading(false);
        }
        setIsViewDialogOpen(true);
    };

    const handleEditImportOpen = async (importOrder: ImportOrder) => {
        let importData = importOrder;
        try {
            setIsLoading(true);
            importData = await ImportService.getById(importOrder.id);
            setSelectedImport(importData);
        } catch (error) {
            console.error(error);
            setSelectedImport(importOrder);
            toast.error('Không tải được chi tiết phiếu nhập');
        } finally {
            setIsLoading(false);
        }

        setFormData({
            importNumber: importData.importNumber,
            supplier: importData.supplier,
            supplierId: importData.supplierId,
            date: importData.date,
            time: importData.time,
            totalAmount: importData.totalAmount,
            totalItems: importData.totalItems,
            status: importData.status,
            createdBy: importData.createdBy,
            note: importData.note || '',
            details: importData.details || [],
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
            supplierId: undefined,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            totalAmount: 0,
            totalItems: 0,
            createdBy: '',
            status: 'PENDING',
            note: '',
            details: [],
        });
    };

    const mapStatusToBackend = (
        status: ImportOrder['status'],
    ): 'COMPLETE' | 'PENDING' | 'CANCEL' => {
        switch (status) {
            case 'COMPLETE':
                return 'COMPLETE';
            case 'CANCEL':
                return 'CANCEL';
            case 'PENDING':
            default:
                return 'PENDING';
        }
    };

    const buildBackendPayload = (): CreateOutcomePayload => {
        return {
            publisherId: Number(formData.supplierId),
            status: mapStatusToBackend(formData.status),
            items: (formData.details || []).map((item: any) => ({
                code:
                    item.type === 'existing'
                        ? item.bookCode?.trim()
                        : item.newBookCode?.trim(),
                baseCost: Number(item.importPrice || 0),
                quantity: Number(item.quantity || 0),
                ...(item.type === 'new' && item.bookName?.trim()
                    ? { bookTitle: item.bookName.trim() }
                    : {}),
                ...(item.type === 'new' && item.year
                    ? { year: Number(item.year) }
                    : {}),
                ...(item.authorIds && item.type === 'new'
                    ? {
                          authorIds: item.authorIds,
                      }
                    : {}),
                ...(item.publisherIds && item.type === 'new'
                    ? {
                          publisherIds: item.publisherIds,
                      }
                    : {}),
            })),
        };
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

            <div className="bg-white w-full flex items-center gap-4 p-4 rounded-lg shadow-sm">
                {/* Ô Input: Chỉ để flex-[10] (hoặc flex-[20]), XÓA w-full ở đây */}
                <div className="relative w-full flex-[10]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo số phiếu nhập, nhà cung cấp hoặc người tạo..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-400 flex-shrink-0">
                    <Select
                        value={filterStatus} 
                        onValueChange={(e : any) => {
                            setFilterStatus(e) 
                        }}
                    
                    >
                        <SelectTrigger className="w-full">
                            {ImportStatusLabel[filterStatus] || 'Tất cả'}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Tất cả</SelectItem>
                            <SelectItem value="COMPLETE">Hoàn thành</SelectItem>
                            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                            <SelectItem value="CANCEL">Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <ImportStats
                totalCount={imports.length}
                totalAmount={imports.reduce(
                    (sum, imp) => sum + (imp.totalAmount || 0),
                    0,
                )}
                completedCount={
                    imports.filter((i) => i.status === 'COMPLETE').length
                }
                processingCount={
                    imports.filter((i) => i.status === 'PENDING').length
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
