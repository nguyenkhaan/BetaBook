import { Regulation } from "../RegulationsPage";
import RegulationListItem from "./RegulationListItem";

interface RegulationListProps {
    regulations: Regulation[];
    onEdit: (regulation: Regulation) => void;
    onDelete: (regulation: Regulation) => void;
}

const RegulationList = ({ regulations, onEdit, onDelete }: RegulationListProps) => {
    return (
        <div className="space-y-4">
            {regulations.map((regulation) => (
                <RegulationListItem
                    key={regulation.id}
                    regulation={regulation}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default RegulationList;
