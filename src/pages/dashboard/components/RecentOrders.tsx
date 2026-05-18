import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card';
import { ShoppingCart } from 'lucide-react';

interface Order {
    id: number;
    code: string | number;
    customer: string; //customer name
    amount: string; //amount
    status: string; //status
    date: string; //date
}
import { BillStatusLabel } from '../../../utilis/label_mapper';
interface RecentOrdersProps {
    orders: Order[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
    console.log(orders);
    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-orange-500" />
                    Đơn hàng gần đây
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.code}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div>
                                <p className="text-sm font-bold text-gray-800">
                                    Mã: {order.code}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Thời gian {new Date(order.date).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                    {order.customer}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">
                                    {order.amount}
                                </p>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                        order.status === 'COMPLETE'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'PENDING'
                                              ? 'bg-blue-100 text-blue-700'
                                              : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                >
                                    {BillStatusLabel[order.status]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
