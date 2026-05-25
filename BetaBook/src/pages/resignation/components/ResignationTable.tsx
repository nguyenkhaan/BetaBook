import { Resignation } from '../ResignationDashboard';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface ResignationTableProps {
    resignations: Resignation[];
}

import { ResignationTableRow } from './ResignationTableRow';

export function ResignationTable({ resignations }: ResignationTableProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-gray-900">Yêu cầu nghỉ việc</h2>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Tên nhân viên</TableHead>
                        <TableHead>Vị trí</TableHead>
                        <TableHead>Phòng ban</TableHead>
                        <TableHead>Ngày nộp đơn</TableHead>
                        <TableHead>Số ngày nghỉ</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Người duyệt</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {resignations.map((resignation, index) => (
                        <ResignationTableRow
                            key={resignation.id}
                            resignation={resignation}
                            index={index}
                        />
                    ))}
                </TableBody>
            </Table>

            {resignations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    Không tìm thấy yêu cầu nghỉ việc
                </div>
            )}

            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                    Hiển thị {resignations.length}{' '}
                    {resignations.length === 1 ? 'mục' : 'mục'}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-orange-500 text-white hover:bg-orange-600"
                    >
                        1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        Sau
                    </Button>
                </div>
            </div>
        </div>
    );
}
