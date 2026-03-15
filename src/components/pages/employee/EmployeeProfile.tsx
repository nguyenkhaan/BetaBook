import { useState } from 'react';
import { User, Mail, Phone, Calendar, DollarSign, Building, Briefcase, Key } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast } from 'sonner';

export function EmployeeProfile() {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Mock employee data - in real app, this would come from context/props
  const employee = {
    id: 1,
    name: 'A Nguyen Van',
    email: 'nguyen.vana@company.com',
    phone: '0901234567',
    position: 'Quản lý cửa hàng',
    department: 'Quản lý',
    joinDate: '01/01/2024',
    status: 'Đang làm việc',
    salary: 15000000,
    avatar: '',
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    // In real app, call API to change password
    toast.success('Đổi mật khẩu thành công!');
    setIsChangePasswordOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trang cá nhân</h1>
          <p className="text-gray-600 mt-1">Xem và quản lý thông tin cá nhân của bạn</p>
        </div>
        <Button 
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsChangePasswordOpen(true)}
        >
          <Key className="w-4 h-4" />
          Đổi mật khẩu
        </Button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        <div className="px-6 pb-6">
          <div className="flex items-center gap-6 -mt-16">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <User className="w-16 h-16 text-orange-500" />
            </div>
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
              <p className="text-gray-600">{employee.position}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {employee.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900 font-medium">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="text-gray-900 font-medium">{employee.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công việc</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Phòng ban</p>
                <p className="text-gray-900 font-medium">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chức vụ</p>
                <p className="text-gray-900 font-medium">{employee.position}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tuyển dụng</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày bắt đầu làm việc</p>
                <p className="text-gray-900 font-medium">{employee.joinDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mức lương</p>
                <p className="text-gray-900 font-medium">{employee.salary.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mã nhân viên</p>
                <p className="text-gray-900 font-medium">NV{employee.id.toString().padStart(4, '0')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chi nhánh</p>
                <p className="text-gray-900 font-medium">Beta Book - Trụ sở chính</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Nhập mật khẩu hiện tại và mật khẩu mới của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" className="bg-orange-500 hover:bg-orange-600" onClick={handleChangePassword}>
              Đổi mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}