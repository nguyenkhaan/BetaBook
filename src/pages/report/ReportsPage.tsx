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
                const [genRev, revChart, ordChart, cust] = await Promise.all([
                    ReportService.getGeneralRevenue(),
                    ReportService.getRevenueChart(6),
                    ReportService.getOrdersChart(6),
                    ReportService.getCustomersByGrade(),
                ]);

                setGeneralRevenue(genRev);
                setRevenueChart(revChart);
                setOrdersChart(ordChart);
                setCustomerData(cust);

                if (reportType === 'revenue') {
                    const books = await ReportService.getTopBooks();
                    setTopBooks(books);
                } else if (reportType === 'inventory') {
                    const inv = await ReportService.getInventoryByCategory();
                    setInventoryData(inv);
                } else if (reportType === 'debt') {
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
                                    ? 'bg-orange-500 hover:bg-orange-600'
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
                    label="Đơn hàng"
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
                    label="Tỷ lệ khách hàng"
                    value={customerData.reduce(
                        (acc, curr) => acc + curr.total,
                        0,
                    )}
                    rate={0}
                    color="text-purple-500"
                />
            </div>

            {reportType === 'revenue' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">
                                Doanh thu 6 tháng gần đây
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueChart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(v: number) =>
                                            v.toLocaleString() + 'đ'
                                        }
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        name="Doanh thu"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">
                                Số lượng đơn hàng
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ordersChart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="revenue"
                                        fill="#3b82f6"
                                        name="Đơn hàng"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold">
                                Sách bán chạy nhất
                            </h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tên sách
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Đã bán
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {topBooks.map((book, index) => (
                                    <tr
                                        key={book.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold">
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {book.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {book.sum} cuốn
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {reportType === 'inventory' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">
                            Giá trị tồn kho theo danh mục
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={inventoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip
                                    formatter={(v: number) =>
                                        v.toLocaleString() + 'đ'
                                    }
                                />
                                <Bar
                                    dataKey="totalValue"
                                    fill="#f97316"
                                    name="Giá trị"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Danh mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Số lượng loại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tổng giá trị
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {inventoryData.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.count} loại
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {item.totalValue.toLocaleString()}đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {reportType === 'customer' && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">
                        Phân loại khách hàng theo hạng
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={customerData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="grade" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="total"
                                fill="#8b5cf6"
                                name="Số lượng"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {reportType === 'debt' && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-gray-800 text-white text-sm font-mono rounded">
                                BM5.2
                            </span>
                            <h2 className="text-xl font-bold">
                                Báo Cáo Công Nợ
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">
                                Tháng:
                            </label>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <DebtSummaryCard
                            label="Nợ đầu kỳ"
                            value={debtSum?.totalBeginningDebt || 0}
                            border="border-blue-500"
                            bg="bg-blue-50"
                            text="text-blue-900"
                        />
                        <DebtSummaryCard
                            label="Tổng phát sinh"
                            value={debtSum?.totalTransactions || 0}
                            border="border-orange-500"
                            bg="bg-orange-50"
                            text="text-orange-900"
                        />
                        <DebtSummaryCard
                            label="Nợ cuối kỳ"
                            value={debtSum?.totalEndingDebt || 0}
                            border="border-red-500"
                            bg="bg-red-50"
                            text="text-red-900"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-gray-800">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border-2 border-gray-800 px-4 py-3 text-sm font-bold">
                                        STT
                                    </th>
                                    <th className="border-2 border-gray-800 px-4 py-3 text-sm font-bold text-left">
                                        Khách Hàng
                                    </th>
                                    <th className="border-2 border-gray-800 px-4 py-3 text-sm font-bold text-right">
                                        Nợ Đầu
                                    </th>
                                    <th className="border-2 border-gray-800 px-4 py-3 text-sm font-bold text-right">
                                        Phát Sinh
                                    </th>
                                    <th className="border-2 border-gray-800 px-4 py-3 text-sm font-bold text-right">
                                        Nợ Cuối
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {debtList.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="border-2 border-gray-800 px-4 py-3 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="border-2 border-gray-800 px-4 py-3 font-medium">
                                            {item.customerName}
                                        </td>
                                        <td className="border-2 border-gray-800 px-4 py-3 text-right">
                                            {item.beginningDebt.toLocaleString()}
                                            đ
                                        </td>
                                        <td className="border-2 border-gray-800 px-4 py-3 text-right">
                                            {item.transactions.toLocaleString()}
                                            đ
                                        </td>
                                        <td className="border-2 border-gray-800 px-4 py-3 text-right font-bold text-red-600">
                                            {item.endingDebt.toLocaleString()}đ
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-200 font-bold">
                                    <td
                                        colSpan={2}
                                        className="border-2 border-gray-800 px-4 py-3 text-center"
                                    >
                                        TỔNG CỘNG
                                    </td>
                                    <td className="border-2 border-gray-800 px-4 py-3 text-right">
                                        {debtSum?.totalBeginningDebt.toLocaleString()}
                                        đ
                                    </td>
                                    <td className="border-2 border-gray-800 px-4 py-3 text-right">
                                        {debtSum?.totalTransactions.toLocaleString()}
                                        đ
                                    </td>
                                    <td className="border-2 border-gray-800 px-4 py-3 text-right text-red-700">
                                        {debtSum?.totalEndingDebt.toLocaleString()}
                                        đ
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ label, value, rate, color }: any) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                        {rate >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                            className={`text-sm ${rate >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {rate > 0 ? `+${rate}` : rate}%
                        </span>
                    </div>
                </div>
                <ClipboardList className={`w-10 h-10 ${color}`} />
            </div>
        </div>
    );
}

function DebtSummaryCard({ label, value, border, bg, text }: any) {
    return (
        <div className={`${bg} p-4 rounded-lg border-l-4 ${border}`}>
            <p className={`text-sm font-medium opacity-80`}>{label}</p>
            <p className={`text-2xl font-bold mt-1 ${text}`}>
                {value.toLocaleString()}đ
            </p>
        </div>
    );
}
