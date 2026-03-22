import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import { Search } from 'lucide-react';
import { LeaveRequest } from './LeaveoffPage';

interface LeaveRequestTableProps {
  requests: LeaveRequest[];
}

export function LeaveRequestTable({ requests }: LeaveRequestTableProps) {
  const getStatusBadge = (status: LeaveRequest['status']) => {
    const styles = {
      'Chờ duyệt': 'bg-yellow-100 text-yellow-800',
      'Đã duyệt': 'bg-green-100 text-green-800',
      'Từ chối': 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge variant="secondary" className={styles[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="p-6 bg-white">
      <h2 className="mb-4 text-gray-900">Danh sách đơn xin nghỉ phép</h2>
      
      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <button className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">
          Hôy
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Tìm kiếm" 
            className="pl-10"
          />
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead className="text-center">#</TableHead>
            <TableHead>Ngày bắt đầu</TableHead>
            <TableHead>Ngày kết thúc</TableHead>
            <TableHead>Ngày gửi yêu cầu</TableHead>
            <TableHead>Lý do</TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow key={request.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{request.startDate}</TableCell>
              <TableCell>{request.endDate}</TableCell>
              <TableCell>{request.submissionDate}</TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
            </TableRow>
          ))}
          {requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Tổng: {requests.length}</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">&lt; Trước</button>
          <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Sau &gt;</button>
        </div>
      </div>
    </Card>
  );
}
