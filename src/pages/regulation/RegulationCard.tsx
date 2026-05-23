import { Settings, Eye, Pencil, Trash2, Power } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';

interface RegulationCardProps {
    id : number; 
    title: string;
    description: string;
    status: 'APPLYING' | 'UPCOMING' | 'REJECT';
    effectiveDate?: string;
    updatedDate?: string;
    author?: string;
    enabled?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
}

export function RegulationCard({
    id, 
    title,
    description,
    status,
    effectiveDate,
    updatedDate,
    author,
    enabled = true,
    onEdit,
    onDelete,
    onView,
}: RegulationCardProps) {
    const {isAdmin} = useAuth() 
    const statusConfig = {
        APPLYING: {
            label: 'Đang áp dụng',
            color: 'bg-green-100 text-green-700 border-green-200',
        },
        UPCOMING: {
            label: 'Sắp có hiệu lực',
            color: 'bg-blue-100 text-blue-700 border-blue-200',
        },
        REJECT: {
            label: 'Đã hết hiệu lực',
            color: 'bg-gray-100 text-gray-700 border-gray-200',
        },
    };

    const config = statusConfig[status];

    return (
        <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                        {!enabled && (
                            <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                <Power className="w-3 h-3" />
                                <span>Tắt</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 mb-3">
                        <Badge className={`${config.color} border`}>
                            {config.label}
                        </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{description}</p>
                </div>
                <div className="flex gap-2">
                    {isAdmin && <button
                        onClick={onEdit}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Pencil className="w-4 h-4 text-gray-600" />
                    </button>} 
                    {isAdmin && <button
                        onClick={onDelete}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>} 
                    <button
                        onClick={onView}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xem"
                    >
                        <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="flex gap-6 text-xs text-gray-500 mt-4">
                {effectiveDate && <span>Có hiệu lực: {effectiveDate}</span>}
                {updatedDate && <span>Cập nhật: {updatedDate}</span>}
                {author && <span>Bởi: {author}</span>}
            </div>
        </div>
    );
}
