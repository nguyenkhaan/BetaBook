import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";

interface Customer {
  id: number;
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  level: "Đồng" | "Bạc" | "Vàng" | "Kim cương";
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    customerCode: "KH001",
    name: "Nguyễn Văn A",
    email: "nguyen.vana@email.com",
    phone: "0901234567",
    totalOrders: 12,
    totalSpent: 2500000,
    joinDate: "2025-01-15",
    level: "Vàng",
  },
  {
    id: 2,
    customerCode: "KH002",
    name: "Trần Thị B",
    email: "tran.thib@email.com",
    phone: "0912345678",
    totalOrders: 8,
    totalSpent: 1800000,
    joinDate: "2025-01-20",
    level: "Bạc",
  },
  {
    id: 3,
    customerCode: "KH003",
    name: "Lê Văn C",
    email: "le.vanc@email.com",
    phone: "0923456789",
    totalOrders: 25,
    totalSpent: 5200000,
    joinDate: "2024-12-05",
    level: "Kim cương",
  },
  {
    id: 4,
    customerCode: "KH004",
    name: "Phạm Thị D",
    email: "pham.thid@email.com",
    phone: "0934567890",
    totalOrders: 15,
    totalSpent: 3100000,
    joinDate: "2025-01-10",
    level: "Vàng",
  },
  {
    id: 5,
    customerCode: "KH005",
    name: "Hoàng Văn E",
    email: "hoang.vane@email.com",
    phone: "0945678901",
    totalOrders: 5,
    totalSpent: 950000,
    joinDate: "2025-02-01",
    level: "Đồng",
  },
];

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("Tất cả");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [formData, setFormData] = useState({
    customerCode: "",
    name: "",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    totalOrders: 0,
    totalSpent: 0,
    level: "Đồng" as Customer["level"],
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLevel("Tất cả");
    setSelectedDate("");
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesLevel =
      selectedLevel === "Tất cả" || customer.level === selectedLevel;
    const matchesDate = !selectedDate || customer.joinDate === selectedDate;
    return matchesSearch && matchesLevel && matchesDate;
  });

  const calculateLevel = (totalSpent: number): Customer["level"] => {
    if (totalSpent >= 5000000) return "Kim cương";
    if (totalSpent >= 2500000) return "Vàng";
    if (totalSpent >= 1000000) return "Bạc";
    return "Đồng";
  };

  const isNewCustomer = (joinDate: string): boolean => {
    const join = new Date(joinDate);
    const today = new Date("2026-03-11");
    const diffTime = Math.abs(today.getTime() - join.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 30;
  };

  const getLevelColor = (level: Customer["level"]) => {
    switch (level) {
      case "Vàng":
        return "bg-yellow-100 text-yellow-800";
      case "Kim cương":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateCustomer = () => {
    const newCustomer: Customer = {
      ...formData,
      id: customers.length + 1,
      customerCode: `KH${String(customers.length + 1).padStart(3, "0")}`,
    };
    setCustomers([...customers, newCustomer]);
    setIsCreateDialogOpen(false);
    toast.success("Khách hàng đã được thêm thành công!");
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id ? { ...c, ...formData } : c,
        ),
      );
      setIsEditDialogOpen(false);
      toast.success("Khách hàng đã được cập nhật thành công!");
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers(customers.filter((c) => c.id !== selectedCustomer.id));
      setIsDeleteDialogOpen(false);
      toast.success("Khách hàng đã được xóa thành công!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý khách hàng
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin khách hàng của Beta Book
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4" /> Thêm khách hàng
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Tổng khách hàng</p>
            <p className="text-2xl font-bold">{customers.length}</p>
          </div>
          <Users className="w-10 h-10 text-orange-500" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Khách VIP</p>
            <p className="text-2xl font-bold text-blue-600">
              {customers.filter((c) => c.level === "Kim cương").length}
            </p>
          </div>
          <Users className="w-10 h-10 text-blue-500" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Tổng doanh thu</p>
            <p className="text-2xl font-bold">
              {(
                customers.reduce((sum, c) => sum + c.totalSpent, 0) / 1000000
              ).toFixed(1)}
              M
            </p>
          </div>
          <Users className="w-10 h-10 text-green-500" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Khách hàng mới</p>
            <p className="text-2xl font-bold">
              {customers.filter((c) => isNewCustomer(c.joinDate)).length}
            </p>
          </div>
          <Users className="w-10 h-10 text-purple-500" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm tên, email, số điện thoại..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-orange-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-44">
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="h-10 border-gray-200 text-sm">
              <SelectValue placeholder="Hạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tất cả">Tất cả hạng</SelectItem>
              <SelectItem value="Đồng">Đồng</SelectItem>
              <SelectItem value="Bạc">Bạc</SelectItem>
              <SelectItem value="Vàng">Vàng</SelectItem>
              <SelectItem value="Kim cương">Kim cương</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-44">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <input
            type="date"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm outline-none text-gray-600"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleResetFilters}
          className="border-gray-200 hover:bg-orange-50 group shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-orange-500 group-hover:rotate-180 transition-transform duration-300" />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Mã KH
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Tên khách hàng
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Ngày tham gia
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Hạng
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-orange-600 font-medium">
                  {customer.customerCode}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{customer.joinDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(customer.level)}`}
                  >
                    {customer.level}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setFormData({ ...customer });
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View/Edit/Delete Dialogs được tích hợp logic gọn nhẹ */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(val) => {
          setIsCreateDialogOpen(val);
          setIsEditDialogOpen(val);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Tên khách hàng</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập tên..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="090..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tổng chi tiêu (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.totalSpent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setFormData({
                      ...formData,
                      totalSpent: val,
                      level: calculateLevel(val),
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Hạng thành viên</Label>
                <Input
                  value={formData.level}
                  readOnly
                  className="bg-orange-50 font-bold text-orange-700"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={
                isEditDialogOpen ? handleEditCustomer : handleCreateCustomer
              }
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isEditDialogOpen ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng{" "}
              <b>{selectedCustomer?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
