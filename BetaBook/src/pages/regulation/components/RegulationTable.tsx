import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Regulation } from "../RegulationsPage";
import RegulationTableRow from "./RegulationTableRow";

interface RegulationTableProps {
    regulations: Regulation[];
    onView: (regulation: Regulation) => void;
    onEdit: (regulation: Regulation) => void;
    onDelete: (regulation: Regulation) => void;
}

const RegulationTable = ({ regulations, onView, onEdit, onDelete }: RegulationTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Min Import</TableHead>
                    <TableHead>Max Stock</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {regulations.map((regulation) => (
                    <RegulationTableRow
                        key={regulation.id}
                        regulation={regulation}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </TableBody>
        </Table>
    );
};

export default RegulationTable;
