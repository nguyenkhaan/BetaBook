import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";

interface InvoiceBook {
  title: string;
  quantity: number;
  price: number;
}

interface DiscountCode {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  customer: string;
  date: string;
  totalAmount: number;
  status: "Đã thanh toán" | "Chưa thanh toán" | "Quá hạn";
  items: number;
  books: InvoiceBook[];
  discountCode?: string;
  discountAmount?: number;
}

const mockDiscountCodes: DiscountCode[] = [
  {
    id: "1",
    code: "SUMMER2026",
    description: "Giảm 10% - Khuyến mãi mùa hè",
    type: "percentage",
    value: 10,
  },
  {
    id: "2",
    code: "NEWCUSTOMER",
    description: "Giảm 50,000đ - Khách hàng mới",
    type: "fixed",
    value: 50000,
  },
  {
    id: "3",
    code: "VIP20",
    description: "Giảm 20% - Khách hàng VIP",
    type: "percentage",
    value: 20,
  },
  {
    id: "4",
    code: "FREESHIP",
    description: "Giảm 30,000đ - Miễn phí ship",
    type: "fixed",
    value: 30000,
  },
  {
    id: "5",
    code: "MEGA50",
    description: "Giảm 50% - Siêu khuyến mãi",
    type: "percentage",
    value: 50,
  },
];

const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: "HD001",
    customer: "Nguyễn Văn A",
    date: "01/03/2026",
    totalAmount: 350000,
    status: "Đã thanh toán",
    items: 3,
    books: [
      { title: "Sách A", quantity: 1, price: 100000 },
      { title: "Sách B", quantity: 2, price: 125000 },
    ],
  },
  {
    id: 2,
    invoiceNumber: "HD002",
    customer: "Trần Thị B",
    date: "02/03/2026",
    totalAmount: 520000,
    status: "Đã thanh toán",
    items: 5,
    books: [
      { title: "Sách C", quantity: 1, price: 100000 },
      { title: "Sách D", quantity: 2, price: 125000 },
      { title: "Sách E", quantity: 2, price: 195000 },
    ],
  },
  {
    id: 3,
    invoiceNumber: "HD003",
    customer: "Lê Văn C",
    date: "03/03/2026",
    totalAmount: 280000,
    status: "Chưa thanh toán",
    items: 2,
    books: [
      { title: "Sách F", quantity: 1, price: 100000 },
      { title: "Sách G", quantity: 1, price: 180000 },
    ],
  },
  {
    id: 4,
    invoiceNumber: "HD004",
    customer: "Phạm Thị D",
    date: "04/03/2026",
    totalAmount: 420000,
    status: "Quá hạn",
    items: 4,
    books: [
      { title: "Sách H", quantity: 1, price: 100000 },
      { title: "Sách I", quantity: 1, price: 125000 },
      { title: "Sách J", quantity: 1, price: 195000 },
      { title: "Sách K", quantity: 1, price: 100000 },
    ],
  },
];

