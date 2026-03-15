import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import { ResignationDialog } from './ResignationDialog';
import { ResignationStats } from './ResignationStats';
import { ResignationTable } from './ResignationTable';

export interface Resignation {
  id: number;
  employeeName: string;
  position: string;
  department: string;
  submissionDate: string;
  daysTakenOff: string; // Format: "02/12"
  reason: string;
  status: 'Đang xử lý' | 'Chấp nhận' | 'Từ chối';
  approver: string;
}

interface ResignationDashboardProps {
  resignations: Resignation[];
  onAddResignation: (resignation: Resignation) => void;
}

export function ResignationDashboard({ resignations, onAddResignation }: ResignationDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitResignation = (data: any) => {
    const newResignation: Resignation = {
      id: resignations.length + 1,
      employeeName: 'Văn Tiến Đạt', // Current user
      position: data.position,
      department: data.department,
      submissionDate: new Date().toLocaleDateString('vi-VN') + ' - ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      daysTakenOff: data.daysTakenOff,
      reason: data.reason,
      status: 'Đang xử lý',
      approver: data.approver,
    };
    
    onAddResignation(newResignation);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Nghỉ việc</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo đơn xin nghỉ việc
        </Button>
      </div>

      {/* Stats */}
      <ResignationStats resignations={resignations} />

      {/* Resignation Table */}
      <ResignationTable resignations={resignations} />

      {/* Resignation Dialog */}
      <ResignationDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitResignation}
      />
    </div>
  );
}
