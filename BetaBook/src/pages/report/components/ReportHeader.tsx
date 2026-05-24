import React from 'react';
import { Button } from '../../../components/ui/button';
import { Download } from 'lucide-react';

export function ReportHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Báo cáo thống kê
                </h1>
                <p className="text-gray-600 mt-1">
                    Xem các báo cáo và thống kê của Beta Book
                </p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
                <Download className="w-4 h-4" />
                Xuất báo cáo
            </Button>
        </div>
    );
}
