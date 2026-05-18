import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { InvoiceHeader } from './components/InvoiceHeader';
import { InvoiceStats } from './components/InvoiceStats';
import { InvoiceFilterBar } from './components/InvoiceFilterBar';
import { InvoiceTable } from './components/InvoiceTable';
import { ViewInvoiceDialog } from './components/ViewInvoiceDialog';
import { CreateInvoiceDialog } from './components/CreateInvoiceDialog';
import { EditInvoiceDialog } from './components/EditInvoiceDialog';
import { DeleteInvoiceDialog } from './components/DeleteInvoiceDialog';
import {
    InvoiceService,
    CreateInvoiceDto,
} from '../../services/invoice.service';
import { CustomerService } from '../../services/customer.service';
import { BookService } from '../../services/book.service';
import { VoucherService, Voucher } from '../../services/voucher.service';

export interface InvoiceBook {
    id: string | number;
    bookid: number;
    code: string;
    title: string;
    quantity: number;
    price: number;
}

export interface DiscountCode {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    description: string;
}

export interface Invoice {
    id: number;
    code: string;
    status: string;
    rawStatus?: string;
    cost: number;
    createdAt: string;
    customer: string;
    customerPhone: string;
    date: string;
    books: InvoiceBook[];
    totalItems: number;
    items: number;
    discountCode?: string;
    vouchers?: { voucherId: number }[];
}

