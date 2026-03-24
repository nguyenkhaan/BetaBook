import React from 'react';
import { User } from 'lucide-react';

interface Employee {
    name: string;
    position: string;
    status: string;
}

interface ProfileCardProps {
    employee: Employee;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ employee }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            <div className="px-6 pb-6">
                <div className="flex items-center gap-6 -mt-16">
                    <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                        <User className="w-16 h-16 text-orange-500" />
                    </div>
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {employee.name}
                        </h2>
                        <p className="text-gray-600">{employee.position}</p>
                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {employee.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
