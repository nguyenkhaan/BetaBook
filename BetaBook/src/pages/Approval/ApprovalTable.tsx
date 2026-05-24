import { Resignation } from '../resignation/ResignationDashboard';
import {
    Table,
    TableBody,
} from '../../components/ui/table';
import { ApprovalTableHeader } from './components/ApprovalTableHeader';
import { ApprovalTableRow } from './components/ApprovalTableRow';

interface ApprovalTableProps {
    resignations: Resignation[];
    onApprove: (id: number) => void;
    onDeny: (id: number) => void;
    onViewDetail: (id: number) => void;
    title: string;
    showActions?: boolean;
}

export function ApprovalTable({
    resignations,
    onApprove,
    onDeny,
    onViewDetail,
    title,
    showActions = true,
}: ApprovalTableProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-gray-900">{title}</h2>
            </div>

            <Table>
                <ApprovalTableHeader showActions={showActions} />
                <TableBody>
                    {resignations.map((resignation, index) => (
                        <ApprovalTableRow
                            key={resignation.id}
                            resignation={resignation}
                            index={index}
                            onApprove={onApprove}
                            onDeny={onDeny}
                            onViewDetail={onViewDetail}
                            showActions={showActions}
                        />
                    ))}
                </TableBody>
            </Table>

            {resignations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    Không tìm thấy yêu cầu nghỉ việc
                </div>
            )}
        </div>
    );
}
