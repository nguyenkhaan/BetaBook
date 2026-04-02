import { useState } from 'react';
import {
    ClipboardList,
    Download,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
} from 'recharts';

import {
    revenueData,
    topProducts,
    debtData,
    slowMovingBooks,
    inventoryByCategory,
    customerStats,
} from '../report/components/ReportData';

const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

// Format month for display (e.g., "2026-03" -> "Tháng 3/2026")
const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `Tháng ${parseInt(month)}/${year}`;
};

export function ReportsPage() {
    const [reportType, setReportType] = useState<
        'revenue' | 'inventory' | 'customer' | 'debt'
    >('revenue');
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

    // Calculate totals for debt report
    const debtTotals = debtData.reduce(
        (acc, item) => ({
            beginningDebt: acc.beginningDebt + item.beginningDebt,
            transactions: acc.transactions + item.transactions,
            endingDebt: acc.endingDebt + item.endingDebt,
        }),
        { beginningDebt: 0, transactions: 0, endingDebt: 0 },
    );

    return (
        <div className="space-y-6">
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

            {/* Report Type Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex gap-4">
                    <Button
                        variant={
                            reportType === 'revenue' ? 'default' : 'outline'
                        }
                        onClick={() => setReportType('revenue')}
                        className={
                            reportType === 'revenue'
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : ''
                        }
                    >
                        Doanh thu
                    </Button>
                    <Button
                        variant={
                            reportType === 'inventory' ? 'default' : 'outline'
                        }
                        onClick={() => setReportType('inventory')}
                        className={
                            reportType === 'inventory'
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : ''
                        }
                    >
                        Tồn kho
                    </Button>
                    <Button
                        variant={
                            reportType === 'customer' ? 'default' : 'outline'
                        }
                        onClick={() => setReportType('customer')}
                        className={
                            reportType === 'customer'
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : ''
                        }
                    >
                        Khách hàng
                    </Button>
                    <Button
                        variant={reportType === 'debt' ? 'default' : 'outline'}
                        onClick={() => setReportType('debt')}
                        className={
                            reportType === 'debt'
                                ? 'bg-orange-500 hover:bg-orange-600'
                                : ''
                        }
                    >
                        Công nợ
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">
                                Doanh thu tháng này
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                25.0M
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">
                                    +12.5%
                                </span>
                            </div>
                        </div>
                        <ClipboardList className="w-10 h-10 text-orange-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                245
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">
                                    +8.3%
                                </span>
                            </div>
                        </div>
                        <ClipboardList className="w-10 h-10 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">
                                Giá trị đơn TB
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                102K
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">
                                    +5.2%
                                </span>
                            </div>
                        </div>
                        <ClipboardList className="w-10 h-10 text-green-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">
                                Tỷ lệ hoàn trả
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                2.3%
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingDown className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-600">
                                    -0.5%
                                </span>
                            </div>
                        </div>
                        <ClipboardList className="w-10 h-10 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Charts */}
            {reportType === 'revenue' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Doanh thu 6 tháng gần đây
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={revenueData}
                                    key="revenue-chart"
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        key="revenue-grid"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        key="revenue-xaxis"
                                    />
                                    <YAxis key="revenue-yaxis" />
                                    <Tooltip
                                        formatter={(value: number) =>
                                            `${(value / 1000000).toFixed(1)}M`
                                        }
                                        key="revenue-tooltip"
                                    />
                                    <Legend key="revenue-legend" />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        name="Doanh thu"
                                        key="revenue-line"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Orders Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Số lượng đơn hàng
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueData} key="orders-chart">
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        key="orders-grid"
                                    />
                                    <XAxis dataKey="month" key="orders-xaxis" />
                                    <YAxis key="orders-yaxis" />
                                    <Tooltip key="orders-tooltip" />
                                    <Legend key="orders-legend" />
                                    <Bar
                                        dataKey="orders"
                                        fill="#f97316"
                                        name="Đơn hàng"
                                        key="orders-bar"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Products Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Sách bán chạy nhất
                            </h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên sách
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
                                {topProducts.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold">
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.sold} cuốn
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.revenue.toLocaleString(
                                                'vi-VN',
                                            )}
                                            đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Inventory Report */}
            {reportType === 'inventory' && (
                <>
                    {/* Inventory by Category Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Tồn kho theo danh mục
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={inventoryByCategory}
                                key="inventory-chart"
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    key="inventory-grid"
                                />
                                <XAxis
                                    dataKey="category"
                                    key="inventory-xaxis"
                                />
                                <YAxis key="inventory-yaxis" />
                                <Tooltip key="inventory-tooltip" />
                                <Legend key="inventory-legend" />
                                <Bar
                                    dataKey="stock"
                                    fill="#f97316"
                                    name="Số lượng"
                                    key="inventory-stock-bar"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Slow Moving Books Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Sách bán chậm
                            </h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên sách
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tồn kho
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lần bán cuối
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số ngày
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {slowMovingBooks.map((book, index) => (
                                    <tr
                                        key={book.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {book.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {book.stock} cuốn
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {book.lastSold}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                            {book.daysSinceLastSale} ngày
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Inventory by Category Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Tồn kho theo danh mục
                            </h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá trị
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventoryByCategory.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.stock} cuốn
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.value.toLocaleString('vi-VN')}
                                            đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Customer Report */}
            {reportType === 'customer' && (
                <>
                    {/* Customer Revenue Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Doanh thu theo phân khúc khách hàng
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={customerStats} key="customer-chart">
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    key="customer-grid"
                                />
                                <XAxis dataKey="segment" key="customer-xaxis" />
                                <YAxis key="customer-yaxis" />
                                <Tooltip
                                    formatter={(value: number) =>
                                        `${(value / 1000000).toFixed(1)}M`
                                    }
                                    key="customer-tooltip"
                                />
                                <Legend key="customer-legend" />
                                <Bar
                                    dataKey="revenue"
                                    fill="#f97316"
                                    name="Doanh thu"
                                    key="customer-revenue-bar"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Customer Statistics Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Thống kê khách hàng
                            </h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phân khúc
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doanh thu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đơn trung bình
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customerStats.map((stat) => (
                                    <tr
                                        key={stat.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {stat.segment}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {stat.count} khách hàng
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {stat.revenue.toLocaleString(
                                                'vi-VN',
                                            )}
                                            đ
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {stat.avgOrder.toLocaleString(
                                                'vi-VN',
                                            )}
                                            đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Debt Report */}
            {reportType === 'debt' && (
                <>
                    {/* Debt Report Header with Date Range Selector */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-gray-800 text-white text-sm font-mono rounded">
                                        BM5.2
                                    </span>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Báo Cáo Công Nợ
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Tháng:
                                    </label>
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) =>
                                            setSelectedMonth(e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <Button
                                    className="bg-orange-500 hover:bg-orange-600"
                                    onClick={() => {
                                        // Placeholder for filtering logic
                                        console.log(
                                            'Filtering for month',
                                            selectedMonth,
                                        );
                                    }}
                                >
                                    Xem báo cáo
                                </Button>
                            </div>
                        </div>

                        {/* Debt Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <p className="text-sm text-blue-700 font-medium">
                                    T���ng nợ đầu kỳ
                                </p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {debtTotals.beginningDebt.toLocaleString(
                                        'vi-VN',
                                    )}
                                    đ
                                </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                                <p className="text-sm text-orange-700 font-medium">
                                    Tổng phát sinh
                                </p>
                                <p className="text-2xl font-bold text-orange-900 mt-1">
                                    {debtTotals.transactions.toLocaleString(
                                        'vi-VN',
                                    )}
                                    đ
                                </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                                <p className="text-sm text-red-700 font-medium">
                                    Tổng nợ cuối kỳ
                                </p>
                                <p className="text-2xl font-bold text-red-900 mt-1">
                                    {debtTotals.endingDebt.toLocaleString(
                                        'vi-VN',
                                    )}
                                    đ
                                </p>
                            </div>
                        </div>

                        {/* Debt Chart */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Biểu đồ tổng công nợ tháng{' '}
                                {formatMonth(selectedMonth)}
                            </h3>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart
                                    data={[
                                        {
                                            category: 'Tổng công nợ',
                                            'Nợ đầu kỳ':
                                                debtTotals.beginningDebt,
                                            'Phát sinh':
                                                debtTotals.transactions,
                                            'Nợ cuối kỳ': debtTotals.endingDebt,
                                        },
                                    ]}
                                    key="debt-summary-chart"
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        key="debt-grid"
                                    />
                                    <XAxis
                                        dataKey="category"
                                        key="debt-xaxis"
                                    />
                                    <YAxis
                                        tickFormatter={(value) =>
                                            `${(value / 1000000).toFixed(0)}M`
                                        }
                                        key="debt-yaxis"
                                    />
                                    <Tooltip
                                        formatter={(value: number) =>
                                            `${value.toLocaleString('vi-VN')}đ`
                                        }
                                        key="debt-tooltip"
                                    />
                                    <Legend key="debt-legend" />
                                    <Bar
                                        dataKey="Nợ đầu kỳ"
                                        fill="#3b82f6"
                                        key="debt-beginning-bar"
                                    />
                                    <Bar
                                        dataKey="Phát sinh"
                                        fill="#f97316"
                                        key="debt-transactions-bar"
                                    />
                                    <Bar
                                        dataKey="Nợ cuối kỳ"
                                        fill="#ef4444"
                                        key="debt-ending-bar"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Debt Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border-2 border-gray-800">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border-2 border-gray-800 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                            STT
                                        </th>
                                        <th className="border-2 border-gray-800 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                            Khách Hàng
                                        </th>
                                        <th className="border-2 border-gray-800 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                            Nợ Đầu
                                        </th>
                                        <th className="border-2 border-gray-800 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                            Phát Sinh
                                        </th>
                                        <th className="border-2 border-gray-800 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                            Nợ Cuối
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {debtData.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border-2 border-gray-800 px-4 py-3 text-center text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="border-2 border-gray-800 px-4 py-3 text-sm font-medium text-gray-900">
                                                {item.customerName}
                                            </td>
                                            <td className="border-2 border-gray-800 px-4 py-3 text-right text-sm text-gray-900">
                                                {item.beginningDebt.toLocaleString(
                                                    'vi-VN',
                                                )}
                                                đ
                                            </td>
                                            <td className="border-2 border-gray-800 px-4 py-3 text-right text-sm text-gray-900">
                                                {item.transactions.toLocaleString(
                                                    'vi-VN',
                                                )}
                                                đ
                                            </td>
                                            <td className="border-2 border-gray-800 px-4 py-3 text-right text-sm font-medium text-red-600">
                                                {item.endingDebt.toLocaleString(
                                                    'vi-VN',
                                                )}
                                                đ
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Total Row */}
                                    <tr className="bg-gray-200 font-bold">
                                        <td
                                            colSpan={2}
                                            className="border-2 border-gray-800 px-4 py-3 text-center text-sm text-gray-900"
                                        >
                                            TỔNG CỘNG
                                        </td>
                                        <td className="border-2 border-gray-800 px-4 py-3 text-right text-sm text-blue-700">
                                            {debtTotals.beginningDebt.toLocaleString(
                                                'vi-VN',
                                            )}
                                            đ
                                        </td>
                                        <td className="border-2 border-gray-800 px-4 py-3 text-right text-sm text-orange-700">
                                            {debtTotals.transactions.toLocaleString(
                                                'vi-VN',
                                            )}
                                            đ
                                        </td>
                                        <td className="border-2 border-gray-800 px-4 py-3 text-right text-sm text-red-700">
                                            {debtTotals.endingDebt.toLocaleString(
                                                'vi-VN',
                                            )}
                                            đ
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
