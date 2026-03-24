import { Settings } from "lucide-react";
import { Regulation } from "../RegulationsPage";

interface StatisticProps {
    regulations: Regulation[];
}

const Statistic = ({ regulations }: StatisticProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Tổng quy định
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {regulations.length}
                        </p>
                    </div>
                    <Settings className="w-10 h-10 text-orange-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Đang áp dụng
                        </p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {
                                regulations.filter(
                                    (r) => r.status === 'Đang áp dụng',
                                ).length
                            }
                        </p>
                    </div>
                    <Settings className="w-10 h-10 text-green-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Sắp có hiệu lực
                        </p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                            {
                                regulations.filter(
                                    (r) => r.status === 'Sắp có hiệu lực',
                                ).length
                            }
                        </p>
                    </div>
                    <Settings className="w-10 h-10 text-blue-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">
                            Đã hết hiệu lực
                        </p>
                        <p className="text-2xl font-bold text-gray-600 mt-1">
                            {
                                regulations.filter(
                                    (r) => r.status === 'Đã hết hiệu lực',
                                ).length
                            }
                        </p>
                    </div>
                    <Settings className="w-10 h-10 text-gray-500" />
                </div>
            </div>
        </div>
    );
};

export default Statistic;
