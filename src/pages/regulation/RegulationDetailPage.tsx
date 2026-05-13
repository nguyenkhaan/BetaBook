import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import RegulationDetailHeader from './components/RegulationDetailHeader';
import RegulationMetadata from './components/RegulationMetadata';
import RegulationContent from './components/RegulationContent';
import { RegulationService, Rule } from '../../services/regulation.service';

export function RegulationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [regulation, setRegulation] = useState<Rule | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchRegulation(parseInt(id));
        }
    }, [id]);

    const fetchRegulation = async (ruleId: number) => {
        try {
            setIsLoading(true);
            const data = await RegulationService.getById(ruleId);
            setRegulation(data);
        } catch (error) {
            toast.error('Không thể tải chi tiết quy định');
            console.error(error);
            navigate('/regulations');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!regulation) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Không tìm thấy quy định</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <RegulationDetailHeader
                regulation={regulation}
                onBack={() => navigate('/regulations')}
            />
            <RegulationMetadata regulation={regulation} />
            <RegulationContent regulation={regulation} />
        </div>
    );
}
