import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Resignation } from '../ResignationDashboard';

interface ResignationDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resignation: Resignation | null;
}

export function ResignationDetailDialog({
    open,
    onOpenChange,
    resignation,
}: ResignationDetailDialogProps) {
    if (!resignation) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chi tiết yêu cầu nghỉ việc</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-gray-900 pb-2 border-b border-gray-200">
                            Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tên nhân viên</Label>
                                <Input
                                    value={resignation.employeeName}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Input value={resignation.status} disabled />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Vị trí hiện tại</Label>
                                <Input value={resignation.position} disabled />
                            </div>

                            <div className="space-y-2">
                                <Label>Phòng ban</Label>
                                <Input
                                    value={resignation.department}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="space-y-4">
                        <h3 className="text-gray-900 pb-2 border-b border-gray-200">
                            Chi tiết công việc
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ngày nộp đơn</Label>
                                <Input
                                    value={resignation.submissionDate}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Số ngày nghỉ</Label>
                                <Input
                                    value={`${resignation.daysTakenOff} ngày`}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resignation Details */}
                    <div className="space-y-4">
                        <h3 className="text-gray-900 pb-2 border-b border-gray-200">
                            Chi tiết nghỉ việc
                        </h3>
                        <div className="space-y-2">
                            <Label>Lý do nghỉ việc</Label>
                            <Textarea
                                value={resignation.reason}
                                disabled
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Người duyệt</Label>
                            <Input value={resignation.approver} disabled />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="min-w-[100px]"
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
