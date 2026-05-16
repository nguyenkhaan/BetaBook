import { useState, useEffect } from 'react';
import {
    ClipboardList,
    Download,
    TrendingUp,
    TrendingDown,
    Loader2,
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
} from 'recharts';
import {
    ReportService,
    GeneralRevenue,
    ChartData,
    TopBook,
    InventoryByCategory,
    CustomerGrade,
    DebtItem,
    DebtSummary,
} from '../../services/report.service';

const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export function ReportsPage() {
    const [reportType, setReportType] = useState<
        'revenue' | 'inventory' | 'customer' | 'debt'
    >('revenue');
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [isLoading, setIsLoading] = useState(true);

    const [generalRevenue, setGeneralRevenue] = useState<GeneralRevenue | null>(
        null,
    );
    const [revenueChart, setRevenueChart] = useState<ChartData[]>([]);
    const [ordersChart, setOrdersChart] = useState<ChartData[]>([]);
    const [topBooks, setTopBooks] = useState<TopBook[]>([]);
    const [inventoryData, setInventoryData] = useState<InventoryByCategory[]>(
        [],
    );
    const [customerData, setCustomerData] = useState<CustomerGrade[]>([]);
    const [debtList, setDebtList] = useState<DebtItem[]>([]);
    const [debtSum, setDebtSum] = useState<DebtSummary | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [genRev, cust] = await Promise.all([
                    ReportService.getGeneralRevenue(),
                    ReportService.getCustomersByGrade(),
                ]);

                setGeneralRevenue(genRev);
                setCustomerData(cust);

                if (reportType === 'revenue') {
                    const [revChart, ordChart, books] = await Promise.all([
                        ReportService.getRevenueChart(6),
                        ReportService.getOrdersChart(6),
                        ReportService.getTopBooks(),
                    ]);
                    setRevenueChart(revChart);
                    setOrdersChart(ordChart);
                    setTopBooks(books);
                } else if (reportType === 'inventory') {
                    const inv = await ReportService.getInventoryByCategory();
                    setInventoryData(inv);
                } else if (reportType === 'debt') {
                    // BE chưa có API cho phần này theo code bạn đưa, giữ nguyên logic gọi API hiện tại
                    const { list, summary } =
                        await ReportService.getDebtData(selectedMonth);
                    setDebtList(list);
                    setDebtSum(summary);
                }
            } catch (error) {
                console.error('Lỗi lấy dữ liệu báo cáo:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [reportType, selectedMonth]);

    if (isLoading && !generalRevenue) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
            </div>
        );
    }

    const totalCustomers = customerData.reduce(
        (acc, curr) => acc + curr.total,
        0,
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
                <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() =>
                        ReportService.exportReport(reportType, selectedMonth)
                    }
                >
                    <Download className="w-4 h-4 mr-2" />
                    Xuất báo cáo
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex gap-4">
                    {(
                        ['revenue', 'inventory', 'customer', 'debt'] as const
                    ).map((type) => (
                        <Button
                            key={type}
                            variant={
                                reportType === type ? 'default' : 'outline'
                            }
                            onClick={() => setReportType(type)}
                            className={
                                reportType === type
                                    ? 'bg-orange-500 hover:bg-orange-600 text-white border-transparent'
                                    : ''
                            }
                        >
                            {type === 'revenue'
                                ? 'Doanh thu'
                                : type === 'inventory'
                                  ? 'Tồn kho'
                                  : type === 'customer'
                                    ? 'Khách hàng'
                                    : 'Công nợ'}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SummaryCard
                    label="Doanh thu tháng này"
                    value={`${(generalRevenue?.monthRevenue || 0).toLocaleString()}đ`}
                    rate={generalRevenue?.revenueProportionRate || 0}
                    color="text-orange-500"
                />
                <SummaryCard
                    label="Số đơn hàng"
                    value={generalRevenue?.countBills || 0}
                    rate={generalRevenue?.countBillsProportionRate || 0}
                    color="text-blue-500"
                />
                <SummaryCard
                    label="Giá trị đơn TB"
                    value={`${(Number(generalRevenue?.avgBills) || 0).toLocaleString()}đ`}
                    rate={generalRevenue?.avgBillsProportionRate || 0}
                    color="text-green-500"
                />
                <SummaryCard
                    label="Tổng khách hàng"
                    value={totalCustomers.toLocaleString()}
                    rate={0}
                    color="text-purple-500"
                />
            </div>

            {reportType === 'revenue' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-6 text-gray-800">
                                Doanh thu 6 tháng gần đây
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueChart}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e5e7eb"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dx={-10}
                                        tickFormatter={(value) =>
                                            `${value.toLocaleString()}`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(v: number) => [
                                            `${v.toLocaleString()}đ`,
                                            'Doanh thu',
                                        ]}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#f97316"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                        name="Doanh thu"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-6 text-gray-800">
                                Số lượng đơn hàng 6 tháng gần đây
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ordersChart}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#e5e7eb"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#3b82f6"
                                        name="Đơn hàng"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Top 5 sách bán chạy nhất
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                                            Hạng
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Mã sách
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Tên sách
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Số lượng đã bán
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {topBooks.map((book, index) => (
                                        <tr
                                            key={book.id}
                                            className="hover:bg-orange-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm
                                                    ${
                                                        index === 0
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : index === 1
                                                              ? 'bg-gray-200 text-gray-700'
                                                              : index === 2
                                                                ? 'bg-orange-100 text-orange-800'
                                                                : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    #{index + 1}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                                {book.code}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">
                                                    {book.title}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-orange-600">
                                                {book.sum.toLocaleString()} cuốn
                                            </td>
                                        </tr>
                                    ))}
                                    {topBooks.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Chưa có dữ liệu sách bán chạy
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {reportType === 'inventory' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-6 text-gray-800">
                            Giá trị tồn kho theo danh mục
                        </h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart
                                data={inventoryData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dx={-10}
                                    tickFormatter={(value) =>
                                        `${(value / 1000000).toFixed(0)}M`
                                    }
                                />
                                <Tooltip
                                    formatter={(v: number) => [
                                        `${v.toLocaleString()}đ`,
                                        'Tổng giá trị',
                                    ]}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow:
                                            '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                />
                                <Bar
                                    dataKey="totalValue"
                                    fill="#f97316"
                                    name="Giá trị"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Danh mục (Thể loại)
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Số lượng đầu sách
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Tổng giá trị tồn kho
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {inventoryData.map((item, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {item.category}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">
                                                {item.count.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-right text-orange-600">
                                                {item.totalValue.toLocaleString()}
                                                đ
                                            </td>
                                        </tr>
                                    ))}
                                    {inventoryData.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Chưa có dữ liệu tồn kho
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {reportType === 'customer' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800">
                        Phân loại khách hàng theo hạng thành viên
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={customerData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e5e7eb"
                            />
                            <XAxis
                                dataKey="grade"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: '#6b7280',
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                dx={-10}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow:
                                        '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                }}
                            />
                            <Bar
                                dataKey="total"
                                fill="#8b5cf6"
                                name="Số lượng khách hàng"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={80}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {reportType === 'debt' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b pb-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-900 text-white text-xs font-mono rounded-md shadow-sm">
                                BM5.2
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">
                                Báo Cáo Công Nợ
                            </h2>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                            <label className="text-sm font-semibold text-gray-700">
                                Tháng báo cáo:
                            </label>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-orange-600 outline-none cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <DebtSummaryCard
                            label="Nợ đầu kỳ"
                            value={debtSum?.totalBeginningDebt || 0}
                            border="border-blue-500"
                            bg="bg-blue-50"
                            text="text-blue-700"
                        />
                        <DebtSummaryCard
                            label="Tổng phát sinh"
                            value={debtSum?.totalTransactions || 0}
                            border="border-orange-500"
                            bg="bg-orange-50"
                            text="text-orange-700"
                        />
                        <DebtSummaryCard
                            label="Nợ cuối kỳ"
                            value={debtSum?.totalEndingDebt || 0}
                            border="border-red-500"
                            bg="bg-red-50"
                            text="text-red-700"
                        />
                    </div>

                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-16">
                                            STT
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">
                                            Khách Hàng
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                            Nợ Đầu Kỳ
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                            Phát Sinh
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                            Nợ Cuối Kỳ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {debtList.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {item.customerName}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                {item.beginningDebt.toLocaleString()}
                                                đ
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-orange-600 font-medium">
                                                +
                                                {item.transactions.toLocaleString()}
                                                đ
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                                                {item.endingDebt.toLocaleString()}
                                                đ
                                            </td>
                                        </tr>
                                    ))}
                                    {debtList.length > 0 ? (
                                        <tr className="bg-gray-50/80 border-t-2 border-gray-200">
                                            <td
                                                colSpan={2}
                                                className="px-6 py-4 text-center font-bold text-gray-900 uppercase text-sm tracking-wider"
                                            >
                                                Tổng Cộng Lũy Kế
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                {debtSum?.totalBeginningDebt.toLocaleString()}
                                                đ
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-orange-600">
                                                +
                                                {debtSum?.totalTransactions.toLocaleString()}
                                                đ
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-red-600 text-lg">
                                                {debtSum?.totalEndingDebt.toLocaleString()}
                                                đ
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Không có dữ liệu công nợ trong
                                                tháng này
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ label, value, rate, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <div className="flex items-center gap-1.5 mt-3">
                        <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${rate >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                            {rate >= 0 ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            <span>{rate > 0 ? `+${rate}` : rate}%</span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                            so với tháng trước
                        </span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>
                    <ClipboardList className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

function DebtSummaryCard({ label, value, border, bg, text }: any) {
    return (
        <div className={`${bg} p-6 rounded-xl border-l-4 ${border} shadow-sm`}>
            <p className={`text-sm font-semibold opacity-80 mb-2`}>{label}</p>
            <p className={`text-2xl font-bold truncate ${text}`}>
                {value.toLocaleString()}đ
            </p>
        </div>
    );
}
