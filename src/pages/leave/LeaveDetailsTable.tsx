import { Card } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { LeaveBalance } from './LeaveoffPage';

interface LeaveDetailsTableProps {
  balances: LeaveBalance[];
}

export function LeaveDetailsTable({ balances }: LeaveDetailsTableProps) {
  return (
    <Card className="p-6 bg-white">
      <h2 className="mb-4 text-gray-900">Chi tiết nghỉ phép</h2>
      
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-center">#</TableHead>
            <TableHead>Thời hạn sử dụng</TableHead>
            <TableHead>Phần loại</TableHead>
            <TableHead className="text-center">Tổng số ngày nghỉ phép</TableHead>
            <TableHead className="text-center">Số ngày nghỉ phép đã sử dụng</TableHead>
            <TableHead className="text-center">Số ngày nghỉ phép còn lại</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balances.map((balance, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>{balance.validPeriod}</TableCell>
              <TableCell>{balance.category}</TableCell>
              <TableCell className="text-center">{balance.totalDays} ngày</TableCell>
              <TableCell className="text-center">{balance.usedDays} ngày</TableCell>
              <TableCell className="text-center">{balance.remainingDays} ngày</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Tổng: {balances.length}</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">&lt; Trước</button>
          <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Sau &gt;</button>
        </div>
      </div>
    </Card>
  );
}
