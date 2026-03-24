import { Regulation } from "./RegulationsPage";
import RegulationDetailHeader from "./components/RegulationDetailHeader";
import RegulationMetadata from "./components/RegulationMetadata";
import RegulationContent from "./components/RegulationContent";

interface RegulationDetailPageProps {
    regulation: Regulation;
    onBack: () => void;
}

export function RegulationDetailPage({ regulation, onBack }: RegulationDetailPageProps) {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <RegulationDetailHeader regulation={regulation} onBack={onBack} />
            <RegulationMetadata regulation={regulation} />
            <RegulationContent regulation={regulation} />
        </div>
    );
}
