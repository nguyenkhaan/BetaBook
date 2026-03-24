import { Regulation } from "../RegulationsPage";

interface RegulationMetadataProps {
    regulation: Regulation;
}

const RegulationMetadata = ({ regulation }: RegulationMetadataProps) => {
    const formatDate = (date: string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Ngày có hiệu lực</p>
                <p className="text-lg font-semibold text-gray-900">
                    {formatDate(regulation.effectiveDate)}
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                <p className="text-lg font-semibold text-gray-900">
                    {formatDate(regulation.lastUpdated)}
                </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Người cập nhật</p>
                <p className="text-lg font-semibold text-gray-900">
                    {regulation.updatedBy}
                </p>
            </div>
        </div>
    );
};

export default RegulationMetadata;
