import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useState } from 'react';

interface RejectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
    employeeName: string;
}

export function RejectionDialog({
    open,
    onOpenChange,
    onConfirm,
    employeeName,
}: RejectionDialogProps) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason);
            setReason('');
            onOpenChange(false);
        }
    };

    const handleCancel = () => {
        setReason('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-gray-900">
                        Từ chối yêu cầu nghỉ việc
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    <p className="text-sm text-gray-600">
                        Bạn sắp từ chối yêu cầu nghỉ việc của{' '}
                        <span className="font-semibold">{employeeName}</span>.
                    </p>

                    <div className="space-y-2">
                        <Label htmlFor="rejection-reason">
                            Lý do từ chối *
                        </Label>
                        <Textarea
                            id="rejection-reason"
                            placeholder="Vui lòng cung cấp lý do từ chối yêu cầu này..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="pt-6 border-t border-gray-200">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="min-w-[100px]"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                        className="bg-red-500 hover:bg-red-600 text-white min-w-[160px]"
                    >
                        Xác nhận từ chối
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
