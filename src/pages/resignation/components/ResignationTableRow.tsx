import { Resignation } from '../ResignationDashboard';
import { TableCell, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';

interface ResignationTableRowProps {
    resignation: Resignation;
    index: number;
}

export function ResignationTableRow({ resignation, index }: ResignationTableRowProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đang xử lý':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'Chấp nhận':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'Từ chối':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    return (
        <TableRow key={resignation.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{resignation.employeeName}</TableCell>
            <TableCell>{resignation.position}</TableCell>
            <TableCell>{resignation.department}</TableCell>
            <TableCell>{resignation.submissionDate}</TableCell>
            <TableCell>{resignation.daysTakenOff} ngày</TableCell>
            <TableCell>
                <Badge className={getStatusColor(resignation.status)}>
                    {resignation.status}
                </Badge>
            </TableCell>
            <TableCell>
                {resignation.status === 'Chấp nhận' || resignation.status === 'Từ chối'
                    ? resignation.approver
                    : ''}
            </TableCell>
        </TableRow>
    );
}
