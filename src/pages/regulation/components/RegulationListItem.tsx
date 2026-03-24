import { Button } from "../../../components/ui/button";
import { Regulation } from "../RegulationsPage";
import { Edit, Trash2, Eye } from "lucide-react";

interface RegulationListItemProps {
    regulation: Regulation;
    onEdit: (regulation: Regulation) => void;
    onDelete: (regulation: Regulation) => void;
}

const RegulationListItem = ({ regulation, onEdit, onDelete }: RegulationListItemProps) => {
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

    const formatDate = (date: string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {regulation.title}
                        </h3>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                regulation.status,
                            )}`}
                        >
                            {regulation.status}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {regulation.category}
                        </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                        {regulation.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>
                            Có hiệu lực:{' '}
                            {formatDate(regulation.effectiveDate)}
                        </span>
                        <span>
                            Cập nhật:{' '}
                            {formatDate(regulation.lastUpdated)}
                        </span>
                        <span>Bởi: {regulation.updatedBy}</span>
                    </div>
                </div>
                <div className="flex gap-2 ml-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(regulation)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(regulation)}
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                    //Them su kien onClick de tien hanh chuyen trang va doc du lieu
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegulationListItem;
