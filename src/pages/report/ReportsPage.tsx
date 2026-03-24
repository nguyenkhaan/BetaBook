import { useState } from 'react';
import { ReportHeader } from './components/ReportHeader';
import { ReportTypeSelector } from './components/ReportTypeSelector';
import { SummaryCards } from './components/SummaryCards';

export function ReportsPage() {
    const [reportType, setReportType] = useState('revenue');

    return (
        <div className="space-y-6">
            <ReportHeader />
            <ReportTypeSelector reportType={reportType} setReportType={setReportType} />
            <SummaryCards />
        </div>
    );
}
