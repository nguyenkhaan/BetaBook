import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';
import { OutcomeBook, OutcomePublisher } from '../../../services/outcome.service';

interface ImportFormData {
    code: string;
    publisherId: number;
    cost: number;
    status: string;
    quantity: number;
    bookCode: string;
}

interface ImportFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    formData: ImportFormData;
    setFormData: React.Dispatch<React.SetStateAction<ImportFormData>>;
    publishers: OutcomePublisher[];
    books: OutcomeBook[];
    statusOptions: string[];
    onSubmit: () => void;
    submitLabel: string;
    isEdit?: boolean;
}

export const ImportFormDialog: React.FC<ImportFormDialogProps> = ({
    isOpen,
    onOpenChange,
    title,
    description,
    formData,
    setFormData,
    publishers,
    books,
    statusOptions,
    onSubmit,
    submitLabel,
    isEdit = false,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${isEdit ? 'edit-' : ''}code`} className="text-sm font-medium">
                            Code
                        </Label>
                        <Input
                            id={`${isEdit ? 'edit-' : ''}code`}
                            value={formData.code}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    code: e.target.value,
                                }))
                            }
                            placeholder="VD: PN001 hoặc OUT001"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Publisher</Label>
                        <Select
                            value={formData.publisherId ? String(formData.publisherId) : ''}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    publisherId: Number(value),
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn publisher" />
                            </SelectTrigger>
                            <SelectContent>
                                {publishers.map((publisher) => (
                                    <SelectItem key={publisher.id} value={String(publisher.id)}>
                                        {publisher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Book Code</Label>
                        <Select
                            value={formData.bookCode}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    bookCode: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn book" />
                            </SelectTrigger>
                            <SelectContent>
                                {books.map((book) => (
                                    <SelectItem key={book.id} value={book.code}>
                                        {book.code} - {book.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${isEdit ? 'edit-' : ''}cost`} className="text-sm font-medium">
                            Cost
                        </Label>
                        <Input
                            id={`${isEdit ? 'edit-' : ''}cost`}
                            type="number"
                            value={formData.cost}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    cost: Number(e.target.value) || 0,
                                }))
                            }
                            placeholder="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${isEdit ? 'edit-' : ''}quantity`} className="text-sm font-medium">
                            Quantity
                        </Label>
                        <Input
                            id={`${isEdit ? 'edit-' : ''}quantity`}
                            type="number"
                            value={formData.quantity}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    quantity: Number(e.target.value) || 0,
                                }))
                            }
                            placeholder="150"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${isEdit ? 'edit-' : ''}status`} className="text-sm font-medium">
                            Status
                        </Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    status: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy bỏ
                    </Button>
                    <Button type="button" onClick={onSubmit} className="bg-orange-500 hover:bg-orange-600">
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
