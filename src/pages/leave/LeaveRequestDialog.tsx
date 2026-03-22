import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

interface LeaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function LeaveRequestDialog({ open, onOpenChange, onSubmit }: LeaveRequestDialogProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    approver: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      startDate: '',
      endDate: '',
      reason: '',
      approver: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo đơn xin nghỉ phép</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho đơn xin nghỉ phép của bạn
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Ngày bắt đầu</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Lý do</Label>
              <Textarea
                id="reason"
                placeholder="Nhập lý do xin nghỉ phép..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="approver">Người phê duyệt</Label>
              <Select
                value={formData.approver}
                onValueChange={(value) => setFormData({ ...formData, approver: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn người phê duyệt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nguyễn Vũ Linh">Nguyễn Vũ Linh</SelectItem>
                  <SelectItem value="Phạm Minh D">Phạm Minh D</SelectItem>
                  <SelectItem value="Trần Thị E">Trần Thị E</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600"
            >
              Gửi đơn
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
