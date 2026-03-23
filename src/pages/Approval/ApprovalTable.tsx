import { Resignation } from '../resignation/ResignationDashboard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import { Check, X, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
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
                <TableBody>
                    {resignations.map((resignation, index) => (
                        <TableRow key={resignation.id}>
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
                                        {resignation.status ===
                                            'Đang xử lý' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        onApprove(
                                                            resignation.id,
                                                        )
                                                    }
                                                    className="bg-green-500 hover:bg-green-600 text-white"
                                                    title="Chấp nhận yêu cầu"
                                                >
                                                    <Check className="w-4 h-4 mr-1" />
                                                    Chấp nhận
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        onDeny(resignation.id)
                                                    }
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
