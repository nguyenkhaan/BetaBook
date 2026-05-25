import { Rule } from '../../../services/regulation.service';

interface RegulationMetadataProps {
    regulation: Rule;
}

const RegulationMetadata = ({ regulation }: RegulationMetadataProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Ngày có hiệu lực</p>
                <p className="text-lg font-semibold text-gray-900">
                    {formatDate(regulation.appliedAt)}
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                <p className="text-lg font-semibold text-gray-900">
                    {formatDate(regulation.updatedAt)}
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Loại quy định</p>
                <p className="text-lg font-semibold text-gray-900">
                    {regulation.type}
                </p>
            </div>
        </div>
    );
};

export default RegulationMetadata;
