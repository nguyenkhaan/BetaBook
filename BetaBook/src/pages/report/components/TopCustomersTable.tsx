import React from 'react';

interface Customer {
    id: number;
    name: string;
    level: string;
    orders: number;
    totalSpent: number;
}

interface TopCustomersTableProps {
    customers: Customer[];
}

export function TopCustomersTable({ customers }: TopCustomersTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                    Top khách hàng
                </h3>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hạng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số đơn hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng chi tiêu
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {customer.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {customer.level}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {customer.orders}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                {customer.totalSpent.toLocaleString('vi-VN')}đ
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
