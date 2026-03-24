import React from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    sold: number;
    revenue: number;
}

interface TopProductsTableProps {
    products: Product[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                    Top sản phẩm bán chạy
                </h3>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thể loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Đã bán
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Doanh thu
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.sold}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                {product.revenue.toLocaleString('vi-VN')}đ
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
