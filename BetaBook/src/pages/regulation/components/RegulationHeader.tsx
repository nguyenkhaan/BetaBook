import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";

interface RegulationHeaderProps {
    onAdd: () => void;
}

const RegulationHeader = ({ onAdd }: RegulationHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Quản lý quy định
                </h1>
                <p className="text-gray-600 mt-1">
                    Quản lý các quy định và chính sách của Beta Book
                </p>
            </div>
            <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={onAdd}
            >
                <Plus className="w-4 h-4" />
                Thêm quy định
            </Button>
        </div>
    );
};

export default RegulationHeader;
