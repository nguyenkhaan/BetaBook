import { useState } from 'react';
import { FileText, Plus, Search, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

interface Receipt {
  id: number;
  receiptNumber: string;
  customerName: string;
  date: string;
  time: string;
  amount: number;
  paymentMethod: 'Tiền mặt' | 'Chuyển khoản' | 'Thẻ';
  collector: string;
  status: 'Hoàn thành' | 'Chờ xác nhận' | 'Đã hủy';
  note?: string;
}

const mockReceipts: Receipt[] = [
  {
    id: 1,
    receiptNumber: 'PT001',
    customerName: 'Nguyễn Văn A',
    date: '2026-03-01',
    time: '09:30',
    amount: 350000,
    paymentMethod: 'Tiền mặt',
    collector: 'A Nguyen Van',
    status: 'Hoàn thành',
    note: 'Thanh toán hóa đơn HĐ001',
  },
  {
    id: 2,
    receiptNumber: 'PT002',
    customerName: 'Trần Thị B',
    date: '2026-03-02',
    time: '10:15',
    amount: 520000,
    paymentMethod: 'Chuyển khoản',
    collector: 'A Nguyen Van',
    status: 'Hoàn thành',
    note: 'Thanh toán hóa đơn HĐ002',
  },
  {
    id: 3,
    receiptNumber: 'PT003',
    customerName: 'Lê Văn C',
    date: '2026-03-03',
    time: '14:20',
    amount: 1200000,
    paymentMethod: 'Chuyển khoản',
    collector: 'A Nguyen Van',
    status: 'Hoàn thành',
    note: 'Thanh toán hóa đơn HĐ003',
  },
  {
    id: 4,
    receiptNumber: 'PT004',
    customerName: 'Phạm Thị D',
    date: '2026-03-04',
    time: '11:00',
    amount: 680000,
    paymentMethod: 'Tiền mặt',
    collector: 'A Nguyen Van',
    status: 'Chờ xác nhận',
    note: 'Thanh toán hóa đơn HĐ004',
  },
  {
    id: 5,
    receiptNumber: 'PT005',
    customerName: 'Hoàng Văn E',
    date: '2026-03-05',
    time: '16:45',
    amount: 950000,
    paymentMethod: 'Thẻ',
    collector: 'A Nguyen Van',
    status: 'Hoàn thành',
    note: 'Thanh toán hóa đơn HĐ005',
  },
];

export function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [formData, setFormData] = useState({
    receiptNumber: '',
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    amount: 0,
    paymentMethod: 'Tiền mặt' as Receipt['paymentMethod'],
    collector: 'A Nguyen Van',
    status: 'Hoàn thành' as Receipt['status'],
    note: '',
  });

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.collector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentMethodColor = (method: Receipt['paymentMethod']) => {
    switch (method) {
      case 'Tiền mặt':
        return 'bg-green-100 text-green-800';
      case 'Chuyển khoản':
        return 'bg-blue-100 text-blue-800';
      case 'Thẻ':
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getStatusColor = (status: Receipt['status']) => {
    switch (status) {
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleCreateReceipt = () => {
    const newReceipt: Receipt = {
      id: receipts.length + 1,
      receiptNumber: formData.receiptNumber || `PT${String(receipts.length + 1).padStart(3, '0')}`,
      customerName: formData.customerName,
      date: formData.date,
      time: formData.time,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      collector: formData.collector,
      status: formData.status,
      note: formData.note,
    };
    setReceipts([...receipts, newReceipt]);
    setIsCreateDialogOpen(false);
    resetFormData();
    toast.success('Phiếu thu đã được tạo thành công!');
  };

  const handleEditReceipt = () => {
    if (selectedReceipt) {
      const updatedReceipt: Receipt = {
        ...selectedReceipt,
        customerName: formData.customerName,
        date: formData.date,
        time: formData.time,
        amount: formData.amount,
        paymentMethod: formData.paymentMethod,
        collector: formData.collector,
        status: formData.status,
        note: formData.note,
      };
      setReceipts(receipts.map((receipt) => (receipt.id === selectedReceipt.id ? updatedReceipt : receipt)));
      setIsEditDialogOpen(false);
      toast.success('Phiếu thu đã được cập nhật thành công!');
    }
  };

  const handleDeleteReceipt = () => {
    if (selectedReceipt) {
      setReceipts(receipts.filter((receipt) => receipt.id !== selectedReceipt.id));
      setIsDeleteDialogOpen(false);
      toast.success('Phiếu thu đã được xóa thành công!');
    }
  };

  const handleDownloadReceipt = (receipt: Receipt) => {
    toast.success(`Đang tải phiếu thu ${receipt.receiptNumber}...`);
    // Logic để tải phiếu thu
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsViewDialogOpen(true);
  };

  const handleEditReceiptOpen = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setFormData({
      receiptNumber: receipt.receiptNumber,
      customerName: receipt.customerName,
      date: receipt.date,
      time: receipt.time,
      amount: receipt.amount,
      paymentMethod: receipt.paymentMethod,
      collector: receipt.collector,
      status: receipt.status,
      note: receipt.note || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteReceiptOpen = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDeleteDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      receiptNumber: '',
      customerName: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      amount: 0,
      paymentMethod: 'Tiền mặt',
      collector: 'A Nguyen Van',
      status: 'Hoàn thành',
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phiếu thu</h1>
          <p className="text-gray-600 mt-1">Quản lý các phiếu thu của Beta Book</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Tạo phiếu thu
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo số phiếu, khách hàng hoặc người thu..."
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
              <p className="text-gray-600 text-sm">Tổng phiếu thu</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{receipts.length}</p>
            </div>
            <FileText className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {receipts.filter((r) => r.status === 'Hoàn thành').length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {receipts.filter((r) => r.status === 'Chờ xác nhận').length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng thu</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(receipts.filter((r) => r.status === 'Hoàn thành').reduce((sum, r) => sum + r.amount, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <FileText className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số phiếu thu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày thu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình thức
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người thu
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
            {filteredReceipts.map((receipt) => (
              <tr key={receipt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-orange-600">{receipt.receiptNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{receipt.customerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateTime(receipt.date, receipt.time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {receipt.amount.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(receipt.paymentMethod)}`}>
                    {receipt.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {receipt.collector}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                    {receipt.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewReceipt(receipt)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditReceiptOpen(receipt)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteReceiptOpen(receipt)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(receipt)}>
                      <Download className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Receipt Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo phiếu thu mới</DialogTitle>
            <DialogDescription>Nhập thông tin phiếu thu mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Số phiếu thu */}
            <div className="space-y-2">
              <Label htmlFor="receiptNumber" className="text-sm font-medium">Số phiếu thu</Label>
              <Input
                id="receiptNumber"
                value={formData.receiptNumber || `PT${String(receipts.length + 1).padStart(3, '0')}`}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                className="bg-gray-50"
                placeholder="Tự động tạo"
                readOnly
              />
            </div>

            {/* Thông tin khách hàng */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin khách hàng</h4>
              
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-sm font-medium">Tên khách hàng</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Nhập tên khách hàng"
                />
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin thanh toán</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">Ngày thu</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">Giờ thu</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">Số tiền (VNĐ)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-sm font-medium">Hình thức thanh toán</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as Receipt['paymentMethod'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                    <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                    <SelectItem value="Thẻ">Thẻ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collector" className="text-sm font-medium">Người thu</Label>
                <Input
                  id="collector"
                  value={formData.collector}
                  onChange={(e) => setFormData({ ...formData, collector: e.target.value })}
                  placeholder="Nhập tên người thu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Receipt['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
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
            <Button type="button" onClick={handleCreateReceipt} className="bg-orange-500 hover:bg-orange-600">
              Tạo phiếu thu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Receipt Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phiếu thu</DialogTitle>
            <DialogDescription>Cập nhật thông tin phiếu thu</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Số phiếu thu */}
            <div className="space-y-2">
              <Label htmlFor="editReceiptNumber" className="text-sm font-medium">Số phiếu thu</Label>
              <Input
                id="editReceiptNumber"
                value={formData.receiptNumber}
                className="bg-gray-50"
                readOnly
              />
            </div>

            {/* Thông tin khách hàng */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin khách hàng</h4>
              
              <div className="space-y-2">
                <Label htmlFor="editCustomerName" className="text-sm font-medium">Tên khách hàng</Label>
                <Input
                  id="editCustomerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Nhập tên khách hàng"
                />
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin thanh toán</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDate" className="text-sm font-medium">Ngày thu</Label>
                  <Input
                    id="editDate"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTime" className="text-sm font-medium">Giờ thu</Label>
                  <Input
                    id="editTime"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editAmount" className="text-sm font-medium">Số tiền (VNĐ)</Label>
                <Input
                  id="editAmount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPaymentMethod" className="text-sm font-medium">Hình thức thanh toán</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as Receipt['paymentMethod'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                    <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                    <SelectItem value="Thẻ">Thẻ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editCollector" className="text-sm font-medium">Người thu</Label>
                <Input
                  id="editCollector"
                  value={formData.collector}
                  onChange={(e) => setFormData({ ...formData, collector: e.target.value })}
                  placeholder="Nhập tên người thu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus" className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Receipt['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
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
            <Button type="button" onClick={handleEditReceipt} className="bg-orange-500 hover:bg-orange-600">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Receipt Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết phiếu thu</DialogTitle>
            <DialogDescription>Thông tin chi tiết về phiếu thu</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Số phiếu thu</Label>
              <div className="text-lg font-semibold text-orange-600">{selectedReceipt?.receiptNumber}</div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Khách hàng:</span>
                <span className="text-sm font-medium">{selectedReceipt?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ngày thu:</span>
                <span className="text-sm font-medium">
                  {selectedReceipt && formatDateTime(selectedReceipt.date, selectedReceipt.time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Số tiền:</span>
                <span className="text-sm font-semibold text-orange-600">
                  {selectedReceipt?.amount.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Hình thức:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedReceipt && getPaymentMethodColor(selectedReceipt.paymentMethod)}`}>
                  {selectedReceipt?.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Người thu:</span>
                <span className="text-sm font-medium">{selectedReceipt?.collector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Trạng thái:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedReceipt && getStatusColor(selectedReceipt.status)}`}>
                  {selectedReceipt?.status}
                </span>
              </div>
              {selectedReceipt?.note && (
                <div className="flex flex-col gap-1 pt-2 border-t">
                  <span className="text-sm text-gray-500">Ghi chú:</span>
                  <span className="text-sm">{selectedReceipt.note}</span>
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
              onClick={() => selectedReceipt && handleDownloadReceipt(selectedReceipt)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải phiếu thu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Receipt Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa phiếu thu</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa phiếu thu này không?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Số phiếu:</span>
                <span className="text-sm font-semibold text-red-600">{selectedReceipt?.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Khách hàng:</span>
                <span className="text-sm font-medium">{selectedReceipt?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Số tiền:</span>
                <span className="text-sm font-semibold">{selectedReceipt?.amount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleDeleteReceipt} className="bg-red-500 hover:bg-red-600">
              Xóa phiếu thu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
