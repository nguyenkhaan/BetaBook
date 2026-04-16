import { Rule } from '../../../services/regulation.service';

interface RegulationContentProps {
    regulation: Rule;
}

const RegulationContent = ({ regulation }: RegulationContentProps) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Mô tả
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    {regulation.shortDescription}
                </p>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Nội dung chi tiết
                </h2>
                <div
                    className="prose prose-orange max-w-none text-gray-800 leading-7 whitespace-pre-wrap"
                >
                    {regulation.content}
                </div>
            </div>
        </div>
    );
};

export default RegulationContent;
