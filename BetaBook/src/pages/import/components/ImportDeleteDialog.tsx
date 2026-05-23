import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';

interface ImportDeleteDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    importNumber?: string;
}

export const ImportDeleteDialog: React.FC<ImportDeleteDialogProps> = ({
    isOpen,
    onOpenChange,
    onConfirm,
    importNumber,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa phiếu nhập{' '}
                        <span className="font-semibold text-orange-600">
                            {importNumber}
                        </span>{' '}
                        không? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Xác nhận xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
