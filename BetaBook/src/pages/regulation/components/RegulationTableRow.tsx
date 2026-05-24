import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { TableCell, TableRow } from "../../../components/ui/table";
import { Regulation } from "../RegulationsPage";
import { MoreHorizontal } from "lucide-react";

interface RegulationTableRowProps {
    regulation: Regulation;
    onView: (regulation: Regulation) => void;
    onEdit: (regulation: Regulation) => void;
    onDelete: (regulation: Regulation) => void;
}

const RegulationTableRow = ({ regulation, onView, onEdit, onDelete }: RegulationTableRowProps) => {
    return (
        <TableRow>
            <TableCell className="font-medium">{regulation.name}</TableCell>
            <TableCell>
                <Badge variant={regulation.status ? "outline" : "secondary"}>
                    {regulation.status ? "Active" : "Inactive"}
                </Badge>
            </TableCell>
            <TableCell>{regulation.minImport}</TableCell>
            <TableCell>{regulation.maxStock}</TableCell>
            <TableCell>{regulation.discount}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(regulation)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(regulation)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(regulation)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
};

export default RegulationTableRow;
