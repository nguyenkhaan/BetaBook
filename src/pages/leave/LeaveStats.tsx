import { Card } from '../../components/ui/card';

interface LeaveStatsProps {
  totalDays: number;
}

export function LeaveStats({ totalDays }: LeaveStatsProps) {
  return (
    <Card className="p-6 bg-white border border-gray-200">
      <div className="flex items-center gap-8">
        <div>
          <span className="text-gray-700">Tổng ngày nghỉ: </span>
          <span>{totalDays} ngày</span>
        </div>
        <div className="text-sm text-gray-600">
          <div>• Có lương: 0</div>
          <div>• Không lương: 2</div>
        </div>
      </div>
    </Card>
  );
}
