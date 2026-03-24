import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Regulation } from "../RegulationsPage";

interface RegulationDetailHeaderProps {
    regulation: Regulation;
    onBack: () => void;
}

const RegulationDetailHeader = ({ regulation, onBack }: RegulationDetailHeaderProps) => {
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

    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <Button variant="ghost" onClick={onBack} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">{regulation.title}</h1>
                <div className="flex items-center gap-4 mt-2">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            regulation.status,
                        )}`}
                    >
                        {regulation.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        {regulation.category}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RegulationDetailHeader;
