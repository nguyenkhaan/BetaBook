import { Button } from '../../../components/ui/button';
import { Regulation } from '../RegulationsPage';
import { Edit, Trash2, Eye } from 'lucide-react';

interface RegulationListItemProps {
    regulation: Regulation;
    onEdit: (regulation: Regulation) => void;
    onDelete: (regulation: Regulation) => void;
}

const RegulationListItem = ({
    regulation,
    onEdit,
    onDelete,
}: RegulationListItemProps) => {
    // 1. Sửa logic màu sắc dựa trên Enum Tiếng Anh
    const getStatusConfig = (status: Regulation['status']) => {
        switch (status) {
            case 'active':
                return {
                    label: 'Đang áp dụng',
                    class: 'bg-green-100 text-green-800',
                };
            case 'draft':
                return {
                    label: 'Sắp có hiệu lực',
                    class: 'bg-blue-100 text-blue-800',
                };
            case 'inactive':
                return {
                    label: 'Đã hết hiệu lực',
                    class: 'bg-gray-100 text-gray-800',
                };
            default:
                return { label: status, class: 'bg-gray-100 text-gray-800' };
        }
    };

    // 2. Hàm format ngày tháng (thêm kiểm tra tránh lỗi split)
    const formatDate = (date: string) => {
        if (!date || !date.includes('-')) return date;
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const statusConfig = getStatusConfig(regulation.status);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {regulation.title}
                        </h3>
                        {/* Hiển thị nhãn Tiếng Việt dựa trên Status Tiếng Anh */}
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.class}`}
                        >
                            {statusConfig.label}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {regulation.category}
                        </span>
                    </div>
                    <p className="text-gray-600 mb-3 text-sm">
                        {regulation.description}
                    </p>
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                        <span>
                            Có hiệu lực: {formatDate(regulation.effectiveDate)}
                        </span>
                        <span>
                            Cập nhật: {formatDate(regulation.updatedDate)}
                        </span>
                        <span>Bởi: {regulation.author}</span>
                    </div>
                </div>
                <div className="flex gap-1 ml-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(regulation)}
                        title="Chỉnh sửa"
                    >
                        <Edit className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onDelete(regulation)}
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Xem chi tiết"
                    >
                        <Eye className="w-4 h-4 text-gray-600" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegulationListItem;
