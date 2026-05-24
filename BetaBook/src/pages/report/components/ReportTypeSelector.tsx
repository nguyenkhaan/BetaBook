import React from 'react';
import { Button } from '../../../components/ui/button';

interface ReportTypeSelectorProps {
    reportType: string;
    setReportType: (type: string) => void;
}

export function ReportTypeSelector({ reportType, setReportType }: ReportTypeSelectorProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex gap-4">
                <Button
                    variant={
                        reportType === 'revenue' ? 'default' : 'outline'
                    }
                    onClick={() => setReportType('revenue')}
                    className={
                        reportType === 'revenue'
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : ''
                    }
                >
                    Doanh thu
                </Button>
                <Button
                    variant={
                        reportType === 'inventory' ? 'default' : 'outline'
                    }
                    onClick={() => setReportType('inventory')}
                    className={
                        reportType === 'inventory'
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : ''
                    }
                >
                    Tồn kho
                </Button>
                <Button
                    variant={
                        reportType === 'customer' ? 'default' : 'outline'
                    }
                    onClick={() => setReportType('customer')}
                    className={
                        reportType === 'customer'
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : ''
                    }
                >
                    Khách hàng
                </Button>
            </div>
        </div>
    );
}
