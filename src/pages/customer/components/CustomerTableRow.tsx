import React from 'react';
import { Customer } from '../CustomersPage';
import { Button } from '../../../components/ui/button';
import { Mail, Phone, Eye, Edit, Trash2, Key } from 'lucide-react';
import { MemberGradeLabel } from '../../../utilis/label_mapper';
import { useAuth } from '../../../contexts/AuthContext';
interface CustomerTableRowProps {
    customer: Customer;
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    getLevelColor: (grade: Customer['grade']) => string;
    onResetPassword: (customer: Customer) => void;
}

export function CustomerTableRow({
    customer,
    onView,
    onEdit,
    onDelete,
    getLevelColor,
    onResetPassword,
}: CustomerTableRowProps) {
    const { isAdmin } = useAuth();

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 text-orange-600 font-medium">
                {customer.code}
            </td>
            <td className="px-6 py-4 font-medium text-gray-900">
                {customer.name}
            </td>
            <td className="px-6 py-4 text-gray-600">
                <div className="flex flex-col">
                    <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                    </span>
                    <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4">{customer.joinDate}</td>
            <td className="px-6 py-4">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                        customer.grade,
                    )}`}
                >
                    {MemberGradeLabel[customer.grade] || 'Chưa xếp hạng'}
                </span>
            </td>
            <td className="px-6 py-4 flex gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(customer)}
                >
                    <Eye className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(customer)}
                >
                    <Edit className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResetPassword(customer)}
                >
                    <Key className="w-4 h-4 text-yellow-700" />
                </Button>
                {isAdmin && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(customer)}
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                )}
            </td>
        </tr>
    );
}
