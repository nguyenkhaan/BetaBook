import React from 'react';
import { Customer } from '../CustomersPage';
import { CustomerTableRow } from './CustomerTableRow';

interface CustomerTableBodyProps {
    customers: Customer[];
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    getLevelColor: (grade: Customer['grade']) => string;
    onResetPassword : (customer : Customer) => void 
}

export function CustomerTableBody({
    customers,
    onView,
    onEdit,
    onDelete,
    getLevelColor,
    onResetPassword
}: CustomerTableBodyProps) {
    return (
        <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
                <CustomerTableRow
                    key={customer.id}
                    customer={customer}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    getLevelColor={getLevelColor}
                    onResetPassword={onResetPassword}
                />
            ))}
        </tbody>
    );
}
