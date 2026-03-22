import { useState } from 'react';
import { User, Plus, Search, Eye, Edit, Trash2, Download, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';


import { useParams } from "react-router-dom";

export const EmployeeProfile = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Employee Profile</h1>
      <p className="mt-2">Employee ID: {id}</p>
    </div>
  );
};

interface Employee {
  id: number;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'Đang làm việc' | 'Nghỉ phép' | 'Đã nghỉ việc';
  salary: number;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    employeeCode: 'NV001',
    name: 'A Nguyen Van',
    email: 'nguyen.vana@company.com',
    phone: '0901234567',
    position: 'Quản lý cửa hàng',
    department: 'Quản lý',
    joinDate: '2024-01-01',
    status: 'Đang làm việc',
    salary: 15000000,
  },
  {
    id: 2,
    employeeCode: 'NV002',
    name: 'Nguyễn Vũ Linh',
    email: 'nguyen.vulinh@company.com',
    phone: '0912345678',
    position: 'Nhân viên bán hàng',
    department: 'Bán hàng',
    joinDate: '2024-02-15',
    status: 'Đang làm việc',
    salary: 10000000,
  },
  {
    id: 3,
    employeeCode: 'NV003',
    name: 'Trần Thị B',
    email: 'tran.thib@company.com',
    phone: '0923456789',
    position: 'Kế toán',
    department: 'Tài chính',
    joinDate: '2024-03-10',
    status: 'Đang làm việc',
    salary: 12000000,
  },
  {
    id: 4,
    employeeCode: 'NV004',
    name: 'Lê Văn C',
    email: 'le.vanc@company.com',
    phone: '0934567890',
    position: 'Thủ kho',
    department: 'Kho vận',
    joinDate: '2024-04-20',
    status: 'Nghỉ phép',
    salary: 9000000,
  },
  {
    id: 5,
    employeeCode: 'NV005',
    name: 'Phạm Minh D',
    email: 'pham.minhd@company.com',
    phone: '0945678901',
    position: 'Nhân viên bán hàng',
    department: 'Bán hàng',
    joinDate: '2024-05-05',
    status: 'Đang làm việc',
    salary: 10000000,
  },
];

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    employeeCode: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joinDate: new Date().toISOString().split('T')[0],
    salary: 0,
    status: 'Đang làm việc' as Employee['status'],
  });

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEmployee = () => {
    const newEmployee: Employee = {
      id: employees.length + 1,
      employeeCode: formData.employeeCode || `NV${String(employees.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      department: formData.department,
      joinDate: formData.joinDate,
      salary: formData.salary,
      status: formData.status,
    };
    setEmployees([...employees, newEmployee]);
    setIsCreateDialogOpen(false);
    resetFormData();
    toast.success('Nhân viên đã được thêm thành công!');
  };

  const handleEditEmployee = () => {
    if (selectedEmployee) {
      const updatedEmployee: Employee = {
        ...selectedEmployee,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        joinDate: formData.joinDate,
        salary: formData.salary,
        status: formData.status,
      };
      setEmployees(employees.map((emp) => (emp.id === selectedEmployee.id ? updatedEmployee : emp)));
      setIsEditDialogOpen(false);
      toast.success('Thông tin nhân viên đã được cập nhật!');
    }
  };

  const handleDeleteEmployee = () => {
    if (selectedEmployee) {
      setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
      setIsDeleteDialogOpen(false);
      toast.success('Nhân viên đã được xóa thành công!');
    }
  };

  const handleDownloadEmployee = (employee: Employee) => {
    toast.success(`Đang tải thông tin nhân viên ${employee.employeeCode}...`);
    // Logic để tải thông tin nhân viên
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleEditEmployeeOpen = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      employeeCode: employee.employeeCode,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      joinDate: employee.joinDate,
      salary: employee.salary,
      status: employee.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteEmployeeOpen = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      employeeCode: '',
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      joinDate: new Date().toISOString().split('T')[0],
      salary: 0,
      status: 'Đang làm việc',
    });
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Đang làm việc':
        return 'bg-green-100 text-green-800';
      case 'Nghỉ phép':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã nghỉ việc':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý nhân viên
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin nhân viên của Beta Book
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Thêm nhân viên
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên, email, chức vụ hoặc phòng ban..."
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
              <p className="text-gray-600 text-sm">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {employees.length}
              </p>
            </div>
            <User className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đang làm việc</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {employees.filter((e) => e.status === "Đang làm việc").length}
              </p>
            </div>
            <User className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Nghỉ phép</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {employees.filter((e) => e.status === "Nghỉ phép").length}
              </p>
            </div>
            <User className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng lương</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(
                  employees.reduce((sum, e) => sum + e.salary, 0) / 1000000
                ).toFixed(1)}
                M
              </p>
            </div>
            <User className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã nhân viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chức vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phòng ban
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày vào
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lương
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
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-orange-600">
                    {emp.employeeCode}
                  </div>
                  <div className="text-sm text-gray-900">{emp.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      {emp.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {emp.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {emp.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {emp.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(emp.joinDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {emp.salary.toLocaleString("vi-VN")}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewEmployee(emp)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEmployeeOpen(emp)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEmployeeOpen(emp)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadEmployee(emp)}
                    >
                      <Download className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Employee Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm nhân viên mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin nhân viên mới vào hệ thống
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Mã nhân viên */}
            <div className="space-y-2">
              <Label htmlFor="employeeCode" className="text-sm font-medium">
                Mã nhân viên
              </Label>
              <Input
                id="employeeCode"
                value={
                  formData.employeeCode ||
                  `NV${String(employees.length + 1).padStart(3, "0")}`
                }
                onChange={(e) =>
                  setFormData({ ...formData, employeeCode: e.target.value })
                }
                className="bg-gray-50"
                placeholder="Tự động tạo"
                readOnly
              />
            </div>

            {/* Thông tin cá nhân */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">
                Thông tin cá nhân
              </h4>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Tên nhân viên
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên nhân viên"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0901234567"
                />
              </div>
            </div>

            {/* Thông tin công việc */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">
                Thông tin công việc
              </h4>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium">
                  Chức vụ
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="VD: Nhân viên bán hàng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Phòng ban
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="VD: Bán hàng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate" className="text-sm font-medium">
                  Ngày vào làm
                </Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">
                  Lương (VNĐ)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="10000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Trạng thái
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Employee["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang làm việc">Đang làm việc</SelectItem>
                    <SelectItem value="Nghỉ phép">Nghỉ phép</SelectItem>
                    <SelectItem value="Đã nghỉ việc">Đã nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetFormData();
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={handleCreateEmployee}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Thêm nhân viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
            <DialogDescription>Cập nhật thông tin nhân viên</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Mã nhân viên */}
            <div className="space-y-2">
              <Label htmlFor="editEmployeeCode" className="text-sm font-medium">
                Mã nhân viên
              </Label>
              <Input
                id="editEmployeeCode"
                value={formData.employeeCode}
                className="bg-gray-50"
                readOnly
              />
            </div>

            {/* Thông tin cá nhân */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">
                Thông tin cá nhân
              </h4>

              <div className="space-y-2">
                <Label htmlFor="editName" className="text-sm font-medium">
                  Tên nhân viên
                </Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên nhân viên"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editEmail" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editPhone" className="text-sm font-medium">
                  Số điện thoại
                </Label>
                <Input
                  id="editPhone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0901234567"
                />
              </div>
            </div>

            {/* Thông tin công việc */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">
                Thông tin công việc
              </h4>

              <div className="space-y-2">
                <Label htmlFor="editPosition" className="text-sm font-medium">
                  Chức vụ
                </Label>
                <Input
                  id="editPosition"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="VD: Nhân viên bán hàng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editDepartment" className="text-sm font-medium">
                  Phòng ban
                </Label>
                <Input
                  id="editDepartment"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="VD: Bán hàng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editJoinDate" className="text-sm font-medium">
                  Ngày vào làm
                </Label>
                <Input
                  id="editJoinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editSalary" className="text-sm font-medium">
                  Lương (VNĐ)
                </Label>
                <Input
                  id="editSalary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="10000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus" className="text-sm font-medium">
                  Trạng thái
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Employee["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang làm việc">Đang làm việc</SelectItem>
                    <SelectItem value="Nghỉ phép">Nghỉ phép</SelectItem>
                    <SelectItem value="Đã nghỉ việc">Đã nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={handleEditEmployee}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết nhân viên</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về nhân viên
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Mã nhân viên
              </Label>
              <div className="text-lg font-semibold text-orange-600">
                {selectedEmployee?.employeeCode}
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tên nhân viên:</span>
                <span className="text-sm font-medium">
                  {selectedEmployee?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email:</span>
                <span className="text-sm font-medium">
                  {selectedEmployee?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Số điện thoại:</span>
                <span className="text-sm font-medium">
                  {selectedEmployee?.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Chức vụ:</span>
                <span className="text-sm font-medium">
                  {selectedEmployee?.position}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phòng ban:</span>
                <span className="text-sm font-medium">
                  {selectedEmployee?.department}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Ngày vào làm:</span>
                <span className="text-sm font-medium">
                  {selectedEmployee && formatDate(selectedEmployee.joinDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Lương:</span>
                <span className="text-sm font-semibold text-orange-600">
                  {selectedEmployee?.salary.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Trạng thái:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedEmployee && getStatusColor(selectedEmployee.status)}`}
                >
                  {selectedEmployee?.status}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Đóng
            </Button>
            <Button
              type="button"
              onClick={() =>
                selectedEmployee && handleDownloadEmployee(selectedEmployee)
              }
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải thông tin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Employee Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa nhân viên</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mã nhân viên:</span>
                <span className="text-sm font-semibold text-red-600">
                  {selectedEmployee?.employeeCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tên:</span>
                <span className="text-sm font-medium">
                  {selectedEmployee?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Chức vụ:</span>
                <span className="text-sm font-medium">
                  {selectedEmployee?.position}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={handleDeleteEmployee}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa nhân viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
