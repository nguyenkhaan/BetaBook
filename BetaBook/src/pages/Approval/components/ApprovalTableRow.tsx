import React from 'react';
import { Resignation } from '../../resignation/ResignationDashboard';
import { TableCell, TableRow } from '../../../components/ui/table';
import { Check, X, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface ApprovalTableRowProps {
    resignation: Resignation;
    index: number;
    onApprove: (id: number) => void;
    onDeny: (id: number) => void;
    onViewDetail: (id: number) => void;
    showActions?: boolean;
}

export function ApprovalTableRow({
    resignation,
    index,
    onApprove,
    onDeny,
    onViewDetail,
    showActions = true,
}: ApprovalTableRowProps) {
    return (
        <TableRow>
            <TableCell className="text-center">
                {index + 1}
            </TableCell>
            <TableCell>{resignation.employeeName}</TableCell>
            <TableCell className="text-center">
                {resignation.position}
            </TableCell>
            <TableCell className="text-center">
                {resignation.department}
            </TableCell>
            <TableCell className="text-center">
                {resignation.submissionDate}
            </TableCell>
            <TableCell className="text-center">
                {resignation.daysTakenOff} ngày
            </TableCell>
            <TableCell className="text-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(resignation.id)}
                    className="flex items-center gap-1 mx-auto"
                    title="Xem chi tiết"
                >
                    <FileText className="w-4 h-4" />
                    Xem
                </Button>
            </TableCell>
            {showActions && (
                <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                        {resignation.status === 'Đang xử lý' && (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() => onApprove(resignation.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    title="Chấp nhận yêu cầu"
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    Chấp nhận
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => onDeny(resignation.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    title="Từ chối yêu cầu"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Từ chối
                                </Button>
                            </>
                        )}
                    </div>
                </TableCell>
            )}
        </TableRow>
    );
}
