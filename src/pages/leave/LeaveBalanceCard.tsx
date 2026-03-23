import { Card } from '../../components/ui/card';
import { LeaveBalance } from './LeaveoffPage';

interface LeaveBalanceCardProps {
    balance: LeaveBalance;
}

export function LeaveBalanceCard({ balance }: LeaveBalanceCardProps) {
    const percentage = (balance.usedDays / balance.totalDays) * 100;

    return (
        <Card className="p-6 bg-white border-t-4 border-t-orange-500">
            <div className="text-center space-y-4">
                <div className="pb-4 border-b border-gray-200">
                    <h3 className="text-gray-900">{balance.type}</h3>
                    <div className="text-sm text-gray-500">
                        {balance.validPeriod}
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                        {/* Circular progress */}
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#f3f4f6"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#f97316"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${percentage * 3.52} 352`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-sm text-gray-500">
                                Đã sử dụng
                            </div>
                            <div className="text-gray-900">
                                <span className="text-3xl">
                                    {balance.usedDays}
                                </span>
                                <span className="text-gray-500">
                                    /{balance.totalDays}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