export function InvoicePage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [availableBooks, setAvailableBooks] = useState<any[]>([]);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [priceFilter, setPriceFilter] = useState('Tất cả');

    const [isViewBooksOpen, setIsViewBooksOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
        null,
    );

    const [formData, setFormData] = useState({
        customer: '',
        customerPhone: '',
        date: '',
        status: '',
        selectedVoucherId: '0',
        books: [] as InvoiceBook[],
    });

    const [createFormData, setCreateFormData] = useState({
        invoiceNumber: '',
        temporaryCost : 0, 
        cost : 0, 
        customer: '',
        phoneNumber: '',
        customerId: '',
        date: new Date().toISOString().split('T')[0],
        books: [] as InvoiceBook[],
        status: 'Chưa thanh toán',
        selectedVoucherId: '0',
        discountCode: '',
        discountAmount: 0,
        paidAmount: 0,
    });

    const [newBook, setNewBook] = useState({
        id: '',
        code: '',
        title: '',
        quantity: 1,
        price: 0,
    });

    const mockDiscountCodes: DiscountCode[] = [
        {
            id: 1,
            code: 'GIAM10',
            type: 'percentage',
            value: 10,
            description: 'Giảm 10%',
        },
    ];

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [invoiceRes, customerRes, bookRes, voucherRes] =
                await Promise.all([
                    InvoiceService.getAll().catch(() => []),
                    CustomerService.getAllCustomers().catch(() => []),
                    BookService.getAllBook().catch(() => []),
                    VoucherService.getAllVoucher().catch(() => []),
                ]);

            const safeCustomers = Array.isArray(customerRes) ? customerRes : [];
            const safeVouchers = Array.isArray(voucherRes) ? voucherRes : [];

            const formattedInvoices: Invoice[] = (invoiceRes || []).map(
                (bill: any) => {
                    const totalQty =
                        bill.billDetail?.reduce(
                            (acc: number, item: any) =>
                                acc + (Number(item.quantity) || 0),
                            0,
                        ) || 0;

                    let displayCost = Number(bill.cost) || 0;

                    if (displayCost === 0 && bill.billDetail?.length > 0) {
                        displayCost = bill.billDetail.reduce(
                            (acc: number, item: any) => {
                                return (
                                    acc +
                                    Number(item.quantity) *
                                        Number(item.cost || 0)
                                );
                            },
                            0,
                        );
                        if (bill.voucherUsage && bill.voucherUsage.length > 0) {
                            bill.voucherUsage.forEach((v: any) => {
                                if (v.type === 'PERCENT') {
                                    displayCost =
                                        displayCost *
                                        (1 - Number(v.sale || 0) / 100);
                                } else {
                                    displayCost = Math.max(
                                        0,
                                        displayCost - Number(v.sale || 0),
                                    );
                                }
                            });
                        }
                    }

                    const foundCustomer = safeCustomers.find(
                        (c: any) => Number(c.id) === Number(bill.customerId),
                    );

                    const statusMap: Record<string, string> = {
                        COMPLETE: 'Đã thanh toán',
                        NOT_STARTED: 'Chưa thanh toán',
                        OVERDUE: 'Quá hạn',
                    };

                    const normalizedStatus =
                        statusMap[
                            (bill.status || '').toString().toUpperCase()
                        ] ||
                        bill.status ||
                        'Chưa thanh toán';

                    return {
                        id: Number(bill.id),
                        code: bill.code,
                        status: normalizedStatus,
                        rawStatus: bill.status,
                        cost: displayCost,
                        createdAt: bill.createdAt,
                        customer:
                            bill.customer?.name ||
                            foundCustomer?.name ||
                            'Khách hàng lẻ',
                        customerPhone:
                            bill.customer?.phone || foundCustomer?.phone || '',
                        date: bill.createdAt
                            ? new Date(bill.createdAt).toLocaleDateString(
                                  'vi-VN',
                              )
                            : 'N/A',
                        totalItems: totalQty,
                        items: totalQty,
                        books:
                            bill.billDetail?.map((item: any) => ({
                                id: item.id,
                                bookid: Number(item.id),
                                code: item.code || item.bookCode || '',
                                title: item.title,
                                quantity: Number(item.quantity),
                                price: Number(item.cost),
                            })) || [],
                        vouchers: bill.voucherUsage || [],
                        discountCode: bill.voucherUsage?.[0]?.code || '',
                    };
                },
            );

            setInvoices(formattedInvoices);
            setCustomers(safeCustomers);
            setVouchers(safeVouchers);
            setAvailableBooks(
                (bookRes || []).map((b: any) => ({
                    id: b.id?.toString() || '',
                    code: b.code,
                    title: b.title || 'Không tên',
                    price: Number(b.cost || 0),
                })),
            );
        } catch (error: any) {
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatInvoiceCode = (code: string): string => {
        const cleaned = code.trim().toUpperCase();
        const match = cleaned.match(/^HD(\d+)$/i);
        if (!match) {
            return cleaned;
        }
        const numberPart = Number(match[1]) || 0;
        return `HD${numberPart.toString().padStart(3, '0')}`;
    };

    const handleCreateInvoice = async () => {
        if (!createFormData.phoneNumber) {
            toast.error('Vui lòng nhập số điện thoại khách hàng');
            return;
        }

        if (createFormData.books.length === 0) {
            toast.error('Vui lòng thêm ít nhất một quyển sách');
            return;
        }

        const selectedCustomer = customers.find(
            (customer) => customer.phone.toString() === createFormData.phoneNumber,
        );

        try {
            setIsLoading(true);
            const payload: CreateInvoiceDto = {
                customerPhone: selectedCustomer?.phone || createFormData.phoneNumber,
                status:
                    createFormData.status === 'Đã thanh toán'
                        ? 'COMPLETE'
                        : 'NOT_STARTED',
                billDetails: createFormData.books.map((book) => ({
                    bookId: Number(book.bookid),
                    bookCode: book.code,
                    quantity: Number(book.quantity),
                })),
                vouchers:
                    createFormData.selectedVoucherId !== '0'
                        ? [
                              {
                                  voucherId: Number(
                                      createFormData.selectedVoucherId,
                                  ),
                              },
                          ]
                        : [],
                cost: createFormData.books.reduce(
                    (total, book) => total + book.quantity * book.price,
                    0,
                ),
                temporaryCost : createFormData.temporaryCost 
            };

            const invoice = await InvoiceService.create(payload);

            toast.success(`Tạo hóa đơn ${invoice.bill.code} thành công`);
            setIsCreateDialogOpen(false);
            resetCreateForm();
            await fetchData();
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Lỗi hệ thống không xác định';
            toast.error(Array.isArray(message) ? message[0] : message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetCreateForm = () => {
        setCreateFormData({
            cost : 0, 
            temporaryCost : 0, 
            invoiceNumber: '',
            customer: '',
            phoneNumber: '',
            customerId: '',
            date: new Date().toISOString().split('T')[0],
            books: [],
            status: 'Chưa thanh toán',
            selectedVoucherId: '0',
            discountCode: '',
            discountAmount: 0,
            paidAmount: 0,
        });
        setNewBook({ id: '', code: '', title: '', quantity: 1, price: 0 });
    };

    const handleEditInvoice = async () => {
        if (!selectedInvoice) return;

        try {
            setIsLoading(true);

            const statusMap: Record<string, string> = {
                'Đã thanh toán': 'COMPLETE',
                'Chưa thanh toán': 'NOT_STARTED',
                'Quá hạn': 'OVERDUE',
            };

            if (!formData.customerPhone?.trim()) {
                toast.error('Vui lòng nhập số điện thoại khách hàng');
                return;
            }

            const validBooks = selectedInvoice.books
                .filter(
                    (book) =>
                        Number(book.bookid) > 0 &&
                        Number(book.quantity) > 0 &&
                        book.code?.trim(),
                )
                .map((book) => ({
                    bookId: Number(book.bookid),
                    bookCode: book.code.trim(),
                    quantity: Number(book.quantity),
                }));

            if (validBooks.length === 0) {
                toast.error('Hóa đơn phải có ít nhất một sách hợp lệ');
                return;
            }

            const subtotal = selectedInvoice.books.reduce(
                (sum, book) => sum + book.quantity * book.price,
                0,
            );

            const selectedVoucher = vouchers.find(
                (voucher) =>
                    voucher.id.toString() === formData.selectedVoucherId,
            );

            let finalCost = subtotal;
            if (selectedVoucher) {
                finalCost =
                    selectedVoucher.type === 'PERCENT'
                        ? subtotal * (1 - selectedVoucher.sale / 100)
                        : Math.max(0, subtotal - selectedVoucher.sale);
            }

            const selectedCustomer = customers.find(
                (c) => c.phone === formData.customerPhone.trim(),
            );

            const updateDto = {
                code: formatInvoiceCode(selectedInvoice.code || ''),
                customerId: selectedCustomer?.id || 0,
                customerPhone: formData.customerPhone.trim(),
                status: statusMap[formData.status] || selectedInvoice.status,
                cost: Math.round(finalCost),
                billDetails: validBooks,
                vouchers:
                    formData.selectedVoucherId !== '0'
                        ? [{ voucherId: Number(formData.selectedVoucherId) }]
                        : [],
            };

            await InvoiceService.update(selectedInvoice.id, updateDto);

            toast.success('Cập nhật hóa đơn thành công');
            setIsEditDialogOpen(false);
            setSelectedInvoice(null);
            await fetchData();
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                'Cập nhật hóa đơn thất bại';
            toast.error(
                Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
            );
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotalItems = useCallback(() => {
        return createFormData.books.reduce((acc, b) => acc + b.quantity, 0);
    }, [createFormData.books]);

    const calculateTotalAmount = useCallback(() => {
        return createFormData.books.reduce(
            (acc, b) => acc + b.quantity * b.price,
            0,
        );
    }, [createFormData.books]);

    const calculateDiscountAmount = useCallback(() => {
        const sub = calculateTotalAmount();
        const v = vouchers.find(
            (v) => v.id.toString() === createFormData.selectedVoucherId,
        );
        if (!v) return 0;
        return v.type === 'PERCENT' ? (sub * v.sale) / 100 : v.sale;
    }, [calculateTotalAmount, vouchers, createFormData.selectedVoucherId]);

    const calculateFinalTotal = useCallback(() => {
        const sub = calculateTotalAmount();
        const v = vouchers.find(
            (v) => v.id.toString() === createFormData.selectedVoucherId,
        );
        return v
            ? v.type === 'PERCENT'
                ? sub * (1 - v.sale / 100)
                : Math.max(0, sub - v.sale)
            : sub;
    }, [calculateTotalAmount, vouchers, createFormData.selectedVoucherId]);

    const calculateDebtAmount = useCallback(() => {
        const finalTotal = calculateFinalTotal();
        const paid = Number(createFormData.paidAmount) || 0;
        return finalTotal - paid;
    }, [calculateFinalTotal, createFormData.paidAmount]);

    const calculateEditSubtotal = useCallback(() => {
        return (
            selectedInvoice?.books.reduce(
                (acc, b) => acc + b.quantity * b.price,
                0,
            ) || 0
        );
    }, [selectedInvoice]);

    const calculateEditDiscountAmount = useCallback(() => {
        const sub = calculateEditSubtotal();
        const v = vouchers.find(
            (v) => v.id.toString() === formData.selectedVoucherId,
        );
        if (!v) return 0;
        return v.type === 'PERCENT' ? (sub * v.sale) / 100 : v.sale;
    }, [calculateEditSubtotal, vouchers, formData.selectedVoucherId]);

    const calculateEditFinalTotal = useCallback(() => {
        const sub = calculateEditSubtotal();
        const v = vouchers.find(
            (v) => v.id.toString() === formData.selectedVoucherId,
        );
        if (!v) return sub;
        return v.type === 'PERCENT'
            ? sub * (1 - v.sale / 100)
            : Math.max(0, sub - v.sale);
    }, [calculateEditSubtotal, vouchers, formData.selectedVoucherId]);

    return (
        <div className="space-y-6">
            <InvoiceHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <>
                    <InvoiceStats invoices={invoices} />
                    <InvoiceFilterBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        priceFilter={priceFilter}
                        onPriceFilterChange={setPriceFilter}
                        onResetFilters={() => {
                            setSearchTerm('');
                            setStatusFilter('Tất cả');
                            setPriceFilter('Tất cả');
                        }}
                    />
                    <div className="bg-white rounded-lg shadow-sm">
                        <InvoiceTable
                            invoices={invoices.filter((inv) => {
                                const matchesSearch =
                                    inv.code
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase()) ||
                                    inv.customer
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase());
                                const matchesStatus =
                                    statusFilter === 'Tất cả' ||
                                    inv.status === statusFilter;
                                let matchesPrice = true;
                                if (priceFilter !== 'Tất cả') {
                                    const cost = inv.cost;
                                    if (priceFilter === 'Dưới 100k') {
                                        matchesPrice = cost < 100;
                                    } else if (priceFilter === '100k - 500k') {
                                        matchesPrice =
                                            cost >= 100 && cost <= 500;
                                    } else if (priceFilter === 'Trên 500k') {
                                        matchesPrice = cost > 500;
                                    }
                                }
                                return (
                                    matchesSearch &&
                                    matchesStatus &&
                                    matchesPrice
                                );
                            })}
                            onEdit={(inv) => {
                                setSelectedInvoice(inv);

                                const displayStatusMap: any = {
                                    COMPLETE: 'Đã thanh toán',
                                    NOT_STARTED: 'Chưa thanh toán',
                                    OVERDUE: 'Quá hạn',
                                };

                                let initialVoucherId = '0';
                                if (inv.vouchers && inv.vouchers.length > 0) {
                                    const firstVoucher: any = inv.vouchers[0];
                                    initialVoucherId = (
                                        firstVoucher.voucherId ||
                                        firstVoucher.id ||
                                        '0'
                                    ).toString();
                                }

                                setFormData({
                                    customer: inv.customer,
                                    customerPhone: inv.customerPhone,
                                    date: inv.date,
                                    status:
                                        displayStatusMap[inv.status] ||
                                        inv.status,
                                    selectedVoucherId: initialVoucherId,
                                    books: inv.books || [],
                                });

                                setIsEditDialogOpen(true);
                            }}
                            onDelete={(inv) => {
                                setSelectedInvoice(inv);
                                setIsDeleteDialogOpen(true);
                            }}
                            onViewBooks={(inv) => {
                                setSelectedInvoice(inv);
                                setIsViewBooksOpen(true);
                            }}
                            getStatusColor={(status) => {
                                switch (status) {
                                    case 'COMPLETE':
                                    case 'Đã thanh toán':
                                        return 'bg-green-100 text-green-800';
                                    case 'NOT_STARTED':
                                    case 'Chưa thanh toán':
                                        return 'bg-yellow-100 text-yellow-800';
                                    case 'OVERDUE':
                                    case 'Quá hạn':
                                        return 'bg-red-100 text-red-800';
                                    default:
                                        return 'bg-gray-100 text-gray-800';
                                }
                            }}
                        />
                    </div>
                </>
            )}

            <CreateInvoiceDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                formData={createFormData}
                setFormData={setCreateFormData}
                newBook={newBook}
                setNewBook={setNewBook}
                availableBooks={availableBooks}
                customers={customers}
                vouchers={vouchers}
                onAddBook={() => {
                    if (!newBook.id || newBook.quantity <= 0) {
                        toast.error(
                            'Vui lòng chọn sách và nhập số lượng hợp lệ',
                        );
                        return;
                    }

                    const selectedBook = availableBooks.find(
                        (book) => book.id === newBook.id,
                    );

                    if (!selectedBook) {
                        toast.error('Không tìm thấy thông tin sách');
                        return;
                    }

                    if (!selectedBook.code || selectedBook.code.trim() === '') {
                        toast.error('Sách này chưa có mã sách');
                        return;
                    }

                    setCreateFormData((prev) => {
                        const existingIndex = prev.books.findIndex(
                            (book) => book.bookid === Number(selectedBook.id),
                        );

                        if (existingIndex >= 0) {
                            const updatedBooks = [...prev.books];
                            updatedBooks[existingIndex] = {
                                ...updatedBooks[existingIndex],
                                quantity:
                                    updatedBooks[existingIndex].quantity +
                                    Number(newBook.quantity),
                            };

                            return {
                                ...prev,
                                books: updatedBooks,
                            };
                        }

                        return {
                            ...prev,
                            books: [
                                ...prev.books,
                                {
                                    id: selectedBook.id,
                                    bookid: Number(selectedBook.id),
                                    code: selectedBook.code,
                                    title: selectedBook.title,
                                    quantity: Number(newBook.quantity),
                                    price: Number(selectedBook.price),
                                },
                            ],
                        };
                    });

                    setNewBook({
                        id: '',
                        code: '',
                        title: '',
                        quantity: 1,
                        price: 0,
                    });
                }}
                onRemoveBook={(idx) =>
                    setCreateFormData((p: any) => ({
                        ...p,
                        books: p.books.filter((_: any, i: number) => i !== idx),
                    }))
                }
                onSave={handleCreateInvoice}
                calculateTotalItems={calculateTotalItems}
                calculateTotalAmount={calculateTotalAmount}
                calculateDiscountAmount={calculateDiscountAmount}
                calculateFinalTotal={calculateFinalTotal}
                calculateDebtAmount={calculateDebtAmount}
            />

            <EditInvoiceDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                selectedInvoice={selectedInvoice}
                formData={formData}
                setFormData={setFormData}
                onSave={handleEditInvoice}
                vouchers={vouchers}
                calculateEditSubtotal={calculateEditSubtotal}
                calculateEditDiscountAmount={calculateEditDiscountAmount}
                calculateEditFinalTotal={calculateEditFinalTotal}
            />

            <ViewInvoiceDialog
                isOpen={isViewBooksOpen}
                onOpenChange={setIsViewBooksOpen}
                selectedInvoice={selectedInvoice}
                mockDiscountCodes={mockDiscountCodes}
            />

            <DeleteInvoiceDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                selectedInvoice={selectedInvoice}
                onDelete={async () => {
                    if (!selectedInvoice) return;
                    try {
                        await InvoiceService.delete(selectedInvoice.id);
                        toast.success(`Đã xóa hóa đơn ${selectedInvoice.code}`);
                        setIsDeleteDialogOpen(false);
                        fetchData();
                    } catch (error: any) {
                        const backendError =
                            error.response?.data?.message ||
                            error.message ||
                            'Lỗi không xác định từ Server';
                        toast.error(
                            Array.isArray(backendError)
                                ? backendError[0]
                                : backendError,
                        );
                    }
                }}
            />
        </div>
    );
}
