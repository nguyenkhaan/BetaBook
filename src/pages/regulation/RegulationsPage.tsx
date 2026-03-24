import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import RegulationHeader from './components/RegulationHeader';
import FilterBar from './components/FilterBar';
import Statistic from './components/Statistic';
import RegulationList from './components/RegulationList';
import RegulationDialogs from './components/RegulationDialogs';

export interface Regulation {
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

const mockRegulations: Regulation[] = [
    {
        id: 1,
        title: 'Quy định về giờ làm việc',
        category: 'Nhân sự',
        description:
            'Quy định về thời gian làm việc, giờ nghỉ trưa và nghỉ phép của nhân viên',
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
        description:
            'Quy định về các mức giảm giá, điều kiện áp dụng và thời gian khuyến mãi',
        content: `1. Các mức giảm giá:\n- Sách mới phát hành: Không giảm giá trong 3 tháng đầu\n- Sách bán chậm: Giảm 10-20% sau 6 tháng\n- Sách cũ: Giảm 30-50% sau 1 năm\n\n2. Chương trình khuyến mãi:\n- Mua 3 tặng 1: Áp dụng cho sách cùng thể loại\n- Giảm giá theo hạng thành viên:\n  + Đồng: Không giảm\n  + Bạc: Giảm 5%\n  + Vàng: Giảm 10%\n  + Kim cương: Giảm 15%\n\n3. Thời gian khuyến mãi:\n- Black Friday: Giảm 20-40%\n- Tết Nguyên Đán: Giảm 15-30%\n- Ngày Sách Việt Nam: Giảm 20%\n\n4. Điều kiện:\n- Không áp dụng đồng thời nhiều chương trình\n- Sách đặc biệt không được giảm giá\n- Chỉ áp dụng cho sách còn hàng`,
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
        description:
            'Quy định về điều kiện, thời hạn và quy trình đổi trả sách',
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
        description:
            'Mức tồn kho tối thiểu cho từng loại sách và quy trình đặt hàng bổ sung',
        content: `1. Mức tồn kho tối thiểu:\n- Sách giáo khoa: 100 cuốn/đầu sách\n- Sách thiếu nhi: 50 cuốn/đầu sách\n- Văn học: 30 cuốn/đầu sách\n- Sách chuyên ngành: 20 cuốn/đầu sách\n\n2. Kiểm tra tồn kho:\n- Kiểm tra hàng tuần\n- Báo cáo sách dưới mức tối thiểu\n- Lập kế hoạch đặt hàng\n\n3. Đặt hàng bổ sung:\n- Đặt hàng khi sách dưới 50% mức tối thiểu\n- Số lượng đặt = Mức tối thiểu x 2\n- Ưu tiên sách bán chạy`,
        effectiveDate: '2025-12-01',
        status: 'Đã hết hiệu lực',
        lastUpdated: '2025-12-01',
        updatedBy: 'A Nguyen Van',
    },
];

export function RegulationsPage() {
    const [regulations, setRegulations] =
        useState<Regulation[]>(mockRegulations);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRegulation, setSelectedRegulation] =
        useState<Regulation | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Nhân sự',
        description: '',
        content: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        status: 'Đang áp dụng' as Regulation['status'],
        updatedBy: 'A Nguyen Van',
    });

    const categories = [
        'Tất cả',
        'Nhân sự',
        'Bán hàng',
        'Kho vận',
        'Dịch vụ khách hàng',
        'Tài chính',
        'An toàn',
    ];

    const filteredRegulations = regulations.filter((reg) => {
        const matchesSearch =
            reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === 'Tất cả' || reg.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
            setRegulations(
                regulations.map((reg) =>
                    reg.id === selectedRegulation.id ? updatedRegulation : reg,
                ),
            );
            setIsEditDialogOpen(false);
            toast.success('Quy định đã được cập nhật thành công!');
        }
    };

    const handleDeleteRegulation = () => {
        if (selectedRegulation) {
            setRegulations(
                regulations.filter((reg) => reg.id !== selectedRegulation.id),
            );
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

    return (
        <div className="space-y-6">
            <RegulationHeader onAdd={() => setIsCreateDialogOpen(true)} />
            <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <Statistic regulations={regulations} />
            <RegulationList
                regulations={filteredRegulations}
                onEdit={handleEditRegulationOpen}
                onDelete={handleDeleteRegulationOpen}
            />
            <RegulationDialogs
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                isEditDialogOpen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                isDeleteDialogOpen={isDeleteDialogOpen}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                formData={formData}
                setFormData={setFormData}
                handleCreateRegulation={handleCreateRegulation}
                handleEditRegulation={handleEditRegulation}
                handleDeleteRegulation={handleDeleteRegulation}
                resetFormData={resetFormData}
                selectedRegulation={selectedRegulation}
                categories={categories}
            />
        </div>
    );
}
