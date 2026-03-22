import { useState } from 'react';
import { Ticket, Plus, Search, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

interface Promotion {
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
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
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
      promo.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      setPromotions(promotions.map((promo) => (promo.id === selectedPromotion.id ? updatedPromotion : promo)));
      setIsEditDialogOpen(false);
      toast.success('Khuyến mãi đã được cập nhật thành công!');
    }
  };

  const handleDeletePromotion = () => {
    if (selectedPromotion) {
      setPromotions(promotions.filter((promo) => promo.id !== selectedPromotion.id));
      setIsDeleteDialogOpen(false);
      toast.success('Khuyến mãi đã được xóa thành công!');
    }
  };

  const handleDownloadPromotion = (promotion: Promotion) => {
    toast.success(`Đang tải khuyến mãi ${promotion.code}...`);
    // Logic để tải khuyến mãi
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
          <p className="text-gray-600 mt-1">Quản lý các chương trình khuyến mãi của Beta Book</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Tạo khuyến mãi
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên khuyến mãi..."
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
              <p className="text-gray-600 text-sm">Tổng chương trình</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{promotions.length}</p>
            </div>
            <Ticket className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đang áp dụng</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {promotions.filter((p) => p.status === 'Đang áp dụng').length}
              </p>
            </div>
            <Ticket className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sắp diễn ra</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {promotions.filter((p) => p.status === 'Sắp diễn ra').length}
              </p>
            </div>
            <Ticket className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng lượt dùng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {promotions.reduce((sum, p) => sum + p.usedCount, 0)}
              </p>
            </div>
            <Ticket className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã KM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên chương trình
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đã dùng / Tối đa
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
            {filteredPromotions.map((promo) => (
              <tr key={promo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                  {promo.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {promo.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {promo.type === 'Phần trăm'
                    ? `${promo.discount}%`
                    : `${promo.discount.toLocaleString('vi-VN')}đ`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span>{formatDate(promo.startDate)}</span>
                    <span className="text-xs text-gray-500">đến {formatDate(promo.endDate)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {promo.usedCount} / {promo.maxUses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      promo.status
                    )}`}
                  >
                    {promo.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewPromotion(promo)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditPromotionOpen(promo)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeletePromotionOpen(promo)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadPromotion(promo)}>
                      <Download className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Promotion Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo khuyến mãi mới</DialogTitle>
            <DialogDescription>Nhập thông tin chương trình khuyến mãi mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin cơ bản</h4>
              
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">Mã khuyến mãi</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: BOOK2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Tên chương trình</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên chương trình"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Mô tả</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chương trình (tùy chọn)"
                />
              </div>
            </div>

            {/* Thông tin giảm giá */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin giảm giá</h4>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Loại giảm giá</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Promotion['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại giảm giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phần trăm">Phần trăm (%)</SelectItem>
                    <SelectItem value="Số tiền">Số tiền (VNĐ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount" className="text-sm font-medium">
                  Giá trị giảm {formData.type === 'Phần trăm' ? '(%)' : '(VNĐ)'}
                </Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Thông tin thời gian và sử dụng */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thời gian và giới hạn</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxUses" className="text-sm font-medium">Số lượt tối đa</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usedCount" className="text-sm font-medium">Đã sử dụng</Label>
                  <Input
                    id="usedCount"
                    type="number"
                    value={formData.usedCount}
                    onChange={(e) => setFormData({ ...formData, usedCount: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Promotion['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang áp dụng">Đang áp dụng</SelectItem>
                    <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                    <SelectItem value="Đã kết thúc">Đã kết thúc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetFormData(); }}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleCreatePromotion} className="bg-orange-500 hover:bg-orange-600">
              Tạo khuyến mãi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khuyến mãi</DialogTitle>
            <DialogDescription>Cập nhật thông tin chương trình khuyến mãi</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin cơ bản</h4>
              
              <div className="space-y-2">
                <Label htmlFor="editCode" className="text-sm font-medium">Mã khuyến mãi</Label>
                <Input
                  id="editCode"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: BOOK2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editName" className="text-sm font-medium">Tên chương trình</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên chương trình"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editDescription" className="text-sm font-medium">Mô tả</Label>
                <Input
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chương trình (tùy chọn)"
                />
              </div>
            </div>

            {/* Thông tin giảm giá */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin giảm giá</h4>
              
              <div className="space-y-2">
                <Label htmlFor="editType" className="text-sm font-medium">Loại giảm giá</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as Promotion['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại giảm giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phần trăm">Phần trăm (%)</SelectItem>
                    <SelectItem value="Số tiền">Số tiền (VNĐ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editDiscount" className="text-sm font-medium">
                  Giá trị giảm {formData.type === 'Phần trăm' ? '(%)' : '(VNĐ)'}
                </Label>
                <Input
                  id="editDiscount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Thông tin thời gian và sử dụng */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thời gian và giới hạn</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStartDate" className="text-sm font-medium">Ngày bắt đầu</Label>
                  <Input
                    id="editStartDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEndDate" className="text-sm font-medium">Ngày kết thúc</Label>
                  <Input
                    id="editEndDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editMaxUses" className="text-sm font-medium">Số lượt tối đa</Label>
                  <Input
                    id="editMaxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editUsedCount" className="text-sm font-medium">Đã sử dụng</Label>
                  <Input
                    id="editUsedCount"
                    type="number"
                    value={formData.usedCount}
                    onChange={(e) => setFormData({ ...formData, usedCount: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus" className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Promotion['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang áp dụng">Đang áp dụng</SelectItem>
                    <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                    <SelectItem value="Đã kết thúc">Đã kết thúc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleEditPromotion} className="bg-orange-500 hover:bg-orange-600">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Promotion Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết khuyến mãi</DialogTitle>
            <DialogDescription>Thông tin chi tiết về chương trình khuyến mãi</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Mã khuyến mãi</Label>
              <div className="text-lg font-semibold text-orange-600">{selectedPromotion?.code}</div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tên chương trình:</span>
                <span className="text-sm font-medium">{selectedPromotion?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Giảm giá:</span>
                <span className="text-sm font-semibold text-orange-600">
                  {selectedPromotion?.type === 'Phần trăm'
                    ? `${selectedPromotion?.discount}%`
                    : `${selectedPromotion?.discount.toLocaleString('vi-VN')}đ`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Thời gian:</span>
                <span className="text-sm font-medium">
                  {selectedPromotion && formatDate(selectedPromotion.startDate)} - {selectedPromotion && formatDate(selectedPromotion.endDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Đã dùng / Tối đa:</span>
                <span className="text-sm font-medium">
                  {selectedPromotion?.usedCount} / {selectedPromotion?.maxUses}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Trạng thái:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedPromotion && getStatusColor(selectedPromotion.status)}`}>
                  {selectedPromotion?.status}
                </span>
              </div>
              {selectedPromotion?.description && (
                <div className="flex flex-col gap-1 pt-2 border-t">
                  <span className="text-sm text-gray-500">Mô tả:</span>
                  <span className="text-sm">{selectedPromotion.description}</span>
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
              onClick={() => selectedPromotion && handleDownloadPromotion(selectedPromotion)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải khuyến mãi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Promotion Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa khuyến mãi</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa khuyến mãi này không?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mã khuyến mãi:</span>
                <span className="text-sm font-semibold text-red-600">{selectedPromotion?.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tên chương trình:</span>
                <span className="text-sm font-medium">{selectedPromotion?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Đã sử dụng:</span>
                <span className="text-sm font-semibold">{selectedPromotion?.usedCount} / {selectedPromotion?.maxUses}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleDeletePromotion} className="bg-red-500 hover:bg-red-600">
              Xóa khuyến mãi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}