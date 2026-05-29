import { useState, useEffect } from 'react';
import {
    ClipboardList,
    Download,
    TrendingUp,
    TrendingDown,
    Loader2,
    Filter,
    X,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';
import {
    ReportService,
    GeneralRevenue,
    RevenueChartData,
    ChartData,
    TopBook,
    InventoryByCategory,
    InventoryFlowData,
    CustomerGrade,
    DebtItem,
    DebtSummary,
} from '../../services/report.service';
import { toast } from 'sonner';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const BookCategoryLabel: Record<string, string> = {
    VAN_HOC: 'Văn học',
    TRINH_THAM: 'Trinh thám',
    THIEU_NHI: 'Thiếu nhi',
    GIAO_DUC: 'Giáo dục',
    KINH_TE: 'Kinh tế',
    KY_NANG_SONG: 'Kỹ năng sống',
};

export const CustomerGradeLabel: Record<string, string> = {
    BRONZE: 'Đồng',
    SILVER: 'Bạc',
    GOLD: 'Vàng',
    PLATINUM: 'Bạch Kim',
    DIAMOND: 'Kim cương',
};

const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getInitialDates = () => {
    const now = new Date();
    const end = now.toISOString().split('T')[0];

    const startMonth = new Date();
    startMonth.setMonth(startMonth.getMonth() - 5);
    startMonth.setDate(1);
    const start = startMonth.toISOString().split('T')[0];

    return { start, end };
};

const getAvailableMonths = (allRows: { date: string }[]): string[] => {
    const dates = allRows.map((r) => r.date).sort();
    if (dates.length === 0) return [getCurrentMonth()];
    const [startYear, startMonth] = dates[0].split('-').map(Number);
    const now = new Date();
    const endYear = now.getFullYear();
    const endMonth = now.getMonth() + 1;
    const months: string[] = [];
    let y = startYear;
    let m = startMonth;
    while (y < endYear || (y === endYear && m <= endMonth)) {
        months.push(`${y}-${String(m).padStart(2, '0')}`);
        m++;
        if (m > 12) {
            m = 1;
            y++;
        }
    }
    return months;
};

type ReportType = 'revenue' | 'inventory' | 'customer' | 'debt';

const REPORT_TABS: { key: ReportType; label: string , reportLabel : string }[] = [
    { key: 'revenue', label: 'Doanh thu', reportLabel: 'Revenue' },
    { key: 'inventory', label: 'Tồn kho' , reportLabel: 'Warehouse'},
    { key: 'customer', label: 'Khách hàng', reportLabel: 'Customer' },
    { key: 'debt', label: 'Công nợ' , reportLabel: 'Debit' },
];

const formatVND = (v: number): string => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}tỷ`;
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}tr`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
    return v.toString();
};

