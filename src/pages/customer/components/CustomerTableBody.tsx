import React from 'react';
import { Customer } from '../CustomersPage';
import { CustomerTableRow } from './CustomerTableRow';

interface CustomerTableBodyProps {
    customers: Customer[];
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    getLevelColor: (level: Customer['level']) => string;
}

export function CustomerTableBody({
    customers,
    onView,
    onEdit,
    onDelete,
    getLevelColor,
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
                />
            ))}
        </tbody>
    );
}
