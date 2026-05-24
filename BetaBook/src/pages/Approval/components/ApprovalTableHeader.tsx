import React from 'react';
import { TableHead, TableHeader, TableRow } from '../../../components/ui/table';

interface ApprovalTableHeaderProps {
    showActions?: boolean;
}

export function ApprovalTableHeader({ showActions = true }: ApprovalTableHeaderProps) {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-12 text-center"></TableHead>
                <TableHead>Tên nhân viên</TableHead>
                <TableHead className="text-center">Vị trí</TableHead>
                <TableHead className="text-center">Phòng ban</TableHead>
                <TableHead className="text-center">
                    Ngày nộp đơn
                </TableHead>
                <TableHead className="text-center">
                    Số ngày nghỉ
                </TableHead>
                <TableHead className="text-center">Chi tiết</TableHead>
                {showActions && (
                    <TableHead className="text-center">
                        Hành động
                    </TableHead>
                )}
            </TableRow>
        </TableHeader>
    );
}
