import { useEffect, useRef, useState } from 'react';
import {
    FileText,
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    Download,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import {
    IncomePaymentMethod,
    IncomeReceipt,
    IncomeService,
    IncomeStatus,
} from '../services/income.service';

type Receipt = IncomeReceipt;

interface ReceiptFormData {
    code: string;
    cost: number;
    paymentMethod: IncomePaymentMethod;
    status: IncomeStatus;
    shortDescription: string;
    bill: {
        billCode: string;
        billId: number | null;
    };
    customer: {
        customerName: string;
        customerId: number | null;
    };
}

const initialFormData: ReceiptFormData = {
    code: '',
    cost: 0,
    paymentMethod: 'CASH',
    status: 'COMPLETE',
    shortDescription: '',
    bill: {
        billCode: '',
        billId: null,
    },
    customer: {
        customerName: '',
        customerId: null,
    },
};

const PAYMENT_METHODS_MAP = {
    CASH: 'Tiền mặt',
    TRANSFER: 'Chuyển khoản',
    CARD: 'Thẻ',
};

const STATUS_MAP = {
    COMPLETE: 'Hoàn thành',
    PENDING: 'Chờ xác nhận',
    CANCEL: 'Đã hủy',
};

export function ReceiptsPage() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(
        null,
    );
    const [formData, setFormData] = useState<ReceiptFormData>(initialFormData);
    const [isLookingUpBill, setIsLookingUpBill] = useState(false);
    const [billLookupError, setBillLookupError] = useState('');
    const latestLookupIdRef = useRef(0);

    const filteredReceipts = receipts.filter(
        (receipt) =>
            receipt.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receipt.customer.customerName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            receipt.employee.employeeName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const fetchAllReceipts = async () => {
        try {
            const receipts = await IncomeService.getAll();
            setReceipts(receipts);
        } catch (err) {
            toast.error('Không thể tải phiếu thu');
        }
    };

    const handleBillCodeChange = (billCode: string) => {
        setFormData((currentFormData) => ({
            ...currentFormData,
            bill: {
                billCode,
                billId: null,
            },
            customer: {
                customerId: null,
                customerName: '',
            },
        }));
        setBillLookupError('');
    };

    const getPaymentMethodColor = (method: Receipt['paymentMethod']) => {
        switch (method) {
            case 'CASH':
                return 'bg-green-100 text-green-800';
            case 'TRANSFER':
                return 'bg-blue-100 text-blue-800';
            case 'CARD':
                return 'bg-purple-100 text-purple-800';
        }
    };

    const getStatusColor = (status: Receipt['status']) => {
        switch (status) {
            case 'COMPLETE':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCEL':
                return 'bg-red-100 text-red-800';
        }
    };

    const handleCreateReceipt = async () => {
        if (!formData.bill.billCode || !formData.customer.customerId) {
            toast.error(
                'Vui lòng nhập mã hóa đơn hợp lệ để tự động chọn khách hàng',
            );
            return;
        }

        const sendData = {
            code:
                formData.code ||
                `INC${String(receipts.length + 1).padStart(3, '0')}`,
            cost: formData.cost,
            status: formData.status,
            billCode: formData.bill.billCode,
            shortDescription: formData.shortDescription,
            paymentMethod: formData.paymentMethod,
        };
        setLoading(true);
        try {
            const response = await IncomeService.create(sendData);
            setReceipts((currentReceipts) => [...currentReceipts, response]);
            setIsCreateDialogOpen(false);
            resetFormData();
            toast.success('Phiếu thu đã được tạo thành công!');
        } catch (err) {
            console.log('Create income error', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditReceipt = async () => {
        if (!selectedReceipt) return;
        if (!formData.bill.billCode || !formData.customer.customerId) {
            toast.error(
                'Vui lòng nhập mã hóa đơn hợp lệ để tự động chọn khách hàng',
            );
            return;
        }

        setLoading(true);
        try {
            const updateData: any = {};
            if (formData.code) updateData.code = formData.code;
            if (formData.cost) updateData.cost = formData.cost;
            if (formData.status) updateData.status = formData.status;
            if (formData.paymentMethod)
                updateData.paymentMethod = formData.paymentMethod;
            if (formData.shortDescription)
                updateData.shortDescription = formData.shortDescription;
            if (formData.bill.billCode)
                updateData.billCode = formData.bill.billCode;
            await IncomeService.update(selectedReceipt.id, updateData);
            await fetchAllReceipts();
            setIsEditDialogOpen(false);
            resetFormData();
            toast.success('Phiếu thu đã được cập nhật thành công!');
        } catch (err) {
            console.log('Update income error', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReceipt = async () => {
        try {
            if (selectedReceipt) {
                await IncomeService.delete(Number(selectedReceipt.id));
                setReceipts(
                    receipts.filter(
                        (receipt) => receipt.id !== selectedReceipt.id,
                    ),
                );
                setIsDeleteDialogOpen(false);
                toast.success('Phiếu thu đã được xóa thành công!');
            }
        } catch (err: any) {
            toast.error('Lỗi khi xóa phiếu thu' + err.response);
            throw err;
        }
    };

    const handleDownloadReceipt = (receipt: Receipt) => {
        toast.success(`Đang tải phiếu thu ${receipt.code}...`);
    };

    const handleViewReceipt = (receipt: Receipt) => {
        setSelectedReceipt(receipt);
        setIsViewDialogOpen(true);
    };

    const handleEditReceiptOpen = (receipt: Receipt) => {
        setSelectedReceipt(receipt);
        setFormData({
            code: receipt.code,
            cost: receipt.cost,
            paymentMethod: receipt.paymentMethod,
            status: receipt.status,
            shortDescription: receipt.shortDescription || '',
            bill: {
                billCode: receipt.bill.billCode,
                billId: receipt.bill.billId,
            },
            customer: {
                customerName: receipt.customer.customerName,
                customerId: receipt.customer.customerId,
            },
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteReceiptOpen = (receipt: Receipt) => {
        setSelectedReceipt(receipt);
        setIsDeleteDialogOpen(true);
    };

    const resetFormData = () => {
        setFormData(initialFormData);
        setBillLookupError('');
        setIsLookingUpBill(false);
    };

    const formatDateTime = (date: string, time: string) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year} ${time}`;
    };

    useEffect(() => {
        if (!isCreateDialogOpen && !isEditDialogOpen) {
            return;
        }

        const billCode = formData.bill.billCode.trim();

        if (!billCode) {
            setBillLookupError('');
            setIsLookingUpBill(false);
            setFormData((currentFormData) => ({
                ...currentFormData,
                bill: {
                    ...currentFormData.bill,
                    billId: null,
                },
                customer: {
                    customerId: null,
                    customerName: '',
                },
            }));
            return;
        }

        const timeoutId = window.setTimeout(async () => {
            const lookupId = latestLookupIdRef.current + 1;
            latestLookupIdRef.current = lookupId;
            setIsLookingUpBill(true);
            setBillLookupError('');

            try {
                const bill = await IncomeService.getBillByCode(billCode);
                if (latestLookupIdRef.current !== lookupId) {
                    return;
                }

                if (!bill?.customer) {
                    setBillLookupError('Không tìm thấy hóa đơn phù hợp');
                    setFormData((currentFormData) => ({
                        ...currentFormData,
                        bill: {
                            ...currentFormData.bill,
                            billId: null,
                        },
                        customer: {
                            customerId: null,
                            customerName: '',
                        },
                    }));
                    return;
                }

                setFormData((currentFormData) => ({
                    ...currentFormData,
                    bill: {
                        billCode: bill.code,
                        billId: bill.id,
                    },
                    customer: {
                        customerId: bill.customer.id,
                        customerName: bill.customer.name,
                    },
                }));
            } catch (err) {
                if (latestLookupIdRef.current !== lookupId) {
                    return;
                }

                setBillLookupError('Không tìm thấy hóa đơn phù hợp');
                setFormData((currentFormData) => ({
                    ...currentFormData,
                    bill: {
                        ...currentFormData.bill,
                        billId: null,
                    },
                    customer: {
                        customerId: null,
                        customerName: '',
                    },
                }));
            } finally {
                if (latestLookupIdRef.current === lookupId) {
                    setIsLookingUpBill(false);
                }
            }
        }, 400);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [formData.bill.billCode, isCreateDialogOpen, isEditDialogOpen]);

    useEffect(() => {
        fetchAllReceipts();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý phiếu thu tiền
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý các phiếu thu của Beta Book
                    </p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => {
                        resetFormData();
                        setIsCreateDialogOpen(true);
                    }}
                >
                    <Plus className="w-4 h-4" />
                    Tạo phiếu thu
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo số phiếu, khách hàng hoặc người thu..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">
                                Tổng phiếu thu
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {receipts.length}
                            </p>
                        </div>
                        <FileText className="w-10 h-10 text-orange-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Hoàn thành</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {
                                    receipts.filter(
                                        (r) => r.status === 'COMPLETE',
                                    ).length
                                }
                            </p>
                        </div>
                        <FileText className="w-10 h-10 text-green-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">
                                Chờ xác nhận
                            </p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">
                                {
                                    receipts.filter(
                                        (r) => r.status === 'PENDING',
                                    ).length
                                }
                            </p>
                        </div>
                        <FileText className="w-10 h-10 text-yellow-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Tổng thu</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {receipts
                                    .filter((r) => r.status === 'COMPLETE')
                                    .reduce((sum, r) => sum + Number(r.cost), 0)
                                    .toLocaleString()}
                                đ
                            </p>
                        </div>
                        <FileText className="w-10 h-10 text-blue-500" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số phiếu thu
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Khách hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày thu
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hình thức
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người thu
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
                        {filteredReceipts.map((receipt) => (
                            <tr key={receipt.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-orange-600">
                                        {receipt.code}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {receipt.customer.customerName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatDateTime(
                                        receipt.createdAt,
                                        receipt.updatedAt,
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {receipt.cost.toLocaleString()}đ
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(receipt.paymentMethod)}`}
                                    >
                                        {PAYMENT_METHODS_MAP[
                                            receipt.paymentMethod as keyof typeof PAYMENT_METHODS_MAP
                                        ] || receipt.paymentMethod}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {receipt.employee.employeeName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}
                                    >
                                        {STATUS_MAP[
                                            receipt.status as keyof typeof STATUS_MAP
                                        ] || receipt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleViewReceipt(receipt)
                                            }
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleEditReceiptOpen(receipt)
                                            }
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteReceiptOpen(receipt)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleDownloadReceipt(receipt)
                                            }
                                        >
                                            <Download className="w-4 h-4 text-blue-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tạo phiếu thu mới</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin phiếu thu mới
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="receiptNumber"
                                className="text-sm font-medium"
                            >
                                Số phiếu thu
                            </Label>
                            <Input
                                id="receiptNumber"
                                value={
                                    formData.code ||
                                    `INC${String(receipts.length + 1).padStart(3, '0')}`
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    })
                                }
                                className="bg-gray-50"
                                placeholder="Tự động tạo"
                            />
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin khách hàng
                            </h4>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="customerName"
                                    className="text-sm font-medium"
                                >
                                    Mã hóa đơn
                                </Label>
                                <Input
                                    id="customerName"
                                    value={formData.bill.billCode}
                                    onChange={(e) =>
                                        handleBillCodeChange(e.target.value)
                                    }
                                    placeholder="Nhập mã hóa đơn"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="createCustomerName"
                                    className="text-sm font-medium"
                                >
                                    Tên khách hàng
                                </Label>
                                <Input
                                    id="createCustomerName"
                                    value={formData.customer.customerName}
                                    readOnly
                                    placeholder="Khách hàng sẽ tự động hiển thị theo mã hóa đơn"
                                    className="bg-gray-50"
                                />
                                {isLookingUpBill && (
                                    <p className="text-xs text-gray-500">
                                        Đang tìm khách hàng theo mã hóa đơn...
                                    </p>
                                )}
                                {!isLookingUpBill && billLookupError && (
                                    <p className="text-xs text-red-500">
                                        {billLookupError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin thanh toán
                            </h4>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="amount"
                                    className="text-sm font-medium"
                                >
                                    Số tiền (VNĐ)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cost: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="paymentMethod"
                                    className="text-sm font-medium"
                                >
                                    Hình thức thanh toán
                                </Label>
                                <Select
                                    value={formData.paymentMethod}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            paymentMethod:
                                                value as Receipt['paymentMethod'],
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn hình thức" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">
                                            Tiền mặt
                                        </SelectItem>
                                        <SelectItem value="TRANSFER">
                                            Chuyển khoản
                                        </SelectItem>
                                        <SelectItem value="CARD">
                                            Thẻ
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="status"
                                    className="text-sm font-medium"
                                >
                                    Trạng thái
                                </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            status: value as Receipt['status'],
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COMPLETE">
                                            Hoàn thành
                                        </SelectItem>
                                        <SelectItem value="PENDING">
                                            Chờ xác nhận
                                        </SelectItem>
                                        <SelectItem value="CANCEL">
                                            Đã hủy
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="note"
                                    className="text-sm font-medium"
                                >
                                    Ghi chú
                                </Label>
                                <Input
                                    id="note"
                                    value={formData.shortDescription}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            shortDescription: e.target.value,
                                        })
                                    }
                                    placeholder="Ghi chú (tùy chọn)"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsCreateDialogOpen(false);
                                resetFormData();
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreateReceipt}
                            className="bg-orange-500 hover:bg-orange-600"
                            disabled={loading}
                        >
                            Tạo phiếu thu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa phiếu thu</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin phiếu thu
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="editReceiptNumber"
                                className="text-sm font-medium"
                            >
                                Số phiếu thu
                            </Label>
                            <Input
                                id="editReceiptNumber"
                                value={formData.code}
                                className="bg-gray-50"
                                readOnly
                            />
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin hóa đơn
                            </h4>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="editCustomerName"
                                    className="text-sm font-medium"
                                >
                                    Mã hóa đơn
                                </Label>
                                <Input
                                    id="editCustomerName"
                                    value={formData.bill.billCode}
                                    onChange={(e) =>
                                        handleBillCodeChange(e.target.value)
                                    }
                                    placeholder="Nhập mã hóa đơn"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="editReadonlyCustomerName"
                                    className="text-sm font-medium"
                                >
                                    Tên khách hàng
                                </Label>
                                <Input
                                    id="editReadonlyCustomerName"
                                    value={formData.customer.customerName}
                                    readOnly
                                    placeholder="Khách hàng sẽ tự động hiển thị theo mã hóa đơn"
                                    className="bg-gray-50"
                                />
                                {isLookingUpBill && (
                                    <p className="text-xs text-gray-500">
                                        Đang tìm khách hàng theo mã hóa đơn...
                                    </p>
                                )}
                                {!isLookingUpBill && billLookupError && (
                                    <p className="text-xs text-red-500">
                                        {billLookupError}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t">
                            <h4 className="text-sm font-semibold text-gray-700">
                                Thông tin thanh toán
                            </h4>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="editAmount"
                                    className="text-sm font-medium"
                                >
                                    Số tiền (VNĐ)
                                </Label>
                                <Input
                                    id="editAmount"
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cost: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="editPaymentMethod"
                                    className="text-sm font-medium"
                                >
                                    Hình thức thanh toán
                                </Label>
                                <Select
                                    value={formData.paymentMethod}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            paymentMethod:
                                                value as Receipt['paymentMethod'],
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn hình thức" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">
                                            Tiền mặt
                                        </SelectItem>
                                        <SelectItem value="TRANSFER">
                                            Chuyển khoản
                                        </SelectItem>
                                        <SelectItem value="CARD">
                                            Thẻ
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="editStatus"
                                    className="text-sm font-medium"
                                >
                                    Trạng thái
                                </Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            status: value as Receipt['status'],
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COMPLETE">
                                            Hoàn thành
                                        </SelectItem>
                                        <SelectItem value="PENDING">
                                            Chờ xác nhận
                                        </SelectItem>
                                        <SelectItem value="CANCEL">
                                            Đã hủy
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="editNote"
                                    className="text-sm font-medium"
                                >
                                    Ghi chú
                                </Label>
                                <Input
                                    id="editNote"
                                    value={formData.shortDescription}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            shortDescription: e.target.value,
                                        })
                                    }
                                    placeholder="Ghi chú (tùy chọn)"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleEditReceipt}
                            className="bg-orange-500 hover:bg-orange-600"
                            disabled={loading}
                        >
                            Cập nhật
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết phiếu thu</DialogTitle>
                        <DialogDescription>
                            Thông tin chi tiết về phiếu thu
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-500">
                                Số phiếu thu
                            </Label>
                            <div className="text-lg font-semibold text-orange-600">
                                {selectedReceipt?.code}
                            </div>
                        </div>
                        <div className="border-t pt-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    Khách hàng:
                                </span>
                                <span className="text-sm font-medium">
                                    {selectedReceipt?.customer.customerName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    Ngày thu:
                                </span>
                                <span className="text-sm font-medium">
                                    {selectedReceipt &&
                                        formatDateTime(
                                            selectedReceipt.createdAt,
                                            selectedReceipt.updatedAt,
                                        )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    Số tiền:
                                </span>
                                <span className="text-sm font-semibold text-orange-600">
                                    {selectedReceipt?.cost.toLocaleString()}đ
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    Hình thức:
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${selectedReceipt && getPaymentMethodColor(selectedReceipt.paymentMethod)}`}
                                >
                                    {selectedReceipt &&
                                        (PAYMENT_METHODS_MAP[
                                            selectedReceipt.paymentMethod as keyof typeof PAYMENT_METHODS_MAP
                                        ] ||
                                            selectedReceipt.paymentMethod)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    Người thu:
                                </span>
                                <span className="text-sm font-medium">
                                    {selectedReceipt?.employee.employeeName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">
                                    Trạng thái:
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${selectedReceipt && getStatusColor(selectedReceipt.status)}`}
                                >
                                    {selectedReceipt &&
                                        (STATUS_MAP[
                                            selectedReceipt.status as keyof typeof STATUS_MAP
                                        ] ||
                                            selectedReceipt.status)}
                                </span>
                            </div>
                            {selectedReceipt?.shortDescription && (
                                <div className="flex flex-col gap-1 pt-2 border-t">
                                    <span className="text-sm text-gray-500">
                                        Ghi chú:
                                    </span>
                                    <span className="text-sm">
                                        {selectedReceipt.shortDescription}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsViewDialogOpen(false)}
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xóa phiếu thu</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa phiếu thu này không?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Số phiếu:
                                </span>
                                <span className="text-sm font-semibold text-red-600">
                                    {selectedReceipt?.code}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Khách hàng:
                                </span>
                                <span className="text-sm font-medium">
                                    {selectedReceipt?.customer.customerName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Số tiền:
                                </span>
                                <span className="text-sm font-semibold">
                                    {selectedReceipt?.cost.toLocaleString()}đ
                                </span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDeleteReceipt}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Xóa phiếu thu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
