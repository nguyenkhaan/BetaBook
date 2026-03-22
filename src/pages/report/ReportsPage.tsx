import { useState } from 'react';
import { ClipboardList, Download, TrendingUp, TrendingDown } from 'lucide-react';
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

const revenueData = [
  { id: 'month1', month: 'T1', revenue: 15000000, orders: 145 },
  { id: 'month2', month: 'T2', revenue: 18500000, orders: 167 },
  { id: 'month3', month: 'T3', revenue: 12000000, orders: 98 },
  { id: 'month4', month: 'T4', revenue: 22000000, orders: 210 },
  { id: 'month5', month: 'T5', revenue: 19500000, orders: 183 },
  { id: 'month6', month: 'T6', revenue: 25000000, orders: 245 },
];

const topProducts = [
  { id: 'prod1', name: 'Đắc Nhân Tâm', sold: 156, revenue: 18720000 },
  { id: 'prod2', name: 'Nhà Giả Kim', sold: 132, revenue: 12540000 },
  { id: 'prod3', name: 'Sapiens', sold: 98, revenue: 17640000 },
  { id: 'prod4', name: 'Atomic Habits', sold: 87, revenue: 13050000 },
  { id: 'prod5', name: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', sold: 145, revenue: 12325000 },
];

const slowMovingBooks = [
  { id: 'slow1', name: 'Sách A', stock: 45, lastSold: '20/01/2026', daysSinceLastSale: 49 },
  { id: 'slow2', name: 'Sách B', stock: 32, lastSold: '15/01/2026', daysSinceLastSale: 54 },
  { id: 'slow3', name: 'Sách C', stock: 28, lastSold: '10/01/2026', daysSinceLastSale: 59 },
  { id: 'slow4', name: 'Sách D', stock: 21, lastSold: '05/01/2026', daysSinceLastSale: 64 },
  { id: 'slow5', name: 'Sách E', stock: 18, lastSold: '01/01/2026', daysSinceLastSale: 68 },
];

const inventoryByCategory = [
  { id: 'cat1', category: 'Văn học', stock: 450, value: 45000000 },
  { id: 'cat2', category: 'Kinh tế', stock: 320, value: 38400000 },
  { id: 'cat3', category: 'Kỹ năng sống', stock: 280, value: 33600000 },
  { id: 'cat4', category: 'Thiếu nhi', stock: 220, value: 19800000 },
  { id: 'cat5', category: 'Khoa học', stock: 180, value: 27000000 },
];

const customerStats = [
  { id: 'cust1', segment: 'VIP', count: 45, revenue: 125000000, avgOrder: 2777778 },
  { id: 'cust2', segment: 'Thân thiết', count: 120, revenue: 84000000, avgOrder: 700000 },
  { id: 'cust3', segment: 'Thường xuyên', count: 230, revenue: 46000000, avgOrder: 200000 },
  { id: 'cust4', segment: 'Mới', count: 180, revenue: 18000000, avgOrder: 100000 },
];

export function ReportsPage() {
  const [reportType, setReportType] = useState<'revenue' | 'inventory' | 'customer'>('revenue');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo thống kê</h1>
          <p className="text-gray-600 mt-1">Xem các báo cáo và thống kê của Beta Book</p>
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
            variant={reportType === 'revenue' ? 'default' : 'outline'}
            onClick={() => setReportType('revenue')}
            className={reportType === 'revenue' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Doanh thu
          </Button>
          <Button
            variant={reportType === 'inventory' ? 'default' : 'outline'}
            onClick={() => setReportType('inventory')}
            className={reportType === 'inventory' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Tồn kho
          </Button>
          <Button
            variant={reportType === 'customer' ? 'default' : 'outline'}
            onClick={() => setReportType('customer')}
            className={reportType === 'customer' ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            Khách hàng
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Doanh thu tháng này</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">25.0M</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <ClipboardList className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">245</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
            <ClipboardList className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Giá trị đơn TB</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">102K</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+5.2%</span>
              </div>
            </div>
            <ClipboardList className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tỷ lệ hoàn trả</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2.3%</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">-0.5%</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu 6 tháng gần đây</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `${(value / 1000000).toFixed(1)}M`}
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

            {/* Orders Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Số lượng đơn hàng</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#f97316" name="Đơn hàng" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sách bán chạy nhất</h3>
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
                  <tr key={product.id} className="hover:bg-gray-50">
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
                      {product.revenue.toLocaleString('vi-VN')}đ
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tồn kho theo danh mục</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#f97316" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Slow Moving Books Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sách bán chậm</h3>
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
                  <tr key={book.id} className="hover:bg-gray-50">
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
              <h3 className="text-lg font-semibold text-gray-900">Tồn kho theo danh mục</h3>
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
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.stock} cuốn
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.value.toLocaleString('vi-VN')}đ
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo phân khúc khách hàng</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M`} />
                <Legend />
                <Bar dataKey="revenue" fill="#f97316" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Statistics Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Thống kê khách hàng</h3>
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
                  <tr key={stat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.segment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.count} khách hàng
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.revenue.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {stat.avgOrder.toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}