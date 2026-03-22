import { useState } from 'react';
import { FileDown, Plus, Search, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

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
  const [selectedImport, setSelectedImport] = useState<ImportOrder | null>(null);
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
      imp.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
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
      importNumber: formData.importNumber || `PN${String(imports.length + 1).padStart(3, '0')}`,
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
      setImports(imports.map((imp) => (imp.id === selectedImport.id ? updatedImport : imp)));
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
    // Logic để tải phiếu nhập
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phiếu nhập</h1>
          <p className="text-gray-600 mt-1">Quản lý nhập hàng của Beta Book</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsCreateDialogOpen(true)}>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng phiếu nhập</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{imports.length}</p>
            </div>
            <FileDown className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng giá trị</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(imports.reduce((sum, imp) => sum + imp.totalAmount, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <FileDown className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {imports.filter((i) => i.status === 'Hoàn thành').length}
              </p>
            </div>
            <FileDown className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đang xử lý</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {imports.filter((i) => i.status === 'Đang xử lý').length}
              </p>
            </div>
            <FileDown className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Imports Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số phiếu nhập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhà cung cấp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày nhập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredImports.map((imp) => (
              <tr key={imp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-orange-600">{imp.importNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{imp.supplier}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateTime(imp.date, imp.time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {imp.totalItems}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {imp.totalAmount.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {imp.createdBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(imp.status)}`}>
                    {imp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewImport(imp)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditImportOpen(imp)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteImportOpen(imp)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadImport(imp)}>
                      <Download className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Import Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo phiếu nhập mới</DialogTitle>
            <DialogDescription>Nhập thông tin phiếu nhập hàng mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Số phiếu nhập */}
            <div className="space-y-2">
              <Label htmlFor="importNumber" className="text-sm font-medium">Số phiếu nhập</Label>
              <Input
                id="importNumber"
                value={formData.importNumber || `PN${String(imports.length + 1).padStart(3, '0')}`}
                onChange={(e) => setFormData({ ...formData, importNumber: e.target.value })}
                className="bg-gray-50"
                placeholder="Tự động tạo"
                readOnly
              />
            </div>

            {/* Thông tin nhà cung cấp */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin nhà cung cấp</h4>
              
              <div className="space-y-2">
                <Label htmlFor="supplier" className="text-sm font-medium">Nhà cung cấp</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Nhập tên nhà cung cấp"
                />
              </div>
            </div>

            {/* Thông tin nhập hàng */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin nhập hàng</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">Ngày nhập</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">Giờ nhập</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalItems" className="text-sm font-medium">Số lượng</Label>
                <Input
                  id="totalItems"
                  type="number"
                  value={formData.totalItems}
                  onChange={(e) => setFormData({ ...formData, totalItems: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAmount" className="text-sm font-medium">Tổng tiền (VNĐ)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdBy" className="text-sm font-medium">Người tạo</Label>
                <Input
                  id="createdBy"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  placeholder="Nhập tên người tạo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ImportOrder['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium">Ghi chú</Label>
                <Input
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Ghi chú (tùy chọn)"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetFormData(); }}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleCreateImport} className="bg-orange-500 hover:bg-orange-600">
              Tạo phiếu nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Import Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phiếu nhập</DialogTitle>
            <DialogDescription>Cập nhật thông tin phiếu nhập</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Số phiếu nhập */}
            <div className="space-y-2">
              <Label htmlFor="editImportNumber" className="text-sm font-medium">Số phiếu nhập</Label>
              <Input
                id="editImportNumber"
                value={formData.importNumber}
                className="bg-gray-50"
                readOnly
              />
            </div>

            {/* Thông tin nhà cung cấp */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin nhà cung cấp</h4>
              
              <div className="space-y-2">
                <Label htmlFor="editSupplier" className="text-sm font-medium">Nhà cung cấp</Label>
                <Input
                  id="editSupplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Nhập tên nhà cung cấp"
                />
              </div>
            </div>

            {/* Thông tin nhập hàng */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin nhập hàng</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDate" className="text-sm font-medium">Ngày nhập</Label>
                  <Input
                    id="editDate"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTime" className="text-sm font-medium">Giờ nhập</Label>
                  <Input
                    id="editTime"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editTotalItems" className="text-sm font-medium">Số lượng</Label>
                <Input
                  id="editTotalItems"
                  type="number"
                  value={formData.totalItems}
                  onChange={(e) => setFormData({ ...formData, totalItems: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editTotalAmount" className="text-sm font-medium">Tổng tiền (VNĐ)</Label>
                <Input
                  id="editTotalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editCreatedBy" className="text-sm font-medium">Người tạo</Label>
                <Input
                  id="editCreatedBy"
                  value={formData.createdBy}
                  onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  placeholder="Nhập tên người tạo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus" className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as ImportOrder['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editNote" className="text-sm font-medium">Ghi chú</Label>
                <Input
                  id="editNote"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Ghi chú (tùy chọn)"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleEditImport} className="bg-orange-500 hover:bg-orange-600">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Import Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu nhập</DialogTitle>
            <DialogDescription>Thông tin chi tiết về phiếu nhập</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Số phiếu nhập</Label>
              <div className="text-lg font-semibold text-orange-600">{selectedImport?.importNumber}</div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nhà cung cấp:</span>
                <span className="text-sm font-medium">{selectedImport?.supplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ngày nhập:</span>
                <span className="text-sm font-medium">
                  {selectedImport && formatDateTime(selectedImport.date, selectedImport.time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Số lượng:</span>
                <span className="text-sm font-semibold text-orange-600">
                  {selectedImport?.totalItems}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tổng tiền:</span>
                <span className="text-sm font-semibold text-orange-600">
                  {selectedImport?.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Người tạo:</span>
                <span className="text-sm font-medium">{selectedImport?.createdBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Trạng thái:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedImport && getStatusColor(selectedImport.status)}`}>
                  {selectedImport?.status}
                </span>
              </div>
              {selectedImport?.note && (
                <div className="flex flex-col gap-1 pt-2 border-t">
                  <span className="text-sm text-gray-500">Ghi chú:</span>
                  <span className="text-sm">{selectedImport.note}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
            <Button
              type="button"
              onClick={() => selectedImport && handleDownloadImport(selectedImport)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải phiếu nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Import Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa phiếu nhập</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa phiếu nhập này không?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Số phiếu:</span>
                <span className="text-sm font-semibold text-red-600">{selectedImport?.importNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nhà cung cấp:</span>
                <span className="text-sm font-medium">{selectedImport?.supplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tổng tiền:</span>
                <span className="text-sm font-semibold">{selectedImport?.totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleDeleteImport} className="bg-red-500 hover:bg-red-600">
              Xóa phiếu nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}