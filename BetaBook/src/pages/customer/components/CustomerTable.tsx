import React from 'react';
import { Customer } from '../CustomersPage';
import { CustomerTableHeader } from './CustomerTableHeader';
import { CustomerTableBody } from './CustomerTableBody';

interface CustomerTableProps {
    customers: Customer[];
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    getLevelColor: (grade: Customer['grade']) => string;
    onResetPassword: (customer : Customer) => void 
}

export function CustomerTable({
    customers,
    onView,
    onEdit,
    onDelete,
    getLevelColor,
    onResetPassword
}: CustomerTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <CustomerTableHeader />
                <CustomerTableBody
                    customers={customers}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    getLevelColor={getLevelColor}
                    onResetPassword={onResetPassword}
                />
            </table>
        </div>
    );
}
