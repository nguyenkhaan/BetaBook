import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ResignationDialog } from './components/ResignationDialog';
import { ResignationStats } from './components/ResignationStats';
import { ResignationTable } from './components/ResignationTable';

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

import { ResignationHeader } from './components/ResignationHeader';

export function ResignationDashboard({
    resignations,
    onAddResignation,
}: ResignationDashboardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmitResignation = (data: any) => {
        const newResignation: Resignation = {
            id: resignations.length + 1,
            employeeName: 'Văn Tiến Đạt', // Current user
            position: data.position,
            department: data.department,
            submissionDate:
                new Date().toLocaleDateString('vi-VN') +
                ' - ' +
                new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
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
            <ResignationHeader onNewResignation={() => setIsDialogOpen(true)} />

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
