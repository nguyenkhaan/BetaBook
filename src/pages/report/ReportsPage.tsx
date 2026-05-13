import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Download, Loader2, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    ChartData,
    DebtItem,
    GeneralRevenue,
    InventoryByCategory,
    ReportService,
    TopBook,
    TopCustomerItem,
} from '../../services/report.service';

const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const formatCurrency = (value: number) => `${(Number(value) || 0).toLocaleString('vi-VN')}đ`;

const formatMonthLabel = (month: string) => {
    if (!month?.includes('-')) return month;
    const [year, mm] = month.split('-');
    return `${mm}/${year}`;
};

type ReportTab = 'revenue' | 'inventory' | 'customer' | 'debt';

export function ReportsPage() {
    const [reportType, setReportType] = useState<ReportTab>('revenue');
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

    const [summaryLoading, setSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [generalRevenue, setGeneralRevenue] = useState<GeneralRevenue | null>(null);

    const [sectionLoading, setSectionLoading] = useState(false);
    const [sectionError, setSectionError] = useState<string | null>(null);

    const [revenueChart, setRevenueChart] = useState<ChartData[]>([]);
    const [topBooks, setTopBooks] = useState<TopBook[]>([]);
    const [inventoryData, setInventoryData] = useState<InventoryByCategory[]>([]);
    const [topCustomers, setTopCustomers] = useState<TopCustomerItem[]>([]);
    const [debtList, setDebtList] = useState<DebtItem[]>([]);

    useEffect(() => {
        const fetchSummary = async () => {
            setSummaryLoading(true);
            setSummaryError(null);
            try {
                const data = await ReportService.getGeneralRevenue();
                setGeneralRevenue(data);
            } catch (error) {
                console.error(error);
                setSummaryError('Không thể tải dữ liệu tổng quan');
            } finally {
                setSummaryLoading(false);
            }
        };
        void fetchSummary();
    }, []);

    useEffect(() => {
        const fetchSection = async () => {
            setSectionLoading(true);
            setSectionError(null);
            try {
                if (reportType === 'revenue') {
                    const [chart, books] = await Promise.all([
                        ReportService.getRevenueChart(6),
                        ReportService.getTopBooks(),
                    ]);
                    setRevenueChart(chart);
                    setTopBooks(books);
                    return;
                }

                if (reportType === 'inventory') {
                    const inv = await ReportService.getInventoryByCategory();
                    setInventoryData(inv);
                    return;
                }

                if (reportType === 'customer') {
                    const customers = await ReportService.getTopCustomers(10);
                    const sorted = [...customers].sort((a, b) => b.totalPaid - a.totalPaid);
                    setTopCustomers(sorted);
                    return;
                }

                const debt = await ReportService.getCustomerDebit();
                setDebtList(debt);
            } catch (error) {
                console.error(error);
                setSectionError('Không thể tải dữ liệu báo cáo');
            } finally {
                setSectionLoading(false);
            }
        };

        void fetchSection();
    }, [reportType]);

    const filteredDebtByMonth = useMemo(
        () => debtList.filter((item) => item.date === selectedMonth),
        [debtList, selectedMonth],
    );

    const debtSummary = useMemo(() => {
        return filteredDebtByMonth.reduce(
            (acc, item) => {
                acc.totalBeginningDebt += Number(item.openingDebt || 0);
                acc.totalTransactions += Number(item.generatedDebt || 0);
                acc.totalEndingDebt += Number(item.closingDebt || 0);
                return acc;
            },
            {
                totalBeginningDebt: 0,
                totalTransactions: 0,
                totalEndingDebt: 0,
            },
        );
    }, [filteredDebtByMonth]);

    if (summaryLoading && !generalRevenue) {
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
                    <h1 className="text-2xl font-bold text-gray-900">Báo cáo thống kê</h1>
                    <p className="text-gray-600 mt-1">Xem các báo cáo và thống kê của Beta Book</p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => ReportService.exportReport(reportType, selectedMonth)}
                >
                    <Download className="w-4 h-4 mr-2" />
                    Xuất báo cáo
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex gap-4 flex-wrap">
                    {['revenue', 'inventory', 'customer', 'debt'].map((type) => (
                        <Button
                            key={type}
                            variant={reportType === type ? 'default' : 'outline'}
                            onClick={() => setReportType(type as ReportTab)}
                            className={reportType === type ? 'bg-orange-500 hover:bg-orange-600' : ''}
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

            {summaryError ? (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{summaryError}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SummaryCard
                        label="Doanh thu tháng này"
                        value={formatCurrency(generalRevenue?.monthRevenue || 0)}
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
                        value={formatCurrency(Number(generalRevenue?.avgBills) || 0)}
                        rate={generalRevenue?.avgBillsProportionRate || 0}
                        color="text-green-500"
                    />
                    <SummaryCard label="Tỷ lệ hoàn trả" value="N/A" rate={0} color="text-red-500" />
                </div>
            )}

            {sectionLoading && (
                <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tải dữ liệu...
                </div>
            )}
            {sectionError && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{sectionError}</div>}

            {reportType === 'revenue' && !sectionLoading && !sectionError && (
                <>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
                        {revenueChart.length === 0 ? (
                            <div className="text-gray-500">Không có dữ liệu doanh thu</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueChart.map((item) => ({ ...item, month: formatMonthLabel(item.month) }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#f97316" name="Doanh thu" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold">Sách bán chạy nhất</h3>
                        </div>
                        {topBooks.length === 0 ? (
                            <div className="px-6 py-8 text-gray-500">Không có dữ liệu</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px]">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sách</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đã bán</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {topBooks.map((book, index) => (
                                            <tr key={book.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">{index + 1}</td>
                                                <td className="px-6 py-4 font-medium">{book.title}</td>
                                                <td className="px-6 py-4">{book.sum} cuốn</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {reportType === 'inventory' && !sectionLoading && !sectionError && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold">Tồn kho theo danh mục</h3>
                    </div>
                    {inventoryData.length === 0 ? (
                        <div className="px-6 py-8 text-gray-500">Không có dữ liệu tồn kho</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng loại</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng giá trị</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {inventoryData.map((item, i) => (
                                        <tr key={`${item.category}-${i}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{item.category}</td>
                                            <td className="px-6 py-4">{item.count}</td>
                                            <td className="px-6 py-4 font-bold">{formatCurrency(item.totalValue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {reportType === 'customer' && !sectionLoading && !sectionError && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold">Top khách hàng</h3>
                    </div>
                    {topCustomers.length === 0 ? (
                        <div className="px-6 py-8 text-gray-500">Không có dữ liệu khách hàng</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px]">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạng</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng đã thanh toán</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {topCustomers.map((customer, index) => (
                                        <tr key={customer.customerId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{customer.customerName}</div>
                                                <div className="text-xs text-gray-500">{customer.customerCode}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {customer.phone || customer.email
                                                    ? `${customer.phone ?? ''}${customer.phone && customer.email ? ' | ' : ''}${customer.email ?? ''}`
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-semibold">{formatCurrency(customer.totalPaid)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {reportType === 'debt' && !sectionLoading && !sectionError && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                        <h2 className="text-xl font-bold">Báo Cáo Công Nợ</h2>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Tháng:</label>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <DebtSummaryCard
                            label="Nợ đầu kỳ"
                            value={debtSummary.totalBeginningDebt}
                            border="border-blue-500"
                            bg="bg-blue-50"
                            text="text-blue-900"
                        />
                        <DebtSummaryCard
                            label="Phát sinh nợ"
                            value={debtSummary.totalTransactions}
                            border="border-orange-500"
                            bg="bg-orange-50"
                            text="text-orange-900"
                        />
                        <DebtSummaryCard
                            label="Nợ cuối kỳ"
                            value={debtSummary.totalEndingDebt}
                            border="border-red-500"
                            bg="bg-red-50"
                            text="text-red-900"
                        />
                    </div>

                    {filteredDebtByMonth.length === 0 ? (
                        <div className="text-gray-500">Không có dữ liệu công nợ cho tháng đã chọn</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[960px] border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border px-4 py-3 text-sm font-bold text-left">Date</th>
                                        <th className="border px-4 py-3 text-sm font-bold text-left">Customer</th>
                                        <th className="border px-4 py-3 text-sm font-bold text-right">Opening Debt</th>
                                        <th className="border px-4 py-3 text-sm font-bold text-right">Generated Debt</th>
                                        <th className="border px-4 py-3 text-sm font-bold text-right">Closing Debt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDebtByMonth.map((item) => (
                                        <tr key={`${item.date}-${item.customer.id}`} className="hover:bg-gray-50">
                                            <td className="border px-4 py-3">{formatMonthLabel(item.date)}</td>
                                            <td className="border px-4 py-3 font-medium">{item.customer.name}</td>
                                            <td className="border px-4 py-3 text-right">{formatCurrency(item.openingDebt)}</td>
                                            <td className="border px-4 py-3 text-right">{formatCurrency(item.generatedDebt)}</td>
                                            <td className="border px-4 py-3 text-right font-bold text-red-600">{formatCurrency(item.closingDebt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    <div className="flex items-center gap-1 mt-2">
                        {rate >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${text}`}>{formatCurrency(value)}</p>
        </div>
    );
}
