import { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { toast } from 'sonner';

interface Customer {
  id: number;
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  level: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim cương';
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    customerCode: 'KH001',
    name: 'Nguyễn Văn A',
    email: 'nguyen.vana@email.com',
    phone: '0901234567',
    totalOrders: 12,
    totalSpent: 2500000,
    joinDate: '2025-01-15',
    level: 'Vàng',
  },
  {
    id: 2,
    customerCode: 'KH002',
    name: 'Trần Thị B',
    email: 'tran.thib@email.com',
    phone: '0912345678',
    totalOrders: 8,
    totalSpent: 1800000,
    joinDate: '2025-01-20',
    level: 'Bạc',
  },
  {
    id: 3,
    customerCode: 'KH003',
    name: 'Lê Văn C',
    email: 'le.vanc@email.com',
    phone: '0923456789',
    totalOrders: 25,
    totalSpent: 5200000,
    joinDate: '2024-12-05',
    level: 'Kim cương',
  },
  {
    id: 4,
    customerCode: 'KH004',
    name: 'Phạm Thị D',
    email: 'pham.thid@email.com',
    phone: '0934567890',
    totalOrders: 15,
    totalSpent: 3100000,
    joinDate: '2025-01-10',
    level: 'Vàng',
  },
  {
    id: 5,
    customerCode: 'KH005',
    name: 'Hoàng Văn E',
    email: 'hoang.vane@email.com',
    phone: '0945678901',
    totalOrders: 5,
    totalSpent: 950000,
    joinDate: '2025-02-01',
    level: 'Đồng',
  },
];

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    customerCode: '',
    name: '',
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    totalOrders: 0,
    totalSpent: 0,
    level: 'Đồng' as Customer['level'],
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  // Function to calculate level based on total spent
  const calculateLevel = (totalSpent: number): Customer['level'] => {
    if (totalSpent >= 5000000) return 'Kim cương';
    if (totalSpent >= 2500000) return 'Vàng';
    if (totalSpent >= 1000000) return 'Bạc';
    return 'Đồng';
  };

  // Function to check if customer is new (within 30 days)
  const isNewCustomer = (joinDate: string): boolean => {
    const join = new Date(joinDate);
    const today = new Date('2026-03-11'); // Current date from system
    const diffTime = Math.abs(today.getTime() - join.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const getLevelColor = (level: Customer['level']) => {
    switch (level) {
      case 'Đồng':
        return 'bg-gray-100 text-gray-800';
      case 'Bạc':
        return 'bg-gray-100 text-gray-800';
      case 'Vàng':
        return 'bg-yellow-100 text-yellow-800';
      case 'Kim cương':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleCreateCustomer = () => {
    const newCustomer: Customer = {
      id: customers.length + 1,
      customerCode: `KH${String(customers.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      totalOrders: formData.totalOrders,
      totalSpent: formData.totalSpent,
      joinDate: formData.joinDate,
      level: formData.level,
    };
    setCustomers([...customers, newCustomer]);
    setIsCreateDialogOpen(false);
    toast.success('Khách hàng đã được thêm thành công!');
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      const updatedCustomer: Customer = {
        ...selectedCustomer,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        totalOrders: formData.totalOrders,
        totalSpent: formData.totalSpent,
        joinDate: formData.joinDate,
        level: formData.level,
      };
      setCustomers(
        customers.map((customer) => (customer.id === selectedCustomer.id ? updatedCustomer : customer))
      );
      setIsEditDialogOpen(false);
      toast.success('Khách hàng đã được cập nhật thành công!');
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers(customers.filter((customer) => customer.id !== selectedCustomer.id));
      setIsDeleteDialogOpen(false);
      toast.success('Khách hàng đã được xóa thành công!');
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleEditCustomerOpen = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      customerCode: customer.customerCode,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      joinDate: customer.joinDate,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
      level: customer.level,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCustomerOpen = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin khách hàng của Beta Book</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Thêm khách hàng
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
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
              <p className="text-gray-600 text-sm">Tổng khách hàng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
            </div>
            <Users className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Khách VIP</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {customers.filter((c) => c.level === 'Kim cương').length}
              </p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <Users className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Khách hàng mới</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {customers.filter((c) => isNewCustomer(c.joinDate)).length}
              </p>
            </div>
            <Users className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã KH
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tham gia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số đơn hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng chi tiêu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-orange-600">{customer.customerCode}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {customer.joinDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.totalOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.totalSpent.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                      customer.level
                    )}`}
                  >
                    {customer.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button variant="ghost" size="sm" onClick={() => handleViewCustomer(customer)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCustomerOpen(customer)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCustomerOpen(customer)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Customer Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm khách hàng mới</DialogTitle>
            <DialogDescription>Nhập thông tin khách hàng mới. Hạng sẽ được tự động tính dựa trên tổng chi tiêu.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Mã khách hàng */}
            <div className="space-y-2">
              <Label htmlFor="customerCode" className="text-sm font-medium">Mã khách hàng</Label>
              <Input
                id="customerCode"
                value={formData.customerCode || `KH${String(customers.length + 1).padStart(3, '0')}`}
                onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                className="bg-gray-50"
                placeholder="Tự động tạo"
                readOnly
              />
            </div>

            {/* Thông tin cơ bản */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin cơ bản</h4>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Tên khách hàng</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên khách hàng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0901234567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate" className="text-sm font-medium">Ngày tham gia</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                />
              </div>
            </div>

            {/* Thông tin giao dịch */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin giao dịch</h4>
              
              <div className="space-y-2">
                <Label htmlFor="totalOrders" className="text-sm font-medium">Số đơn hàng</Label>
                <Input
                  id="totalOrders"
                  type="number"
                  value={formData.totalOrders}
                  onChange={(e) => setFormData({ ...formData, totalOrders: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSpent" className="text-sm font-medium">Tổng chi tiêu (VNĐ)</Label>
                <Input
                  id="totalSpent"
                  type="number"
                  value={formData.totalSpent}
                  onChange={(e) => {
                    const spent = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, totalSpent: spent, level: calculateLevel(spent) });
                  }}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">Hạng thành viên</Label>
                <Input
                  id="level"
                  value={formData.level}
                  readOnly
                  className="bg-gradient-to-r from-gray-50 to-orange-50 border-orange-200 font-semibold text-orange-700"
                />
              </div>
            </div>

            {/* Quy định hạng */}
            <div className="text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded"></span>
                Quy định hạng thành viên
              </p>
              <div className="space-y-1.5 ml-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span><strong>Đồng:</strong> Dưới 1.000.000đ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  <span><strong>Bạc:</strong> Từ 1.000.000đ - dưới 2.500.000đ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span><strong>Vàng:</strong> Từ 2.500.000đ - dưới 5.000.000đ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span><strong>Kim cương:</strong> Từ 5.000.000đ trở lên</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleCreateCustomer} className="bg-orange-500 hover:bg-orange-600">
              Thêm khách hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật khách hàng</DialogTitle>
            <DialogDescription>Nhập thông tin khách hàng mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Tên khách hàng</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate">Ngày tham gia</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalOrders">Số đơn hàng</Label>
              <Input
                id="totalOrders"
                type="number"
                value={formData.totalOrders}
                onChange={(e) => setFormData({ ...formData, totalOrders: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalSpent">Tổng chi tiêu</Label>
              <Input
                id="totalSpent"
                type="number"
                value={formData.totalSpent}
                onChange={(e) => setFormData({ ...formData, totalSpent: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level">Hạng</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value as Customer['level'] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn hạng">{formData.level}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đồng">Đồng</SelectItem>
                  <SelectItem value="Bạc">Bạc</SelectItem>
                  <SelectItem value="Vàng">Vàng</SelectItem>
                  <SelectItem value="Kim cương">Kim cương</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleEditCustomer}>
              Cập nhật khách hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông tin khách hàng</DialogTitle>
            <DialogDescription>Thông tin chi tiết về khách hàng</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Tên khách hàng</Label>
              <Input
                id="name"
                value={selectedCustomer?.name || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={selectedCustomer?.email || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={selectedCustomer?.phone || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate">Ngày tham gia</Label>
              <Input
                id="joinDate"
                type="date"
                value={selectedCustomer?.joinDate || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalOrders">Số đơn hàng</Label>
              <Input
                id="totalOrders"
                type="number"
                value={selectedCustomer?.totalOrders || 0}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalSpent">Tổng chi tiêu</Label>
              <Input
                id="totalSpent"
                type="number"
                value={selectedCustomer?.totalSpent || 0}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level">Hạng</Label>
              <Select
                value={selectedCustomer?.level || 'Đồng'}
                onValueChange={(value) => setFormData({ ...formData, level: value as Customer['level'] })}
                disabled
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn hạng">{selectedCustomer?.level || 'Đồng'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đồng">Đồng</SelectItem>
                  <SelectItem value="Bạc">Bạc</SelectItem>
                  <SelectItem value="Vàng">Vàng</SelectItem>
                  <SelectItem value="Kim cương">Kim cương</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa khách hàng</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa khách hàng này?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Tên khách hàng</Label>
              <Input
                id="name"
                value={selectedCustomer?.name || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={selectedCustomer?.email || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={selectedCustomer?.phone || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate">Ngày tham gia</Label>
              <Input
                id="joinDate"
                type="date"
                value={selectedCustomer?.joinDate || ''}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalOrders">Số đơn hàng</Label>
              <Input
                id="totalOrders"
                type="number"
                value={selectedCustomer?.totalOrders || 0}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalSpent">Tổng chi tiêu</Label>
              <Input
                id="totalSpent"
                type="number"
                value={selectedCustomer?.totalSpent || 0}
                readOnly
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level">Hạng</Label>
              <Select
                value={selectedCustomer?.level || 'Đồng'}
                onValueChange={(value) => setFormData({ ...formData, level: value as Customer['level'] })}
                disabled
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn hạng">{selectedCustomer?.level || 'Đồng'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đồng">Đồng</SelectItem>
                  <SelectItem value="Bạc">Bạc</SelectItem>
                  <SelectItem value="Vàng">Vàng</SelectItem>
                  <SelectItem value="Kim cương">Kim cương</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleDeleteCustomer}>
              Xóa khách hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}