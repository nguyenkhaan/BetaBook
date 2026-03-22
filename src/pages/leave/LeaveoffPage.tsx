import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { LeaveRequestDialog } from './LeaveRequestDialog';
import { LeaveStats } from './LeaveStats';
import { LeaveBalanceCard } from './LeaveBalanceCard';
import { LeaveDetailsTable } from './LeaveDetailsTable';
import { LeaveRequestTable } from './LeaveRequestTable';

export interface LeaveRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  submissionDate: string;
  reason: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  approver: string;
}

export interface LeaveBalance {
  type: string;
  validPeriod: string;
  category: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

interface LeaveoffPageProps {
  leaveRequests: LeaveRequest[];
  onAddLeaveRequest: (request: LeaveRequest) => void;
}

export function LeaveoffPage({ leaveRequests, onAddLeaveRequest }: LeaveoffPageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate total leave days from current user's leave requests
  const totalLeaveDays = leaveRequests
    .filter(req => req.status === 'Đã duyệt')
    .reduce((sum, req) => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0);

  // Mock leave balance data
  const leaveBalances: LeaveBalance[] = [
    {
      type: 'Unpaid Leave',
      validPeriod: '01/2025 - 12/2025',
      category: 'Nghỉ không lương',
      totalDays: 30,
      usedDays: 2,
      remainingDays: 28,
    },
  ];

  const handleSubmitLeaveRequest = (data: any) => {
    const newRequest: LeaveRequest = {
      id: leaveRequests.length + 1,
      employeeName: 'A Nguyen Van',
      startDate: data.startDate,
      endDate: data.endDate,
      submissionDate: new Date().toLocaleDateString('vi-VN') + ' - ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      reason: data.reason,
      status: 'Chờ duyệt',
      approver: data.approver,
    };
    
    onAddLeaveRequest(newRequest);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>🏠 Trang chủ</span>
            <span>&gt;</span>
            <span>My Page</span>
            <span>&gt;</span>
            <span>Leaveoff</span>
          </div>
          <h1 className="text-gray-900">Leaveoff</h1>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo đơn nghỉ phép
        </Button>
      </div>

      {/* Stats */}
      <LeaveStats totalDays={totalLeaveDays} />

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaveBalances.map((balance, index) => (
          <LeaveBalanceCard key={index} balance={balance} />
        ))}
      </div>

      {/* Leave Details Table */}
      <LeaveDetailsTable balances={leaveBalances} />

      {/* Leave Request Table */}
      <LeaveRequestTable requests={leaveRequests} />

      {/* Leave Request Dialog */}
      <LeaveRequestDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitLeaveRequest}
      />
    </div>
  );
}
