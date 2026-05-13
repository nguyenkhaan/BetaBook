import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { ImportStats } from './components/ImportStats';
import { ImportTable } from './components/ImportTable';
import { ImportFormDialog } from './components/ImportFormDialog';
import { ImportViewDialog } from './components/ImportViewDialog';
import { ImportDeleteDialog } from './components/ImportDeleteDialog';
import {
    OutcomeBook,
    OutcomePublisher,
    OutcomeService,
} from '../../services/outcome.service';

export interface ImportOrder {
    id: number;
    importNumber: string;
    supplier: string;
    date: string;
    time: string;
    totalAmount: number;
    totalItems: number;
    status: string;
    createdBy: string;
    note?: string;
}

interface ImportFormData {
    code: string;
    publisherId: number;
    cost: number;
    status: string;
    quantity: number;
    bookCode: string;
}

export function ImportPage() {
    const [imports, setImports] = useState<ImportOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedImport, setSelectedImport] = useState<ImportOrder | null>(null);
    const [statusOptions, setStatusOptions] = useState<string[]>([]);
    const [publishers, setPublishers] = useState<OutcomePublisher[]>([]);
    const [books, setBooks] = useState<OutcomeBook[]>([]);
    const [formData, setFormData] = useState<ImportFormData>({
        code: '',
        publisherId: 0,
        cost: 0,
        status: '',
        quantity: 150,
        bookCode: '',
    });

    const loadInitialData = async () => {
        setIsLoading(true);
        try {
            const [outcomeRows, options, publisherRows, bookRows] = await Promise.all([
                OutcomeService.getAll(),
                OutcomeService.getOptions(),
                OutcomeService.getPublishers(),
                OutcomeService.getBooks(),
            ]);

            const mappedImports: ImportOrder[] = outcomeRows.map((row) => {
                const createdAt = row.createdAt ? new Date(row.createdAt) : new Date();
                const yyyy = createdAt.getFullYear();
                const mm = String(createdAt.getMonth() + 1).padStart(2, '0');
                const dd = String(createdAt.getDate()).padStart(2, '0');
                const hh = String(createdAt.getHours()).padStart(2, '0');
                const min = String(createdAt.getMinutes()).padStart(2, '0');
                return {
                    id: row.id,
                    importNumber: row.code,
                    supplier: row.publisher?.name ?? '',
                    date: `${yyyy}-${mm}-${dd}`,
                    time: `${hh}:${min}`,
                    totalAmount: Number(row.cost ?? 0),
                    totalItems: Number(row.quantity ?? 0),
                    status: String(row.status ?? ''),
                    createdBy: row.creator?.name ?? '',
                };
            });

            setImports(mappedImports);
            setStatusOptions(options?.status ?? []);
            setPublishers(publisherRows ?? []);
            setBooks(bookRows ?? []);
        } catch (error) {
            console.error('Failed to load import page data:', error);
            toast.error('Không thể tải dữ liệu phiếu nhập');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadInitialData();
    }, []);

    const filteredImports = useMemo(
        () =>
            imports.filter(
                (imp) =>
                    imp.importNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    imp.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    imp.createdBy.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        [imports, searchTerm],
    );

    const getStatusColor = (status: string) => {
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

    const validateFormData = () => {
        if (!formData.code.trim()) return 'Code là bắt buộc';
        if (!formData.publisherId) return 'Vui lòng chọn publisher';
        if (!formData.bookCode.trim()) return 'Vui lòng chọn bookCode';
        if (!formData.status.trim()) return 'Vui lòng chọn status';
        if (!Number.isFinite(formData.cost) || formData.cost <= 0) {
            return 'Cost phải lớn hơn 0';
        }
        if (!Number.isInteger(formData.quantity) || formData.quantity < 150) {
            return 'Quantity phải là số nguyên và tối thiểu 150';
        }
        if (!/^BOOK\d{3}$/.test(formData.bookCode)) {
            return 'BookCode không đúng định dạng (BOOK001...)';
        }
        return null;
    };

    const resetFormData = () => {
        setFormData({
            code: '',
            publisherId: 0,
            cost: 0,
            status: statusOptions[0] ?? '',
            quantity: 150,
            bookCode: '',
        });
    };

    const handleCreateImport = async () => {
        const validationError = validateFormData();
        if (validationError) {
            toast.error(validationError);
            return;
        }
        try {
            setIsSubmitting(true);
            await OutcomeService.create({
                code: formData.code.trim(),
                publisherId: formData.publisherId,
                cost: Number(formData.cost),
                status: formData.status,
                quantity: Number(formData.quantity),
                bookCode: formData.bookCode.trim(),
            });
            toast.success('Phiếu nhập đã được tạo thành công');
            setIsCreateDialogOpen(false);
            resetFormData();
            await loadInitialData();
        } catch (error) {
            console.error('Create outcome failed:', error);
            toast.error('Tạo phiếu nhập thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditImport = async () => {
        if (!selectedImport) return;

        const validationError = validateFormData();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            await OutcomeService.update(selectedImport.id, {
                code: formData.code.trim(),
                publisherId: formData.publisherId,
                cost: Number(formData.cost),
                status: formData.status,
                quantity: Number(formData.quantity),
                bookCode: formData.bookCode.trim(),
            });
            setIsEditDialogOpen(false);
            toast.success('Phiếu nhập đã được cập nhật thành công');
            await loadInitialData();
        } catch (error) {
            console.error('Update outcome failed:', error);
            toast.error('Cập nhật phiếu nhập thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteImport = async () => {
        if (!selectedImport) return;
        try {
            setIsSubmitting(true);
            await OutcomeService.delete(selectedImport.id);
            setIsDeleteDialogOpen(false);
            toast.success('Phiếu nhập đã được xóa thành công');
            await loadInitialData();
        } catch (error) {
            console.error('Delete outcome failed:', error);
            toast.error('Xóa phiếu nhập thất bại');
        } finally {
            setIsSubmitting(false);
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
            code: importOrder.importNumber,
            publisherId:
                publishers.find((publisher) => publisher.name === importOrder.supplier)?.id ?? 0,
            cost: importOrder.totalAmount,
            status: importOrder.status,
            quantity: importOrder.totalItems,
            bookCode: '',
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteImportOpen = (importOrder: ImportOrder) => {
        setSelectedImport(importOrder);
        setIsDeleteDialogOpen(true);
    };

    const handleCreateDialogOpen = () => {
        resetFormData();
        setIsCreateDialogOpen(true);
    };

    const formatDateTime = (date: string, time: string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year} ${time}`;
    };
    console.log(imports) 
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý phiếu nhập hàng</h1>
                    <p className="text-gray-600 mt-1">Quản lý nhập hàng của Beta Book</p>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleCreateDialogOpen}>
                    <Plus className="w-4 h-4" />
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
                totalAmount={imports.reduce((sum, imp) => sum + Number(imp.totalAmount), 0)}
                completedCount={imports.filter((i) => i.status === 'COMPLETE').length}
                processingCount={imports.filter((i) => i.status === 'PENDING').length}
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
                publishers={publishers}
                books={books}
                statusOptions={statusOptions}
                onSubmit={handleCreateImport}
                submitLabel={isSubmitting ? 'Đang tạo...' : 'Tạo phiếu nhập'}
            />

            <ImportFormDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                title="Chỉnh sửa phiếu nhập"
                description="Cập nhật thông tin phiếu nhập"
                formData={formData}
                setFormData={setFormData}
                publishers={publishers}
                books={books}
                statusOptions={statusOptions}
                onSubmit={handleEditImport}
                submitLabel={isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
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

            {isLoading && <div className="text-sm text-gray-500">Đang tải dữ liệu phiếu nhập...</div>}
        </div>
    );
}
