import { toast } from 'sonner';
import { InvoiceHeader } from './components/InvoiceHeader';
import { InvoiceStats } from './components/InvoiceStats';
import { InvoiceFilterBar } from './components/InvoiceFilterBar';
import { InvoiceTable } from './components/InvoiceTable';
import { ViewInvoiceDialog } from './components/ViewInvoiceDialog';
import { CreateInvoiceDialog } from './components/CreateInvoiceDialog';
import { EditInvoiceDialog } from './components/EditInvoiceDialog';
import { DeleteInvoiceDialog } from './components/DeleteInvoiceDialog';
// import { mockDiscountCodes, mockInvoices } from '../invoice/InvoiceData';
import {
    InvoiceService,
    CreateInvoiceDto,
    Voucher,
} from '../../services/invoice.service';
import { CustomerService } from '../../services/customer.service';
import { BookService } from '../../services/book.service';
import { useState, useEffect } from 'react';
export interface InvoiceBook {
    category : string, 
    code : string, 
    coverImage : string | null, 
    cost: number, 
    title : string, 
    year: number; 
    bookId : string; 
    quantity : number 
}

interface InvoiceCustomer {
    id: number;
    name: string;
    phone: string;
}

export interface DiscountCode {
    id: number;
    code: string;
    name : string; 
    description: string;
    type: 'PERCENT' | 'VND';
    value: number;
}

export interface Invoice {
    id: number;
    code: string;
    customer : string; //customer name 
    cost: number;
    status: 'COMPLETE' | 'NOT_STARTED' | 'OVERDUE';
    items: number;
    billDetail: InvoiceBook[];
    updatedAt : string 
    voucherUsage : DiscountCode[] 
}

