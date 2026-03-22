import { Resignation } from './ResignationDashboard';
import { Card } from '../../components/ui/card';

interface ResignationStatsProps {
  resignations: Resignation[];
}

export function ResignationStats({ resignations }: ResignationStatsProps) {
  const stats = {
    inProgress: resignations.filter(r => r.status === 'Đang xử lý').length,
    accepted: resignations.filter(r => r.status === 'Chấp nhận').length,
    denied: resignations.filter(r => r.status === 'Từ chối').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-white border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Đang xử lý</div>
        <div className="text-gray-900">{stats.inProgress}</div>
      </Card>
      
      <Card className="p-6 bg-white border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Chấp nhận</div>
        <div className="text-gray-900">{stats.accepted}</div>
      </Card>
      
      <Card className="p-6 bg-white border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Từ chối</div>
        <div className="text-gray-900">{stats.denied}</div>
      </Card>
    </div>
  );
}
