import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface InvoiceHeaderProps {
    onCreateClick: () => void;
}

export function InvoiceHeader({ onCreateClick }: InvoiceHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Quản lý hóa đơn
                </h1>
                <p className="text-gray-600 mt-1">
                    Quản lý hóa đơn bán hàng của Beta Book
                </p>
            </div>
            <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={onCreateClick}
            >
                <Plus className="w-4 h-4" />
                Tạo hóa đơn mới
            </Button>
        </div>
    );
}