export function InvoicePage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [customers, setCustomers] = useState<InvoiceCustomer[]>([]);
    const [books, setBooks] = useState<InvoiceBook[]>([]);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isViewBooksOpen, setIsViewBooksOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
        null,
    );
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [formData, setFormData] = useState({
        customer: '',
        phone: '',
        date: '',
        status: 'COMPLETE' as Invoice["status"], 
        voucherId: null as number | null,
        billDetail: [] as InvoiceBook[],
        cost : 0 
    });

    const loadInvoices = async () => {
        setIsLoading(true);
        try {
            const data = await InvoiceService.getAll();
            setInvoices(data);
        } catch (error) {
            toast.error('Không thể tải danh sách hóa đơn!');
        } finally {
            setIsLoading(false);
        }
    };

    const loadVouchers = async () => {
        try {
            const data = await InvoiceService.getVouchers();
            setVouchers(data);
        } catch (error) {
            console.error('Không thể tải danh sách voucher:', error);
        }
    };

    const loadCustomers = async () => {
        try {
            const data = await CustomerService.getAllCustomers();
            setCustomers(
                data.map((customer) => ({
                    id: customer.id,
                    name: customer.name,
                    phone: customer.phone,
                })),
            );
        } catch (error) {
            console.error('Không thể tải danh sách khách hàng:', error);
        }
    };

    const loadBooks = async () => {
        try {
            const data = await BookService.getAllBook();
            setBooks(
                data.map((book) => ({
                    bookId: String(book.id),
                    code: book.code,
                    title: book.title,
                    category: book.category,
                    coverImage: book.coverImage || null,
                    cost: Number(book.cost) || 0,
                    year: Number(book.year) || new Date().getFullYear(),
                    quantity: 1,
                })),
            );
        } catch (error) {
            console.error('Không thể tải danh sách sách:', error);
        }
    };

    useEffect(() => {
        loadInvoices();
        loadVouchers();
        loadCustomers();
        loadBooks();
    }, []);

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch =
            (invoice.code || invoice.invoiceNumber || '') // BE trả về code
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (invoice.customer || '')
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || invoice.status === statusFilter;

        let matchesPrice = true;
        const amount = invoice.cost || invoice.totalAmount; // BE trả về cost

        if (priceFilter === 'under100') matchesPrice = amount < 100000;
        else if (priceFilter === '100-200')
            matchesPrice = amount >= 100000 && amount <= 200000;
        else if (priceFilter === '200-500')
            matchesPrice = amount > 200000 && amount <= 500000;
        else if (priceFilter === 'over500') matchesPrice = amount > 500000;

        return matchesSearch && matchesStatus && matchesPrice;
    });

    const handleCreateInvoice = async () => {
        if (!createFormData.customer || createFormData.books.length === 0) {
            toast.error('Vui lòng nhập đầy đủ thông tin và chọn sách!');
            return;
        }

        try {
            const dto: CreateInvoiceDto = {
                code: createFormData.invoiceNumber || `HD${Date.now()}`,
                customerId: Number(createFormData.customer) || 1, // Bạn cần ID khách hàng thực tế từ một ô Select khách hàng
                status: createFormData.status as any,
                billDetail: createFormData.books.map((b) => ({
                    bookId: b.bookId,
                    quantity: b.quantity,
                })),
                voucherUsage: createFormData.voucherId ? [{ voucherId: createFormData.voucherId }] : []
            };

            await InvoiceService.create(dto);
            toast.success('Tạo hóa đơn thành công!');
            setIsCreateDialogOpen(false);
            loadInvoices(); // Tải lại danh sách từ server
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Lỗi khi tạo hóa đơn!',
            );
        }
    };

    const [createFormData, setCreateFormData] = useState<{
        invoiceNumber: string;
        customer: string;
        phoneNumber: string;
        date: string;
        books: InvoiceBook[];
        status: Invoice['status'];
        voucherId: number | null;
        discountAmount: number;
        cost : number; 
    }>({
        invoiceNumber: '',
        customer: '',
        phoneNumber: '',
        date: new Date().toISOString().split('T')[0],
        books: [] as InvoiceBook[],
        status: 'COMPLETE',
        voucherId: null,
        discountAmount: 0,
        cost : 0 
    });

    const [newBook, setNewBook] = useState({
        bookId: '',
        code: '',
        title: '',
        quantity: 1,
        cost: 0,
    });
    const [editNewBook, setEditNewBook] = useState({
        bookId: '',
        code: '',
        title: '',
        quantity: 1,
        cost: 0,
    });

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPriceFilter('all');
        toast.info('Đã xóa tất cả bộ lọc');
    };

    const openViewBooks = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsViewBooksOpen(true);
    };

    const handleEditInvoiceOpen = (invoice: Invoice) => {
        const matchedCustomer = customers.find(
            (customer) => customer.name === invoice.customer,
        );
        setSelectedInvoice(invoice);
        setFormData({
            customer: invoice.customer,
            phone: matchedCustomer?.phone || '',
            date: invoice.updatedAt.split('T')[0], // Assuming date is updatedAt
            status: invoice.status,
            voucherId: invoice.voucherUsage?.[0]?.id || null,
            billDetail: invoice.billDetail,
            cost : invoice.cost
        });
        setEditNewBook({
            bookId: '',
            code: '',
            title: '',
            quantity: 1,
            cost: 0,
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteInvoiceOpen = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteInvoice = async () => {
        if (selectedInvoice) {
            try {
                await InvoiceService.delete(selectedInvoice.id);
                toast.success('Hóa đơn đã được xóa!');
                setIsDeleteDialogOpen(false);
                loadInvoices();
            } catch (error) {
                toast.error('Lỗi khi xóa hóa đơn!');
            }
        }
    };

    const handleEditInvoice = async () => {
        if (selectedInvoice) {
            try {
                const dto = {
                    cost: calculateEditFinalTotal(),
                    customerPhone: formData.phone,
                    status: formData.status,
                    voucherUsage: formData.voucherId ? [{ voucherId: formData.voucherId }] : [],
                    billDetails: formData.billDetail.map(b => ({
                        bookCode: b.code,
                        quantity: b.quantity,
                    })),
                };
                await InvoiceService.update(selectedInvoice.id, dto);
                toast.success('Cập nhật thành công!');
                setIsEditDialogOpen(false);
                loadInvoices();
            } catch (error) {
                toast.error('Lỗi khi cập nhật!');
            }
        }
    };

    const handleAddBook = () => {
        if (
            newBook.bookId &&
            newBook.code &&
            newBook.title &&
            newBook.quantity > 0 &&
            newBook.cost > 0
        ) {
            setCreateFormData({
                ...createFormData,
                books: [...createFormData.books, newBook as InvoiceBook],
            });
            setNewBook({ bookId: '', code: '', title: '', quantity: 1, cost: 0 });
            toast.success('Đã thêm sách vào danh sách!');
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin sách (bao gồm mã sách)!');
        }
    };

    const handleEditAddBook = () => {
        if (
            editNewBook.bookId &&
            editNewBook.code &&
            editNewBook.title &&
            editNewBook.quantity > 0 &&
            editNewBook.cost > 0
        ) {
            const existingBookIndex = formData.billDetail.findIndex(
                (book) => book.code === editNewBook.code,
            );

            if (existingBookIndex >= 0) {
                const updatedBillDetail = [...formData.billDetail];
                updatedBillDetail[existingBookIndex] = {
                    ...updatedBillDetail[existingBookIndex],
                    quantity:
                        updatedBillDetail[existingBookIndex].quantity +
                        editNewBook.quantity,
                };

                setFormData({
                    ...formData,
                    billDetail: updatedBillDetail,
                });
            } else {
                setFormData({
                    ...formData,
                    billDetail: [...formData.billDetail, editNewBook as InvoiceBook],
                });
            }

            setEditNewBook({
                bookId: '',
                code: '',
                title: '',
                quantity: 1,
                cost: 0,
            });
            toast.success('Đã thêm sách vào hóa đơn!');
        } else {
            toast.error('Vui lòng chọn sách hợp lệ trước khi thêm!');
        }
    };

    const handleRemoveBook = (index: number) => {
        setCreateFormData({
            ...createFormData,
            books: createFormData.books.filter((_, idx) => idx !== index),
        });
        toast.success('Đã xóa sách khỏi danh sách!');
    };

    const handleEditRemoveBook = (index: number) => {
        setFormData({
            ...formData,
            billDetail: formData.billDetail.filter((_, idx) => idx !== index),
        });
        toast.success('Đã xóa sách khỏi hóa đơn!');
    };

    const calculateTotalAmount = () => {
        return createFormData.books.reduce(
            (total, book) => total + book.quantity * Number(book.cost),
            0,
        );
    };

    const calculateDiscountAmount = () => {
        if (!createFormData.voucherId) return 0;

        const discount = vouchers.find(
            (v) => v.id === createFormData.voucherId,
        );
        if (!discount) return 0;

        const subtotal = calculateTotalAmount();
        if (discount.type === 'PERCENT') {
            return Math.round((subtotal * discount.sale) / 100);
        } else {
            return discount.sale;
        }
    };

    const calculateEditDiscountAmount = () => {
        if (!formData.voucherId) return 0;

        const discount = vouchers.find(
            (v) => v.id === formData.voucherId,
        );
        if (!discount) return 0;

        const subtotal = formData.billDetail.reduce(
            (total, book) => total + book.quantity * book.cost,
            0,
        );
        if (discount.type === 'PERCENT') {
            return Math.round((subtotal * discount.sale) / 100);
        } else {
            return discount.sale;
        }
    };

    const calculateEditSubtotal = () => {
        return formData.billDetail.reduce(
            (total, book) => total + book.quantity * book.cost,
            0,
        );
    };

    const calculateEditFinalTotal = () => {
        const result = calculateEditSubtotal() - calculateEditDiscountAmount();
        // setFormData({
        //     ...formData, 
        //     cost : result 
        // })
        return result 
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

    const handleVoucherChange = (voucherId: string) => {
        setCreateFormData({
            ...createFormData,
            voucherId: voucherId ? Number(voucherId) : null,
        });
    };

    const getStatusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'COMPLETE':
                return 'bg-green-100 text-green-800';
            case 'NOT_STARTED':
                return 'bg-yellow-100 text-yellow-800';
            case 'OVERDUE':
                return 'bg-red-100 text-red-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header: Nút tạo hóa đơn */}
            <InvoiceHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

            {/* Hiển thị Loading hoặc Nội dung chính */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">
                        Đang tải danh sách hóa đơn từ hệ thống...
                    </p>
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
                        onResetFilters={handleResetFilters}
                    />

                    <div className="bg-white rounded-lg shadow-sm">
                        <InvoiceTable
                            invoices={filteredInvoices}
                            onEdit={handleEditInvoiceOpen}
                            onDelete={handleDeleteInvoiceOpen}
                            onViewBooks={openViewBooks}
                            getStatusColor={getStatusColor}
                        />
                    </div>
                </>
            )}

            <ViewInvoiceDialog
                isOpen={isViewBooksOpen}
                onOpenChange={setIsViewBooksOpen}
                selectedInvoice={selectedInvoice}
                // mockDiscountCodes={mockDiscountCodes}
            />

            <CreateInvoiceDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                formData={createFormData}
                setFormData={setCreateFormData}
                newBook={newBook}
                setNewBook={setNewBook}
                onAddBook={handleAddBook}
                onRemoveBook={handleRemoveBook}
                onSave={handleCreateInvoice}
                // mockDiscountCodes={mockDiscountCodes}
                vouchers={vouchers}
                customers={customers}
                calculateTotalItems={calculateTotalItems}
                calculateTotalAmount={calculateTotalAmount}
                calculateDiscountAmount={calculateDiscountAmount}
                calculateFinalTotal={calculateFinalTotal}
                handleVoucherChange={handleVoucherChange}
            />

            <EditInvoiceDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                selectedInvoice={selectedInvoice}
                formData={formData}
                setFormData={setFormData}
                customers={customers}
                books={books}
                editNewBook={editNewBook}
                setEditNewBook={setEditNewBook}
                onAddBook={handleEditAddBook}
                onRemoveBook={handleEditRemoveBook}
                onSave={handleEditInvoice}
                vouchers={vouchers}
                calculateEditSubtotal={calculateEditSubtotal}
                calculateEditDiscountAmount={calculateEditDiscountAmount}
                calculateEditFinalTotal={calculateEditFinalTotal}
            />

            <DeleteInvoiceDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                selectedInvoice={selectedInvoice}
                onDelete={handleDeleteInvoice}
            />
        </div>
    );
}
