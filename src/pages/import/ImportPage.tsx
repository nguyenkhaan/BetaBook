import { useState } from 'react';
import {
    Plus,
    Search,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { ImportStats } from './components/ImportStats';
import { ImportTable } from './components/ImportTable';
import { ImportFormDialog } from './components/ImportFormDialog';
import { ImportViewDialog } from './components/ImportViewDialog';
import { ImportDeleteDialog } from './components/ImportDeleteDialog';

interface ImportOrder {
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
}

const mockImports: ImportOrder[] = [
    {
        id: 1,
        importNumber: 'PN001',
        supplier: 'NXB Tổng Hợp',
        date: '2026-02-25',
        time: '09:00',
        totalAmount: 15000000,
        totalItems: 150,
        status: 'Hoàn thành',
        createdBy: 'A Nguyen Van',
        note: 'Nhập sách văn học',
    },
    {
        id: 2,
        importNumber: 'PN002',
        supplier: 'NXB Văn Học',
        date: '2026-02-28',
        time: '10:30',
        totalAmount: 8500000,
        totalItems: 85,
        status: 'Hoàn thành',
        createdBy: 'A Nguyen Van',
        note: 'Nhập sách thiếu nhi',
    },
    {
        id: 3,
        importNumber: 'PN003',
        supplier: 'NXB Tri Thức',
        date: '2026-03-01',
        time: '14:15',
        totalAmount: 12000000,
        totalItems: 100,
        status: 'Đang xử lý',
        createdBy: 'Nguyễn Vũ Linh',
        note: 'Nhập sách giáo khoa',
    },
    {
        id: 4,
        importNumber: 'PN004',
        supplier: 'NXB Thế Giới',
        date: '2026-03-03',
        time: '11:45',
        totalAmount: 6500000,
        totalItems: 60,
        status: 'Đang xử lý',
        createdBy: 'A Nguyen Van',
        note: 'Nhập sách ngoại ngữ',
    },
    {
        id: 5,
        importNumber: 'PN005',
        supplier: 'NXB Kim Đồng',
        date: '2026-03-05',
        time: '08:30',
        totalAmount: 9200000,
        totalItems: 92,
        status: 'Hoàn thành',
        createdBy: 'A Nguyen Van',
        note: 'Nhập truyện tranh',
    },
];

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
    });

    const filteredImports = imports.filter(
        (imp) =>
            imp.importNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            imp.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            imp.createdBy.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getStatusColor = (status: ImportOrder['status']) => {
        switch (status) {
            case 'Hoàn thành':
                return 'bg-green-100 text-green-800';
            case 'Đang xử lý':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
        }
    };

    const handleCreateImport = () => {
        const newImport: ImportOrder = {
            id: imports.length + 1,
            importNumber:
                formData.importNumber ||
                `PN${String(imports.length + 1).padStart(3, '0')}`,
            supplier: formData.supplier,
            date: formData.date,
            time: formData.time,
            totalAmount: formData.totalAmount,
            totalItems: formData.totalItems,
            status: formData.status,
            createdBy: formData.createdBy,
            note: formData.note,
        };
        setImports([...imports, newImport]);
        setIsCreateDialogOpen(false);
        resetFormData();
        toast.success('Phiếu nhập đã được tạo thành công!');
    };

    const handleEditImport = () => {
        if (selectedImport) {
            const updatedImport: ImportOrder = {
                ...selectedImport,
                supplier: formData.supplier,
                date: formData.date,
                time: formData.time,
                totalAmount: formData.totalAmount,
                totalItems: formData.totalItems,
                status: formData.status,
                createdBy: formData.createdBy,
                note: formData.note,
            };
            setImports(
                imports.map((imp) =>
                    imp.id === selectedImport.id ? updatedImport : imp,
                ),
            );
            setIsEditDialogOpen(false);
            toast.success('Phiếu nhập đã được cập nhật thành công!');
        }
    };

    const handleDeleteImport = () => {
        if (selectedImport) {
            setImports(imports.filter((imp) => imp.id !== selectedImport.id));
            setIsDeleteDialogOpen(false);
            toast.success('Phiếu nhập đã được xóa thành công!');
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
        });
    };

    const formatDateTime = (date: string, time: string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year} ${time}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý phiếu nhập
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý nhập hàng của Beta Book
                    </p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    Tạo phiếu nhập
                </Button>
            </div>

            {/* Search */}
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

            {/* Statistics */}
            <ImportStats
                totalCount={imports.length}
                totalAmount={imports.reduce((sum, imp) => sum + imp.totalAmount, 0)}
                completedCount={imports.filter((i) => i.status === 'Hoàn thành').length}
                processingCount={imports.filter((i) => i.status === 'Đang xử lý').length}
            />

            {/* Imports Table */}
            <ImportTable
                imports={filteredImports}
                onView={handleViewImport}
                onEdit={handleEditImportOpen}
                onDelete={handleDeleteImportOpen}
                onDownload={handleDownloadImport}
                getStatusColor={getStatusColor}
                formatDateTime={formatDateTime}
            />

            {/* Create Import Dialog */}
            <ImportFormDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                title="Tạo phiếu nhập mới"
                description="Nhập thông tin phiếu nhập hàng mới"
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateImport}
                submitLabel="Tạo phiếu nhập"
            />

            {/* Edit Import Dialog */}
            <ImportFormDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                title="Chỉnh sửa phiếu nhập"
                description="Cập nhật thông tin phiếu nhập"
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleEditImport}
                submitLabel="Cập nhật"
                isEdit={true}
            />

            {/* View Import Dialog */}
            <ImportViewDialog
                isOpen={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                selectedImport={selectedImport}
                formatDateTime={formatDateTime}
            />

            {/* Delete Import Dialog */}
            <ImportDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteImport}
                importNumber={selectedImport?.importNumber}
            />
        </div>
    );
}