export function ReportsPage() {
    const [reportType, setReportType] = useState<ReportType>('revenue');
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [isLoading, setIsLoading] = useState(true);

    const { start, end } = getInitialDates();
    const [startDate, setStartDate] = useState<string>(start);
    const [endDate, setEndDate] = useState<string>(end);

    const [generalRevenue, setGeneralRevenue] = useState<GeneralRevenue | null>(
        null,
    );
    const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
    const [ordersChart, setOrdersChart] = useState<ChartData[]>([]);
    const [topBooks, setTopBooks] = useState<TopBook[]>([]);
    const [inventoryData, setInventoryData] = useState<InventoryByCategory[]>(
        [],
    );
    const [inventoryFlow, setInventoryFlow] = useState<InventoryFlowData[]>([]);
    const [customerData, setCustomerData] = useState<CustomerGrade[]>([]);
    const [debtList, setDebtList] = useState<DebtItem[]>([]);
    const [debtSum, setDebtSum] = useState<DebtSummary | null>(null);
    const [allDebtRows, setAllDebtRows] = useState<
        {
            date: string;
            customer: { id: number; name: string };
            openingDebt: number;
            generatedDebt: number;
            closingDebt: number;
        }[]
    >([]);

    useEffect(() => {
        if (reportType !== 'debt') return;
        const filtered = allDebtRows.filter((r) => r.date === selectedMonth);
        const list: DebtItem[] = filtered.map((row) => ({
            id: row.customer.id,
            customerName: row.customer.name,
            beginningDebt: Number(row.openingDebt) || 0,
            transactions: Number(row.generatedDebt) || 0,
            endingDebt: Number(row.closingDebt) || 0,
        }));
        setDebtList(list);
        setDebtSum({
            totalBeginningDebt: list.reduce((s, r) => s + r.beginningDebt, 0),
            totalTransactions: list.reduce((s, r) => s + r.transactions, 0),
            totalEndingDebt: list.reduce((s, r) => s + r.endingDebt, 0),
        });
    }, [selectedMonth, allDebtRows, reportType]);

    const loadReportData = async () => {
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            toast.error('Ngày bắt đầu không được lớn hơn ngày kết thúc');
            return;
        }

        setIsLoading(true);
        try {
            const params = {
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            };

            const [genRev, cust] = await Promise.all([
                ReportService.getGeneralRevenue(),
                ReportService.getCustomersByGrade(),
            ]);
            setGeneralRevenue(genRev);
            setCustomerData(cust);
            const mappedCustomerData = cust.map((c) => ({
                ...c,
                grade: CustomerGradeLabel[c.grade] || c.grade, 
                originalGrade : c.grade
            }));
            setCustomerData(mappedCustomerData);

            if (reportType === 'revenue') {
                const [revChart, ordChart, books] = await Promise.all([
                    ReportService.getRevenueChart(6),
                    ReportService.getOrdersChart(6),
                    ReportService.getTopBooks(5),
                ]);
                setRevenueChart(revChart);
                setOrdersChart(ordChart);
                setTopBooks(books);
            } else if (reportType === 'inventory') {
                const [inv, flow] = await Promise.all([
                    ReportService.getInventoryByCategory(),
                    ReportService.getInventoryFlow(6, ),
                ]);
                const mappedInventory = inv.map((item) => ({
                    ...item,
                    categoryName:
                        BookCategoryLabel[item.categoryName] ||
                        item.categoryName,
                        originalName : item.categoryName
                }));


                setInventoryData(mappedInventory);
                setInventoryFlow(flow);
            } else if (reportType === 'debt') {
                const rawRows = await ReportService.getRawDebt();
                setAllDebtRows(rawRows);

                if (endDate) {
                    setSelectedMonth(endDate.substring(0, 7));
                }
            }
        } catch (error) {
            console.error('Lỗi lấy dữ liệu báo cáo:', error);
            if (reportType === 'debt') {
                setDebtList([]);
                setDebtSum(null);
            }
            toast.error('Có lỗi xảy ra khi tải dữ liệu báo cáo từ server');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReportData();
    }, [reportType]);

    const handleClearFilter = () => {
        const defaultDates = getInitialDates();
        setStartDate(defaultDates.start);
        setEndDate(defaultDates.end);
        setTimeout(() => loadReportData(), 0);
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
            });

            // Tiêu đề tài liệu và thông tin chu kỳ chung
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(20);
            doc.text('UTAHIME BOOK - REPORT SYSTEM', 14, 20);

            doc.setFontSize(14);
            let activeTabLabel =
                REPORT_TABS.find((t) => t.key === reportType)?.reportLabel || '';
            doc.text(
                `Report Statistic: ${activeTabLabel.toUpperCase()}`,
                14,
                30,
            );

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(10); 
            doc.text(
                `Reporting Period: from ${startDate || 'start'} to ${endDate || 'current'}`,
                14,
                38,
            );
            doc.text(
                `Publication Date: ${new Date().toLocaleDateString('vi-VN')}`,
                14,
                44,
            );
            doc.line(14, 48, 196, 48); 

            if (reportType === 'revenue') {
                doc.setFont('Helvetica', 'bold');
                doc.text('1. Top 5 Best-Selling Books', 14, 56);

                const headers = [
                    ['Grade', 'Book Code', 'Name', 'Quantity sold'],
                ];
                const body = topBooks.map((b, i) => [
                    `#${i + 1}`,
                    b.bookCode,
                    b.title,
                    `${b.totalSold.toLocaleString('vi-VN')}`,
                ]);

                autoTable(doc, {
                    head: headers,
                    body: body,
                    startY: 60,
                    theme: 'striped',
                    styles: { font: 'Helvetica' },
                    headStyles: { fillColor: [249, 115, 22] }, 
                });

             
                const lastY = (doc as any).lastAutoTable.finalY || 60;
                doc.text('2. Monthly Revenue & Debt Report', 14, lastY + 15);

                const revHeaders = [
                    ['Month', 'Actual Revenue (VND)', 'Incurred Debt (VND)'],
                ];
                const revBody = revenueChart.map((r) => [
                    r.month,
                    `${r.actualReceived.toLocaleString('vi-VN')}d`,
                    `${r.debtAdded.toLocaleString('vi-VN')}d`,
                ]);

                autoTable(doc, {
                    head: revHeaders,
                    body: revBody,
                    startY: lastY + 20,
                    theme: 'grid',
                    styles: { font: 'Helvetica' },
                });
            } else if (reportType === 'inventory') {
                // 2. Báo cáo tồn kho
                doc.setFont('Helvetica', 'bold');
                doc.text('Inventory list by category', 14, 56);

                const headers = [
                    ['Index', 'Category name', 'Inventory Quantity'],
                ];
                const body = inventoryData.map((item, i) => [
                    i + 1,
                    item.originalName,
                    `${item.value.toLocaleString('vi-VN')}`,
                ]);

                autoTable(doc, {
                    head: headers,
                    body: body,
                    startY: 60,
                    theme: 'striped',
                    styles: { font: 'Helvetica' },
                    headStyles: { fillColor: [16, 185, 129] }, // Xanh lục cho kho hàng
                });
            } else if (reportType === 'customer') {
                // 3. Báo cáo khách hàng
                doc.setFont('Helvetica', 'bold');
                doc.text('Customer Grade Member Statistic', 14, 56);

                const headers = [
                    ['Index', 'Member Grade', 'Quantity'],
                ];
                const body = customerData.map((c, i) => [
                    i + 1,
                    c.originalGrade || c.grade, 
                    `${c.total.toLocaleString('vi-VN')} customer`,
                ]);

                autoTable(doc, {
                    head: headers,
                    body: body,
                    startY: 60,
                    theme: 'striped',
                    styles: { font: 'Helvetica' },
                    headStyles: { fillColor: [139, 92, 246] }, // Màu tím
                });
            } else if (reportType === 'debt') {
                // 4. Báo cáo công nợ (Mẫu chuẩn BM5.2)
                doc.setFont('Helvetica', 'bold');
                doc.text(`Debt Report - Month ${selectedMonth}`, 14, 56);

                const headers = [
                    [
                        'STT',
                        'Customer',
                        'Opening Debt',
                        'New Debt',
                        'Closing Debt',
                    ],
                ];
                const body = debtList.map((item, index) => [
                    index + 1,
                    item.customerName,
                    `${item.beginningDebt.toLocaleString('vi-VN')}d`,
                    `+${item.transactions.toLocaleString('vi-VN')}d`,
                    `${item.endingDebt.toLocaleString('vi-VN')}d`,
                ]);

                if (debtList.length > 0 && debtSum) {
                    body.push([
                        '',
                        'Total',
                        `${debtSum.totalBeginningDebt.toLocaleString('vi-VN')}d`,
                        `+${debtSum.totalTransactions.toLocaleString('vi-VN')}d`,
                        `${debtSum.totalEndingDebt.toLocaleString('vi-VN')}d`,
                    ]);
                }

                autoTable(doc, {
                    head: headers,
                    body: body,
                    startY: 60,
                    theme: 'grid',
                    styles: { font: 'Helvetica' },
                    headStyles: { fillColor: [220, 38, 38] }, 
                    didParseCell: (data) => {
                        if (data.row.index === body.length - 1) {
                            data.cell.styles.fontStyle = 'bold';
                        }
                    },
                });
            }
            doc.save(
                `UtahimeBook_BaoCao_${reportType}_${new Date().getTime()}.pdf`,
            );
            toast.success('Xuất file PDF báo cáo thành công!');
        } catch (err) {
            console.error('Lỗi sinh file PDF:', err);
            toast.error(
                'Không thể xuất file PDF, vui lòng kiểm tra lại cấu trúc dữ liệu.',
            );
        }
    };

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
    const availableDebtMonths = getAvailableMonths(allDebtRows);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Báo cáo thống kê
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Xem các báo cáo và thống kê của Utahime Book
                    </p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleExportPDF}
                >
                    <Download className="w-4 h-4 mr-2" />
                    Xuất báo cáo PDF
                </Button>
            </div>

            {/* Điều hướng Tabs và Bộ lọc thời gian tiến hóa */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center border border-gray-100">
                <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
                    {REPORT_TABS.map(({ key, label }) => (
                        <Button
                            key={key}
                            variant={reportType === key ? 'default' : 'outline'}
                            onClick={() => setReportType(key)}
                            className={
                                reportType === key
                                    ? 'bg-orange-500 hover:bg-orange-600 text-white border-transparent'
                                    : ''
                            }
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                {/* Giao diện bộ lọc thời gian áp dụng cho toàn bộ các mục thống kê */}
                <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap sm:flex-nowrap justify-end">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                            Từ:
                        </span>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                            Đến:
                        </span>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={loadReportData}
                        className="bg-gray-950 hover:bg-gray-800 text-white text-sm"
                    >
                        <Filter className="w-4 h-4 mr-1.5" />
                        Lọc báo cáo
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleClearFilter}
                        className="text-gray-500 hover:text-gray-700 px-2"
                        title="Đặt lại mặc định"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SummaryCard
                    label="Doanh thu kỳ này"
                    value={`${(generalRevenue?.monthRevenue || 0).toLocaleString('vi-VN')}đ`}
                    rate={generalRevenue?.revenueProportionRate || 0}
                    color="text-orange-500"
                />
                <SummaryCard
                    label="Số đơn hàng"
                    value={(generalRevenue?.countBills || 0).toLocaleString(
                        'vi-VN',
                    )}
                    rate={generalRevenue?.countBillsProportionRate || 0}
                    color="text-blue-500"
                />
                <SummaryCard
                    label="Giá trị đơn TB"
                    value={`${(Number(generalRevenue?.avgBills) || 0).toLocaleString('vi-VN')}đ`}
                    rate={generalRevenue?.avgBillsProportionRate || 0}
                    color="text-green-500"
                />
                <SummaryCard
                    label="Tổng khách hàng"
                    value={totalCustomers.toLocaleString('vi-VN')}
                    rate={0}
                    color="text-purple-500"
                />
            </div>

            {/* ── REVENUE TAB ── */}
            {reportType === 'revenue' && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue + Debt stacked bar */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-6 text-gray-800">
                                Doanh thu & Công nợ trong chu kỳ chọn
                            </h3>
                            {revenueChart.length === 0 ? (
                                <EmptyChart />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={revenueChart}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#e5e7eb"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#6b7280',
                                                fontSize: 12,
                                            }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#6b7280',
                                                fontSize: 12,
                                            }}
                                            dx={-10}
                                            tickFormatter={formatVND}
                                        />
                                        <Tooltip
                                            formatter={(
                                                v: number,
                                                name: string,
                                            ) => [
                                                `${v.toLocaleString('vi-VN')}đ`,
                                                name,
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
                                            wrapperStyle={{
                                                paddingTop: '20px',
                                            }}
                                        />
                                        <Bar
                                            dataKey="actualReceived"
                                            stackId="a"
                                            fill="#f97316"
                                            name="Đã thu"
                                            radius={[0, 0, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="debtAdded"
                                            stackId="a"
                                            fill="#fcd34d"
                                            name="Công nợ phát sinh"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Orders bar chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold mb-6 text-gray-800">
                                Số lượng đơn hàng trong chu kỳ chọn
                            </h3>
                            {ordersChart.length === 0 ? (
                                <EmptyChart />
                            ) : (
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
                                            tick={{
                                                fill: '#6b7280',
                                                fontSize: 12,
                                            }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#6b7280',
                                                fontSize: 12,
                                            }}
                                            dx={-10}
                                            allowDecimals={false}
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
                                            wrapperStyle={{
                                                paddingTop: '20px',
                                            }}
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
                            )}
                        </div>
                    </div>

                    {/* Top books table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Top 5 sách bán chạy nhất kỳ này
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
                                            key={book.bookId}
                                            className="hover:bg-orange-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
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
                                                {book.bookCode}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {book.title}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-orange-600">
                                                {book.totalSold.toLocaleString(
                                                    'vi-VN',
                                                )}{' '}
                                                cuốn
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
                                                trong khoảng thời gian này
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ── INVENTORY TAB ── */}
            {reportType === 'inventory' && (
                <div className="space-y-6">
                    {/* Inventory flow */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-6 text-gray-800">
                            Biến động nhập / xuất kho kỳ này
                        </h3>
                        {inventoryFlow.length === 0 ? (
                            <EmptyChart />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={inventoryFlow}>
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
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        formatter={(
                                            v: number,
                                            name: string,
                                        ) => [
                                            `${v.toLocaleString('vi-VN')} cuốn`,
                                            name,
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
                                        dataKey="importQuantity"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        dot={{ r: 4 }}
                                        name="Nhập kho"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="exportQuantity"
                                        stroke="#f97316"
                                        strokeWidth={2.5}
                                        dot={{ r: 4 }}
                                        name="Xuất kho (bán)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Stock by category */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-6 text-gray-800">
                            Tồn kho theo danh mục
                        </h3>
                        {inventoryData.length === 0 ? (
                            <EmptyChart />
                        ) : (
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
                                        dataKey="categoryName"
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
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        formatter={(v: number) => [
                                            `${v.toLocaleString('vi-VN')} cuốn`,
                                            'Tồn kho',
                                        ]}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#f97316"
                                        name="Tồn kho"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={60}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Category table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Danh mục (Thể loại)
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Số lượng tồn kho (cuốn)
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
                                                {item.categoryName}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-right text-orange-600">
                                                {item.value.toLocaleString(
                                                    'vi-VN',
                                                )}{' '}
                                                cuốn
                                            </td>
                                        </tr>
                                    ))}
                                    {inventoryData.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Chưa có dữ liệu tồn kho trong
                                                khoảng thời gian này
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CUSTOMER TAB ── */}
            {reportType === 'customer' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800">
                        Phân loại khách hàng theo hạng thành viên kỳ này
                    </h3>
                    {customerData.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart
                                data={customerData}
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
                                    cursor={{
                                        fill: 'rgba(139, 92, 246, 0.05)',
                                    }}
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
                    )}
                </div>
            )}

            {/* ── DEBT TAB ── */}
            {reportType === 'debt' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b pb-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-900 text-white text-xs font-mono rounded-md shadow-sm">
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">
                                Báo Cáo Công Nợ
                            </h2>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                            <label className="text-sm font-semibold text-gray-700">
                                Tháng báo cáo:
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-orange-600 outline-none cursor-pointer"
                            >
                                {availableDebtMonths.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        </div>
                    ) : (
                        <>
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
                                                        {item.beginningDebt.toLocaleString(
                                                            'vi-VN',
                                                        )}
                                                        đ
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm text-orange-600 font-medium">
                                                        +
                                                        {item.transactions.toLocaleString(
                                                            'vi-VN',
                                                        )}
                                                        đ
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
                                                        {item.endingDebt.toLocaleString(
                                                            'vi-VN',
                                                        )}
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
                                                        {debtSum?.totalBeginningDebt.toLocaleString(
                                                            'vi-VN',
                                                        )}
                                                        đ
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-orange-600">
                                                        +
                                                        {debtSum?.totalTransactions.toLocaleString(
                                                            'vi-VN',
                                                        )}
                                                        đ
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-red-600 text-lg">
                                                        {debtSum?.totalEndingDebt.toLocaleString(
                                                            'vi-VN',
                                                        )}
                                                        đ
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-6 py-8 text-center text-gray-500"
                                                    >
                                                        Không có dữ liệu công nợ
                                                        trong khoảng chu kỳ này
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function EmptyChart() {
    return (
        <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
            Chưa có dữ liệu để hiển thị
        </div>
    );
}

function SummaryCard({
    label,
    value,
    rate,
    color,
}: {
    label: string;
    value: string | number;
    rate: number;
    color: string;
}) {
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
                            so với kỳ trước
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

function DebtSummaryCard({
    label,
    value,
    border,
    bg,
    text,
}: {
    label: string;
    value: number;
    border: string;
    bg: string;
    text: string;
}) {
    return (
        <div className={`${bg} p-6 rounded-xl border-l-4 ${border} shadow-sm`}>
            <p className="text-sm font-semibold opacity-80 mb-2">{label}</p>
            <p className={`text-2xl font-bold truncate ${text}`}>
                {value.toLocaleString('vi-VN')}đ
            </p>
        </div>
    );
}
