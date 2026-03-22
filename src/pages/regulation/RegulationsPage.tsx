import { useState } from 'react';
import { Settings, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

interface Regulation {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string;
  effectiveDate: string;
  status: 'Đang áp dụng' | 'Sắp có hiệu lực' | 'Đã hết hiệu lực';
  lastUpdated: string;
  updatedBy: string;
}

interface RegulationsPageProps {
  onNavigate: (page: string) => void;
  onSelectRegulation: (regulation: Regulation) => void;
}

const mockRegulations: Regulation[] = [
  {
    id: 1,
    title: 'Quy định về giờ làm việc',
    category: 'Nhân sự',
    description: 'Quy định về thời gian làm việc, giờ nghỉ trưa và nghỉ phép của nhân viên',
    content: `1. Giờ làm việc:\n- Thời gian làm việc: 8:00 - 17:00 các ngày từ thứ 2 đến thứ 6\n- Nghỉ trưa: 12:00 - 13:00\n- Thứ 7: 8:00 - 12:00 (tùy theo phân công)\n\n2. Chấm công:\n- Nhân viên phải chấm công khi đến và khi về\n- Muộn quá 15 phút sẽ bị trừ 0.5 ngày công\n- Nghỉ không phép sẽ bị trừ 1 ngày công\n\n3. Nghỉ phép:\n- Nhân viên được nghỉ 12 ngày phép/năm\n- Phải xin phép trước 1 ngày\n- Nghỉ đột xuất phải có lý do chính đáng\n\n4. Làm thêm giờ:\n- Được tính công 1.5 lần vào ngày thường\n- Được tính công 2.0 lần vào ngày lễ/tết\n- Phải được quản lý phê duyệt trước`,
    effectiveDate: '2026-01-01',
    status: 'Đang áp dụng',
    lastUpdated: '2026-01-15',
    updatedBy: 'A Nguyen Van',
  },
  {
    id: 2,
    title: 'Chính sách giảm giá sách',
    category: 'Bán hàng',
    description: 'Quy định về các mức giảm giá, điều kiện áp dụng và thời gian khuyến mãi',
    content: `1. Các mức giảm giá:\n- Sách mới phát hành: Không giảm giá trong 3 tháng đầu\n- Sách bán chậm: Giảm 10-20% sau 6 tháng\n- Sách cũ: Giảm 30-50% sau 1 năm\n\n2. Chương trình khuyến mãi:\n- Mua 3 tặng 1: Áp dụng cho sách cùng thể loại\n- Giảm giá theo hạng thành viên:\n  + Đồng: Không giảm\n  + Bạc: Giảm 5%\n  + Vàng: Giảm 10%\n  + Kim cương: Giảm 15%\n\n3. Thời gian khuyến mãi:\n- Black Friday: Giảm 20-40%\n- Tết Nguyên Đán: Giảm 15-30%\n- Ngày Sách Vi���t Nam: Giảm 20%\n\n4. Điều kiện:\n- Không áp dụng đồng thời nhiều chương trình\n- Sách đặc biệt không được giảm giá\n- Chỉ áp dụng cho sách còn hàng`,
    effectiveDate: '2026-02-01',
    status: 'Đang áp dụng',
    lastUpdated: '2026-01-28',
    updatedBy: 'A Nguyen Van',
  },
  {
    id: 3,
    title: 'Quy trình nhập hàng',
    category: 'Kho vận',
    description: 'Quy trình kiểm tra, nhập kho và quản lý hàng hóa mới',
    content: `1. Quy trình đặt hàng:\n- Kiểm tra tồn kho hiện tại\n- Lập đơn đặt hàng gửi nhà cung cấp\n- Xác nhận đơn hàng và thời gian giao\n\n2. Quy trình nhận hàng:\n- Kiểm tra số lượng theo đơn hàng\n- Kiểm tra chất lượng sách (bìa, trang, in ấn)\n- Báo cáo sai lệch nếu có\n\n3. Quy trình nhập kho:\n- Gắn mã barcode cho từng cuốn sách\n- Cập nhật hệ thống quản lý kho\n- Sắp xếp sách vào kệ theo danh mục\n\n4. Báo cáo:\n- Lập biên bản nhập kho\n- Cập nhật số liệu tồn kho\n- Gửi báo cáo cho quản lý`,
    effectiveDate: '2026-03-15',
    status: 'Sắp có hiệu lực',
    lastUpdated: '2026-03-01',
    updatedBy: 'Nguyễn Vũ Linh',
  },
  {
    id: 4,
    title: 'Chính sách đổi trả hàng',
    category: 'Dịch vụ khách hàng',
    description: 'Quy định về điều kiện, thời hạn và quy trình đổi trả sách',
    content: `1. Điều kiện đổi trả:\n- Sách còn nguyên vẹn, không rách, không bẩn\n- Còn tem, nhãn mác đầy đủ\n- Có hóa đơn mua hàng\n- Trong thời hạn 7 ngày kể từ ngày mua\n\n2. Các trường hợp được đổi:\n- Sách bị lỗi in ấn, thiếu trang\n- Sách bị hư hại trong quá trình vận chuyển\n- Giao nhầm sách\n\n3. Các trường hợp được trả:\n- Sách có lỗi từ nhà xuất bản\n- Không đúng như mô tả\n\n4. Quy trình xử lý:\n- Khách hàng mang sách và hóa đơn đến cửa hàng\n- Nhân viên kiểm tra điều kiện đổi trả\n- Xử lý đổi sách mới hoặc hoàn tiền\n- Cập nhật vào hệ thống\n\n5. Lưu ý:\n- Không áp dụng cho sách giảm giá trên 50%\n- Sách đặt riêng không được đổi trả\n- Phí vận chuyển (nếu có) không được hoàn lại`,
    effectiveDate: '2026-01-01',
    status: 'Đang áp dụng',
    lastUpdated: '2026-02-10',
    updatedBy: 'A Nguyen Van',
  },
  {
    id: 5,
    title: 'Quy định về tồn kho tối thiểu',
    category: 'Kho vận',
    description: 'Mức tồn kho tối thiểu cho từng loại sách và quy trình đặt hàng bổ sung',
    content: `1. Mức tồn kho tối thiểu:\n- Sách giáo khoa: 100 cuốn/đầu sách\n- Sách thiếu nhi: 50 cuốn/đầu sách\n- Văn học: 30 cuốn/đầu sách\n- Sách chuyên ngành: 20 cuốn/đầu sách\n\n2. Kiểm tra tồn kho:\n- Kiểm tra hàng tuần\n- Báo cáo sách dưới mức tối thiểu\n- Lập kế hoạch đặt hàng\n\n3. Đặt hàng bổ sung:\n- Đặt hàng khi sách dưới 50% mức tối thiểu\n- Số lượng đặt = Mức tối thiểu x 2\n- Ưu tiên sách bán chạy`,
    effectiveDate: '2025-12-01',
    status: 'Đã hết hiệu lực',
    lastUpdated: '2025-12-01',
    updatedBy: 'A Nguyen Van',
  },
];

export function RegulationsPage({ onNavigate, onSelectRegulation }: RegulationsPageProps) {
  const [regulations, setRegulations] = useState<Regulation[]>(mockRegulations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Nhân sự',
    description: '',
    content: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'Đang áp dụng' as Regulation['status'],
    updatedBy: 'A Nguyen Van',
  });

  const categories = ['Tất cả', 'Nhân sự', 'Bán hàng', 'Kho vận', 'Dịch vụ khách hàng', 'Tài chính', 'An toàn'];

  const filteredRegulations = regulations.filter((reg) => {
    const matchesSearch =
      reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Tất cả' || reg.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Regulation['status']) => {
    switch (status) {
      case 'Đang áp dụng':
        return 'bg-green-100 text-green-800';
      case 'Sắp có hiệu lực':
        return 'bg-blue-100 text-blue-800';
      case 'Đã hết hiệu lực':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRegulation = () => {
    const newRegulation: Regulation = {
      id: regulations.length + 1,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      content: formData.content,
      effectiveDate: formData.effectiveDate,
      status: formData.status,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: formData.updatedBy,
    };
    setRegulations([...regulations, newRegulation]);
    setIsCreateDialogOpen(false);
    resetFormData();
    toast.success('Quy định đã được thêm thành công!');
  };

  const handleEditRegulation = () => {
    if (selectedRegulation) {
      const updatedRegulation: Regulation = {
        ...selectedRegulation,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        content: formData.content,
        effectiveDate: formData.effectiveDate,
        status: formData.status,
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: formData.updatedBy,
      };
      setRegulations(regulations.map((reg) => (reg.id === selectedRegulation.id ? updatedRegulation : reg)));
      setIsEditDialogOpen(false);
      toast.success('Quy định đã được cập nhật thành công!');
    }
  };

  const handleDeleteRegulation = () => {
    if (selectedRegulation) {
      setRegulations(regulations.filter((reg) => reg.id !== selectedRegulation.id));
      setIsDeleteDialogOpen(false);
      toast.success('Quy định đã được xóa thành công!');
    }
  };

  const handleEditRegulationOpen = (regulation: Regulation) => {
    setSelectedRegulation(regulation);
    setFormData({
      title: regulation.title,
      category: regulation.category,
      description: regulation.description,
      content: regulation.content,
      effectiveDate: regulation.effectiveDate,
      status: regulation.status,
      updatedBy: regulation.updatedBy,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteRegulationOpen = (regulation: Regulation) => {
    setSelectedRegulation(regulation);
    setIsDeleteDialogOpen(true);
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      category: 'Nhân sự',
      description: '',
      content: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      status: 'Đang áp dụng',
      updatedBy: 'A Nguyen Van',
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý quy định</h1>
          <p className="text-gray-600 mt-1">Quản lý các quy định và chính sách của Beta Book</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Thêm quy định
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm quy định..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category ? 'bg-orange-500 hover:bg-orange-600' : ''
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng quy định</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{regulations.length}</p>
            </div>
            <Settings className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đang áp dụng</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {regulations.filter((r) => r.status === 'Đang áp dụng').length}
              </p>
            </div>
            <Settings className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sắp có hiệu lực</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {regulations.filter((r) => r.status === 'Sắp có hiệu lực').length}
              </p>
            </div>
            <Settings className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đã hết hiệu lực</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">
                {regulations.filter((r) => r.status === 'Đã hết hiệu lực').length}
              </p>
            </div>
            <Settings className="w-10 h-10 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Regulations List */}
      <div className="space-y-4">
        {filteredRegulations.map((regulation) => (
          <div key={regulation.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{regulation.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      regulation.status
                    )}`}
                  >
                    {regulation.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {regulation.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{regulation.description}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>Có hiệu lực: {formatDate(regulation.effectiveDate)}</span>
                  <span>Cập nhật: {formatDate(regulation.lastUpdated)}</span>
                  <span>Bởi: {regulation.updatedBy}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="ghost" size="sm" onClick={() => handleEditRegulationOpen(regulation)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteRegulationOpen(regulation)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  onSelectRegulation(regulation);
                  onNavigate('regulation-detail');
                }}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Regulation Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm quy định mới</DialogTitle>
            <DialogDescription>Nhập thông tin quy định mới vào hệ thống</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin cơ bản</h4>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Tiêu đề quy định</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Quy định về giờ làm việc"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Danh mục</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nhân sự">Nhân sự</SelectItem>
                      <SelectItem value="Bán hàng">Bán hàng</SelectItem>
                      <SelectItem value="Kho vận">Kho vận</SelectItem>
                      <SelectItem value="Dịch vụ khách hàng">Dịch vụ khách hàng</SelectItem>
                      <SelectItem value="Tài chính">Tài chính</SelectItem>
                      <SelectItem value="An toàn">An toàn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate" className="text-sm font-medium">Ngày có hiệu lực</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Regulation['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang áp dụng">Đang áp dụng</SelectItem>
                    <SelectItem value="Sắp có hiệu lực">Sắp có hiệu lực</SelectItem>
                    <SelectItem value="Đã hết hiệu lực">Đã hết hiệu lực</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Mô tả ngắn</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về quy định"
                />
              </div>
            </div>

            {/* Nội dung quy định */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Nội dung chi tiết</h4>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Nội dung quy định
                  <span className="text-xs text-gray-500 ml-2">(Có thể nhập nhiều dòng)</span>
                </Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung chi tiết của quy định..."
                  className="w-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                  style={{ whiteSpace: 'pre-wrap' }}
                />
                <p className="text-xs text-gray-500">
                  Số ký tự: {formData.content.length}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetFormData(); }}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleCreateRegulation} className="bg-orange-500 hover:bg-orange-600">
              Thêm quy định
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Regulation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa quy định</DialogTitle>
            <DialogDescription>Cập nhật thông tin quy định</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Thông tin cơ bản</h4>
              
              <div className="space-y-2">
                <Label htmlFor="editTitle" className="text-sm font-medium">Tiêu đề quy định</Label>
                <Input
                  id="editTitle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Quy định về giờ làm việc"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editCategory" className="text-sm font-medium">Danh mục</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nhân sự">Nhân sự</SelectItem>
                      <SelectItem value="Bán hàng">Bán hàng</SelectItem>
                      <SelectItem value="Kho vận">Kho vận</SelectItem>
                      <SelectItem value="Dịch vụ khách hàng">Dịch vụ khách hàng</SelectItem>
                      <SelectItem value="Tài chính">Tài chính</SelectItem>
                      <SelectItem value="An toàn">An toàn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editEffectiveDate" className="text-sm font-medium">Ngày có hiệu lực</Label>
                  <Input
                    id="editEffectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editStatus" className="text-sm font-medium">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Regulation['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang áp dụng">Đang áp dụng</SelectItem>
                    <SelectItem value="Sắp có hiệu lực">Sắp có hiệu lực</SelectItem>
                    <SelectItem value="Đã hết hiệu lực">Đã hết hiệu lực</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editDescription" className="text-sm font-medium">Mô tả ngắn</Label>
                <Input
                  id="editDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về quy định"
                />
              </div>
            </div>

            {/* Nội dung quy định */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="text-sm font-semibold text-gray-700">Nội dung chi tiết</h4>
              
              <div className="space-y-2">
                <Label htmlFor="editContent" className="text-sm font-medium">
                  Nội dung quy định
                  <span className="text-xs text-gray-500 ml-2">(Có thể nhập nhiều dòng)</span>
                </Label>
                <textarea
                  id="editContent"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung chi tiết của quy định..."
                  className="w-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                  style={{ whiteSpace: 'pre-wrap' }}
                />
                <p className="text-xs text-gray-500">
                  Số ký tự: {formData.content.length}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleEditRegulation} className="bg-orange-500 hover:bg-orange-600">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Regulation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xóa quy định</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa quy định này?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tiêu đề:</span>
                <span className="text-sm font-semibold text-red-600">{selectedRegulation?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Danh mục:</span>
                <span className="text-sm font-medium">{selectedRegulation?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <span className="text-sm font-medium">{selectedRegulation?.status}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleDeleteRegulation} className="bg-red-500 hover:bg-red-600">
              Xóa quy định
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}