import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface ResignationHeaderProps {
    onNewResignation: () => void;
}

export function ResignationHeader({ onNewResignation }: ResignationHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-gray-900">Nghỉ việc</h1>
            <Button
                onClick={onNewResignation}
                className="bg-orange-500 hover:bg-orange-600 text-white"
            >
                <Plus className="w-4 h-4 mr-2" />
                Tạo đơn xin nghỉ việc
            </Button>
        </div>
    );
}
