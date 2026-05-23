import { Settings } from 'lucide-react';
import { Regulation } from '../RegulationsPage';

interface StatisticProps {
    regulations: Regulation[];
}

const Statistic = ({ regulations }: StatisticProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tổng quy định */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">
                            Tổng quy định
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {regulations.length}
                        </p>
                    </div>
                    <Settings className="w-10 h-10 text-orange-500 opacity-80" />
                </div>
            </div>

            {/* Đang áp dụng (active) */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">
                            Đang áp dụng
                        </p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {
                                regulations.filter((r) => r.status === 'active')
                                    .length
                            }
                        </p>
                    </div>
                    <Settings className="w-10 h-10 text-green-500 opacity-80" />
                </div>
            </div>

            {/* Sắp có hiệu lực (draft) */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">
                            Sắp có hiệu lực
                        </p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                            {
                                regulations.filter((r) => r.status === 'draft')
                                    .length
                            }
                        </p>
                    </div>
                    <Settings className="w-10 h-10 text-blue-500 opacity-80" />
                </div>
            </div>

            {/* Đã hết hiệu lực (inactive) */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">
                            Đã hết hiệu lực
                        </p>
                        <p className="text-2xl font-bold text-gray-600 mt-1">
                            {
                                regulations.filter(
                                    (r) => r.status === 'inactive',
                                ).length
                            }
                        </p>
                    </div>
                    <Settings className="w-10 h-10 text-gray-500 opacity-80" />
                </div>
            </div>
        </div>
    );
};

export default Statistic;
