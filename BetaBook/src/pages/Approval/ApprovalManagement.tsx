import { useState } from 'react';
import { Resignation } from '../resignation/ResignationDashboard';
import { ApprovalTable } from './ApprovalTable';
import { RejectionDialog } from '../RejectionDialog';
import { ResignationDetailDialog } from '../resignation/ResignationDetailDialog';
import { ResignationStats } from '../resignation/ResignationStats';
import { ApprovalHeader } from './components/ApprovalHeader';

interface ApprovalManagementProps {
    resignations: Resignation[];
    onUpdateResignation: (
        id: number,
        status: 'Chấp nhận' | 'Từ chối',
        reason?: string,
    ) => void;
}

export function ApprovalManagement({
    resignations,
    onUpdateResignation,
}: ApprovalManagementProps) {
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedResignation, setSelectedResignation] =
        useState<Resignation | null>(null);

    const handleApprove = (id: number) => {
        onUpdateResignation(id, 'Chấp nhận');
    };

    const handleDeny = (id: number) => {
        const resignation = resignations.find((r) => r.id === id);
        if (resignation) {
            setSelectedResignation(resignation);
            setIsRejectionDialogOpen(true);
        }
    };

    const handleConfirmRejection = (reason: string) => {
        if (selectedResignation) {
            onUpdateResignation(selectedResignation.id, 'Từ chối', reason);
            setSelectedResignation(null);
        }
    };

    const handleViewDetail = (id: number) => {
        const resignation = resignations.find((r) => r.id === id);
        if (resignation) {
            setSelectedResignation(resignation);
            setIsDetailDialogOpen(true);
        }
    };

    // Filter resignations by status
    const inProgressResignations = resignations.filter(
        (r) => r.status === 'Đang xử lý',
    );
    const acceptedResignations = resignations.filter(
        (r) => r.status === 'Chấp nhận',
    );
    const deniedResignations = resignations.filter(
        (r) => r.status === 'Từ chối',
    );

    return (
        <div className="space-y-6">
            <ApprovalHeader />

            {/* Stats */}
            <ResignationStats resignations={resignations} />

            {/* In Progress Table */}
            <ApprovalTable
                resignations={inProgressResignations}
                onApprove={handleApprove}
                onDeny={handleDeny}
                onViewDetail={handleViewDetail}
                title="Yêu cầu chờ phê duyệt"
                showActions={true}
            />

            {/* Accepted Table */}
            <ApprovalTable
                resignations={acceptedResignations}
                onApprove={handleApprove}
                onDeny={handleDeny}
                onViewDetail={handleViewDetail}
                title="Yêu cầu đã chấp nhận"
                showActions={false}
            />

            {/* Denied Table */}
            <ApprovalTable
                resignations={deniedResignations}
                onApprove={handleApprove}
                onDeny={handleDeny}
                onViewDetail={handleViewDetail}
                title="Yêu cầu đã từ chối"
                showActions={false}
            />

            {/* Rejection Dialog */}
            <RejectionDialog
                open={isRejectionDialogOpen}
                onOpenChange={setIsRejectionDialogOpen}
                onConfirm={handleConfirmRejection}
                employeeName={selectedResignation?.employeeName || ''}
            />

            {/* Detail Dialog */}
            <ResignationDetailDialog
                open={isDetailDialogOpen}
                onOpenChange={setIsDetailDialogOpen}
                resignation={selectedResignation}
            />
        </div>
    );
}