export function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewBooksOpen, setIsViewBooksOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [formData, setFormData] = useState({
    customer: "",
    date: "",
    status: "Chưa thanh toán" as Invoice["status"],
    discountCode: "",
  });
  const [createFormData, setCreateFormData] = useState({
    invoiceNumber: "",
    customer: "",
    date: new Date().toISOString().split("T")[0],
    books: [] as InvoiceBook[],
    status: "Chưa thanh toán" as Invoice["status"],
    discountCode: "",
    discountAmount: 0,
  });
  const [newBook, setNewBook] = useState({
    title: "",
    quantity: 1,
    price: 0,
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriceFilter("all"); 
    toast.info("Đã xóa tất cả bộ lọc");
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;

    let matchesPrice = true;
    const amount = invoice.totalAmount;

    if (priceFilter === "under100") {
      matchesPrice = amount < 100000;
    } else if (priceFilter === "100-200") {
      matchesPrice = amount >= 100000 && amount <= 200000;
    } else if (priceFilter === "200-500") {
      matchesPrice = amount > 200000 && amount <= 500000;
    } else if (priceFilter === "over500") {
      matchesPrice = amount > 500000;
    }

    return matchesSearch && matchesStatus && matchesPrice;
  });

  const openViewBooks = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewBooksOpen(true);
  };

  const handleEditInvoiceOpen = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      customer: invoice.customer,
      date: invoice.date,
      status: invoice.status,
      discountCode: invoice.discountCode || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInvoice = () => {
    if (selectedInvoice) {
      const discountAmount = calculateEditDiscountAmount();
      const subtotal = calculateEditSubtotal();
      const finalTotal = subtotal - discountAmount;

      const updatedInvoice: Invoice = {
        ...selectedInvoice,
        customer: formData.customer,
        date: formData.date,
        status: formData.status,
        discountCode: formData.discountCode,
        discountAmount: discountAmount,
        totalAmount: finalTotal,
      };
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === selectedInvoice.id ? updatedInvoice : invoice,
        ),
      );
      setIsEditDialogOpen(false);
      toast.success("Hóa đơn đã được cập nhật thành công!");
    }
  };

  const handleDeleteInvoiceOpen = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      setInvoices(
        invoices.filter((invoice) => invoice.id !== selectedInvoice.id),
      );
      setIsDeleteDialogOpen(false);
      toast.success("Hóa đơn đã được xóa thành công!");
    }
  };

  const handleAddBook = () => {
    if (newBook.title && newBook.quantity > 0 && newBook.price > 0) {
      setCreateFormData({
        ...createFormData,
        books: [...createFormData.books, newBook],
      });
      setNewBook({ title: "", quantity: 1, price: 0 });
      toast.success("Đã thêm sách vào danh sách!");
    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin sách!");
    }
  };

  const handleRemoveBook = (index: number) => {
    setCreateFormData({
      ...createFormData,
      books: createFormData.books.filter((_, idx) => idx !== index),
    });
    toast.success("Đã xóa sách khỏi danh sách!");
  };

  const calculateTotalAmount = () => {
    return createFormData.books.reduce(
      (total, book) => total + book.quantity * book.price,
      0,
    );
  };

  const calculateDiscountAmount = () => {
    if (!createFormData.discountCode) return 0;

    const discount = mockDiscountCodes.find(
      (d) => d.code === createFormData.discountCode,
    );
    if (!discount) return 0;

    const subtotal = calculateTotalAmount();
    if (discount.type === "percentage") {
      return Math.round((subtotal * discount.value) / 100);
    } else {
      return discount.value;
    }
  };

  const calculateEditDiscountAmount = () => {
    if (!formData.discountCode || !selectedInvoice) return 0;

    const discount = mockDiscountCodes.find(
      (d) => d.code === formData.discountCode,
    );
    if (!discount) return 0;

    const subtotal = selectedInvoice.books.reduce(
      (total, book) => total + book.quantity * book.price,
      0,
    );
    if (discount.type === "percentage") {
      return Math.round((subtotal * discount.value) / 100);
    } else {
      return discount.value;
    }
  };

  const calculateEditSubtotal = () => {
    if (!selectedInvoice) return 0;
    return selectedInvoice.books.reduce(
      (total, book) => total + book.quantity * book.price,
      0,
    );
  };

  const calculateEditFinalTotal = () => {
    return calculateEditSubtotal() - calculateEditDiscountAmount();
  };

  const calculateFinalTotal = () => {
    return calculateTotalAmount() - calculateDiscountAmount();
  };

  const calculateTotalItems = () => {
    return createFormData.books.reduce(
      (total, book) => total + book.quantity,
      0,
    );
  };

  const handleDiscountCodeChange = (code: string) => {
    setCreateFormData({
      ...createFormData,
      discountCode: code,
    });
  };

  const handleCreateInvoice = () => {
    if (!createFormData.customer || !createFormData.date) {
      toast.error("Vui lòng nhập đầy đủ thông tin khách hàng và ngày!");
      return;
    }
    if (createFormData.books.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sách vào hóa đơn!");
      return;
    }

    const newInvoice: Invoice = {
      id: invoices.length + 1,
      invoiceNumber: `HD${String(invoices.length + 1).padStart(3, "0")}`,
      customer: createFormData.customer,
      date: createFormData.date,
      totalAmount: calculateFinalTotal(),
      status: createFormData.status,
      items: calculateTotalItems(),
      books: createFormData.books,
      discountCode: createFormData.discountCode,
      discountAmount: calculateDiscountAmount(),
    };
    setInvoices([...invoices, newInvoice]);
    setIsCreateDialogOpen(false);
    setCreateFormData({
      invoiceNumber: "",
      customer: "",
      date: new Date().toISOString().split("T")[0],
      books: [],
      status: "Chưa thanh toán",
      discountCode: "",
      discountAmount: 0,
    });
    toast.success("Hóa đơn mới đã được tạo thành công!");
  };

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-green-100 text-green-800";
      case "Chưa thanh toán":
        return "bg-yellow-100 text-yellow-800";
      case "Quá hạn":
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hóa đơn</h1>
          <p className="text-gray-600 mt-1">
            Quản lý hóa đơn bán hàng của Beta Book
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Tạo hóa đơn mới
        </Button>
      </div>

      {/* Search and Filter
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo số hóa đơn hoặc tên khách hàng..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div> */}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng hóa đơn</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {invoices.length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đã thanh toán</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {invoices.filter((i) => i.status === "Đã thanh toán").length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Chưa thanh toán</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {invoices.filter((i) => i.status === "Chưa thanh toán").length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Quá hạn</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {invoices.filter((i) => i.status === "Quá hạn").length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter Bar - Phía trên bảng hóa đơn */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
        {/* Thanh tìm kiếm */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Bộ lọc Trạng thái - Đã kết nối với State */}
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 border-gray-200 text-sm">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
              <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
              <SelectItem value="Quá hạn">Quá hạn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bộ lọc Khoảng giá */}
        <div className="w-70">
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="h-10 border-gray-200 text-sm">
              <SelectValue placeholder="Khoảng giá" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tất cả">Tất cả giá</SelectItem>
              <SelectItem value="Dưới 100k">Dưới 100k</SelectItem>
              <SelectItem value="100k-200k">100k - 200k</SelectItem>
              <SelectItem value="200k-500k">200k - 500k</SelectItem>
              <SelectItem value="Hơn 500k">Trên 500k</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nút Reset bộ lọc */}
        <Button
          variant="outline"
          size="icon"
          className="border-gray-200 hover:bg-orange-50 group"
          onClick={handleResetFilters}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-500 group-hover:rotate-180 transition-transform duration-300"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </Button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số hóa đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh sách sách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số mặt hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {invoice.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="max-w-xs">
                    {invoice.books.map((book, idx) => (
                      <div key={idx} className="text-xs">
                        • {book.title} ({book.quantity})
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {invoice.discountCode ? (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      {invoice.discountCode}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {invoice.items}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.totalAmount.toLocaleString("vi-VN")}đ
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      invoice.status,
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditInvoiceOpen(invoice)}
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteInvoiceOpen(invoice)}
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openViewBooks(invoice)}
                      title="Xem danh sách sách"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Books Dialog */}
      <Dialog open={isViewBooksOpen} onOpenChange={setIsViewBooksOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-center text-xl font-bold text-gray-900 mb-2">
                  HÓA ĐƠN THANH TOÁN
                </DialogTitle>
                <div className="text-center text-sm text-gray-600 mb-1">
                  (Beta Book - Cửa hàng sách)
                </div>
                {selectedInvoice && (
                  <div className="text-center text-sm text-gray-600">
                    Số: {selectedInvoice.invoiceNumber}
                  </div>
                )}
              </div>
              {selectedInvoice && (
                <div
                  className={`px-4 py-2 rounded text-sm font-medium ml-4 ${
                    selectedInvoice.status === "Đã thanh toán"
                      ? "bg-red-500 text-white"
                      : selectedInvoice.status === "Chưa thanh toán"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-500 text-white"
                  }`}
                >
                  {selectedInvoice.status.toUpperCase()}
                </div>
              )}
            </div>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4 py-4">
              {/* Thông tin hóa đơn */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Ngày:</span>{" "}
                  <span className="text-gray-900">
                    {selectedInvoice.date}{" "}
                    {new Date().toTimeString().slice(0, 8)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Thủ ngân:</span>{" "}
                  <span className="text-gray-900">A Nguyen Van</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">KH:</span>{" "}
                  <span className="text-gray-900">
                    {selectedInvoice.customer}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Địa chỉ:</span>{" "}
                  <span className="text-gray-900">Hà Nội, Việt Nam</span>
                </div>
                {selectedInvoice.discountCode && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">
                      Mã giảm giá:
                    </span>{" "}
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      {selectedInvoice.discountCode}
                    </span>
                    {mockDiscountCodes.find(
                      (d) => d.code === selectedInvoice.discountCode,
                    ) && (
                      <span className="ml-2 text-gray-600">
                        (
                        {
                          mockDiscountCodes.find(
                            (d) => d.code === selectedInvoice.discountCode,
                          )?.description
                        }
                        )
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bảng sản phẩm */}
              <div className="mt-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        TÊN HÀNG HÓA
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase w-16">
                        SL
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase w-32">
                        ĐƠN GIÁ
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase w-32">
                        THÀNH TIỀN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.books.map((book, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">
                          {book.title}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm text-gray-900">
                          {book.quantity}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right text-sm text-gray-900">
                          {book.price.toLocaleString("vi-VN")}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-right text-sm text-gray-900">
                          {(book.quantity * book.price).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows for spacing */}
                    <tr className="bg-white">
                      <td
                        className="border border-gray-300 px-4 py-3"
                        colSpan={4}
                      >
                        &nbsp;
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td
                        className="border border-gray-300 px-4 py-3"
                        colSpan={4}
                      >
                        &nbsp;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tổng kết */}
              <div className="mt-6 flex justify-end">
                <div className="w-80 space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">
                      Thành tiền
                    </span>
                    <span className="text-gray-900 font-medium">
                      {selectedInvoice.books
                        .reduce(
                          (total, book) => total + book.quantity * book.price,
                          0,
                        )
                        .toLocaleString("vi-VN")}
                    </span>
                  </div>
                  {selectedInvoice.discountCode &&
                    selectedInvoice.discountAmount && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-orange-600">
                          Mã giảm giá
                        </span>
                        <span className="font-medium text-orange-600">
                          -
                          {selectedInvoice.discountAmount.toLocaleString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between pt-2">
                    <span className="font-bold text-gray-900 text-base">
                      Tổng thanh toán
                    </span>
                    <span className="text-gray-900 font-bold text-base">
                      {selectedInvoice.totalAmount.toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewBooksOpen(false)}>
              Đóng
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Download className="w-4 h-4 mr-2" />
              Xuất hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo hóa đơn mới</DialogTitle>
            <DialogDescription>Nhập thông tin hóa đơn mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-sm">
                Khách hàng
              </Label>
              <Input
                id="customer"
                value={createFormData.customer}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    customer: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Nhập tên khách hàng"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-sm">
                Ngày
              </Label>
              <Input
                id="date"
                type="date"
                value={createFormData.date}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, date: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="mt-2 text-sm">Danh sách sách</Label>
              <div className="col-span-3 border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-32 overflow-y-auto">
                {createFormData.books.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">
                    Chưa có sách nào
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                          Tên sách
                        </th>
                        <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                          SL
                        </th>
                        <th className="text-left py-1 px-2 text-xs font-medium text-gray-500">
                          Giá
                        </th>
                        <th className="text-left py-1 px-2 text-xs font-medium text-gray-500"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {createFormData.books.map((book, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="py-1 px-2">{book.title}</td>
                          <td className="py-1 px-2">{book.quantity}</td>
                          <td className="py-1 px-2">
                            {book.price.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="py-1 px-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveBook(idx)}
                              className="h-6 px-2 text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Add Book Section - Compact */}
            <div className="border-t pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Thêm sách
              </p>
              <div className="grid grid-cols-12 gap-2">
                <Input
                  placeholder="Tên sách"
                  value={newBook.title}
                  onChange={(e) =>
                    setNewBook({ ...newBook, title: e.target.value })
                  }
                  className="col-span-5 text-sm"
                />
                <Input
                  type="number"
                  placeholder="SL"
                  min="1"
                  value={newBook.quantity}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  className="col-span-2 text-sm"
                />
                <Input
                  type="number"
                  placeholder="Giá"
                  min="0"
                  value={newBook.price}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3 text-sm"
                />
                <Button
                  onClick={handleAddBook}
                  className="col-span-2 bg-orange-500 hover:bg-orange-600 text-sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 border-t pt-3">
              <Label className="text-sm">Số mặt hàng</Label>
              <Input
                value={calculateTotalItems().toString()}
                readOnly
                className="col-span-3 bg-gray-50 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-sm">Tạm tính</Label>
              <Input
                value={`${calculateTotalAmount().toLocaleString("vi-VN")}đ`}
                readOnly
                className="col-span-3 bg-gray-50 text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountCode" className="text-sm">
                Mã giảm giá
              </Label>
              <Select
                value={createFormData.discountCode}
                onValueChange={handleDiscountCodeChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn mã giảm gi�� (tùy chọn)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không áp dụng</SelectItem>
                  {mockDiscountCodes.map((discount) => (
                    <SelectItem key={discount.id} value={discount.code}>
                      {discount.code} - {discount.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {createFormData.discountCode && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-sm">Giảm giá</Label>
                <Input
                  value={`-${calculateDiscountAmount().toLocaleString("vi-VN")}đ`}
                  readOnly
                  className="col-span-3 bg-orange-50 text-orange-600 font-medium text-sm"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="font-semibold text-sm">Tổng tiền</Label>
              <Input
                value={`${calculateFinalTotal().toLocaleString("vi-VN")}đ`}
                readOnly
                className="col-span-3 bg-gray-50 font-semibold text-sm"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-sm">
                Trạng thái
              </Label>
              <Select
                value={createFormData.status}
                onValueChange={(value) =>
                  setCreateFormData({
                    ...createFormData,
                    status: value as Invoice["status"],
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                  <SelectItem value="Chưa thanh toán">
                    Chưa thanh toán
                  </SelectItem>
                  <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setCreateFormData({
                  invoiceNumber: "",
                  customer: "",
                  date: new Date().toISOString().split("T")[0],
                  books: [],
                  status: "Chưa thanh toán",
                  discountCode: "",
                  discountAmount: 0,
                });
                setNewBook({ title: "", quantity: 1, price: 0 });
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateInvoice}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Tạo hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Cập nhật hóa đơn</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin hóa đơn</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Số hóa đơn</Label>
                <Input
                  value={selectedInvoice.invoiceNumber}
                  readOnly
                  className="col-span-3 bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-customer">Khách hàng</Label>
                <Input
                  id="edit-customer"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData({ ...formData, customer: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date">Ngày</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="mt-2">Danh sách sách</Label>
                <div className="col-span-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                          Tên sách
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                          Số lượng
                        </th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">
                          Giá
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.books.map((book, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="py-2 px-2">{book.title}</td>
                          <td className="py-2 px-2">{book.quantity}</td>
                          <td className="py-2 px-2">
                            {book.price.toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Số mặt hàng</Label>
                <Input
                  value={selectedInvoice.items.toString()}
                  readOnly
                  className="col-span-3 bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Tạm tính</Label>
                <Input
                  value={`${calculateEditSubtotal().toLocaleString("vi-VN")}đ`}
                  readOnly
                  className="col-span-3 bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-discountCode">Mã giảm giá</Label>
                <Select
                  value={formData.discountCode}
                  onValueChange={(code) =>
                    setFormData({ ...formData, discountCode: code })
                  }
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Chọn mã giảm giá (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không áp dng</SelectItem>
                    {mockDiscountCodes.map((discount) => (
                      <SelectItem key={discount.id} value={discount.code}>
                        {discount.code} - {discount.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.discountCode && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Giảm giá</Label>
                  <Input
                    value={`-${calculateEditDiscountAmount().toLocaleString("vi-VN")}đ`}
                    readOnly
                    className="col-span-3 bg-orange-50 text-orange-600 font-medium"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="font-semibold">Tổng tiền</Label>
                <Input
                  value={`${calculateEditFinalTotal().toLocaleString("vi-VN")}đ`}
                  readOnly
                  className="col-span-3 bg-gray-50 font-semibold"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Invoice["status"],
                    })
                  }
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                    <SelectItem value="Chưa thanh toán">
                      Chưa thanh toán
                    </SelectItem>
                    <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button onClick={handleEditInvoice}>Cập nhật hóa đơn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Invoice Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Xóa hóa đơn</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa hóa đơn này?
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Số hóa đơn</Label>
                <Input
                  value={selectedInvoice.invoiceNumber}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Khách hàng</Label>
                <Input
                  value={selectedInvoice.customer}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Ngày</Label>
                <Input
                  value={selectedInvoice.date}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Số mặt hàng</Label>
                <Input
                  value={selectedInvoice.items.toString()}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Tổng tiền</Label>
                <Input
                  value={`${selectedInvoice.totalAmount.toLocaleString("vi-VN")}đ`}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Trạng thái</Label>
                <Select value={selectedInvoice.status} disabled>
                  <SelectTrigger className="col-span-3">
                    <SelectValue>{selectedInvoice.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                    <SelectItem value="Chưa thanh toán">
                      Chưa thanh toán
                    </SelectItem>
                    <SelectItem value="Quá hạn">Quá hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button variant="destructive" onClick={handleDeleteInvoice}>
              Xóa hóa đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
