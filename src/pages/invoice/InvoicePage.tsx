import { useState } from 'react';
import { toast } from 'sonner';
import { InvoiceHeader } from './components/InvoiceHeader';
import { InvoiceStats } from './components/InvoiceStats';
import { InvoiceFilterBar } from './components/InvoiceFilterBar';
import { InvoiceTable } from './components/InvoiceTable';
import { ViewInvoiceDialog } from './components/ViewInvoiceDialog';
import { CreateInvoiceDialog } from './components/CreateInvoiceDialog';
import { EditInvoiceDialog } from './components/EditInvoiceDialog';
import { DeleteInvoiceDialog } from './components/DeleteInvoiceDialog';

export interface InvoiceBook {
    title: string;
    quantity: number;
    price: number;
}

export interface DiscountCode {
    id: string;
    code: string;
    description: string;
    type: 'percentage' | 'fixed';
    value: number;
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    customer: string;
    date: string;
    totalAmount: number;
    status: 'Đã thanh toán' | 'Chưa thanh toán' | 'Quá hạn';
    items: number;
    books: InvoiceBook[];
    discountCode?: string;
    discountAmount?: number;
}

const mockDiscountCodes: DiscountCode[] = [
    {
        id: '1',
        code: 'SUMMER2026',
        description: 'Giảm 10% - Khuyến mãi mùa hè',
        type: 'percentage',
        value: 10,
    },
    {
        id: '2',
        code: 'NEWCUSTOMER',
        description: 'Giảm 50,000đ - Khách hàng mới',
        type: 'fixed',
        value: 50000,
    },
    {
        id: '3',
        code: 'VIP20',
        description: 'Giảm 20% - Khách hàng VIP',
        type: 'percentage',
        value: 20,
    },
    {
        id: '4',
        code: 'FREESHIP',
        description: 'Giảm 30,000đ - Miễn phí ship',
        type: 'fixed',
        value: 30000,
    },
    {
        id: '5',
        code: 'MEGA50',
        description: 'Giảm 50% - Siêu khuyến mãi',
        type: 'percentage',
        value: 50,
    },
];

const mockInvoices: Invoice[] = [
    {
        id: 1,
        invoiceNumber: 'HD001',
        customer: 'Nguyễn Văn A',
        date: '01/03/2026',
        totalAmount: 350000,
        status: 'Đã thanh toán',
        items: 3,
        books: [
            { title: 'Sách A', quantity: 1, price: 100000 },
            { title: 'Sách B', quantity: 2, price: 125000 },
        ],
    },
    {
        id: 2,
        invoiceNumber: 'HD002',
        customer: 'Trần Thị B',
        date: '02/03/2026',
        totalAmount: 520000,
        status: 'Đã thanh toán',
        items: 5,
        books: [
            { title: 'Sách C', quantity: 1, price: 100000 },
            { title: 'Sách D', quantity: 2, price: 125000 },
            { title: 'Sách E', quantity: 2, price: 195000 },
        ],
    },
    {
        id: 3,
        invoiceNumber: 'HD003',
        customer: 'Lê Văn C',
        date: '03/03/2026',
        totalAmount: 280000,
        status: 'Chưa thanh toán',
        items: 2,
        books: [
            { title: 'Sách F', quantity: 1, price: 100000 },
            { title: 'Sách G', quantity: 1, price: 180000 },
        ],
    },
    {
        id: 4,
        invoiceNumber: 'HD004',
        customer: 'Phạm Thị D',
        date: '04/03/2026',
        totalAmount: 420000,
        status: 'Quá hạn',
        items: 4,
        books: [
            { title: 'Sách H', quantity: 1, price: 100000 },
            { title: 'Sách I', quantity: 1, price: 125000 },
            { title: 'Sách J', quantity: 1, price: 195000 },
            { title: 'Sách K', quantity: 1, price: 100000 },
        ],
    },
];

export function InvoicePage() {
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
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
        date: '',
        status: 'Chưa thanh toán' as Invoice['status'],
        discountCode: '',
    });
    const [createFormData, setCreateFormData] = useState({
        invoiceNumber: '',
        customer: '',
        date: new Date().toISOString().split('T')[0],
        books: [] as InvoiceBook[],
        status: 'Chưa thanh toán' as Invoice['status'],
        discountCode: '',
        discountAmount: 0,
    });
    const [newBook, setNewBook] = useState({
        title: '',
        quantity: 1,
        price: 0,
    });

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setPriceFilter('all');
        toast.info('Đã xóa tất cả bộ lọc');
    };

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch =
            invoice.invoiceNumber
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || invoice.status === statusFilter;

        let matchesPrice = true;
        const amount = invoice.totalAmount;

        if (priceFilter === 'under100') {
            matchesPrice = amount < 100000;
        } else if (priceFilter === '100-200') {
            matchesPrice = amount >= 100000 && amount <= 200000;
        } else if (priceFilter === '200-500') {
            matchesPrice = amount > 200000 && amount <= 500000;
        } else if (priceFilter === 'over500') {
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
            discountCode: invoice.discountCode || '',
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
                    invoice.id === selectedInvoice.id
                        ? updatedInvoice
                        : invoice,
                ),
            );
            setIsEditDialogOpen(false);
            toast.success('Hóa đơn đã được cập nhật thành công!');
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
            toast.success('Hóa đơn đã được xóa thành công!');
        }
    };

    const handleAddBook = () => {
        if (newBook.title && newBook.quantity > 0 && newBook.price > 0) {
            setCreateFormData({
                ...createFormData,
                books: [...createFormData.books, newBook],
            });
            setNewBook({ title: '', quantity: 1, price: 0 });
            toast.success('Đã thêm sách vào danh sách!');
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin sách!');
        }
    };

    const handleRemoveBook = (index: number) => {
        setCreateFormData({
            ...createFormData,
            books: createFormData.books.filter((_, idx) => idx !== index),
        });
        toast.success('Đã xóa sách khỏi danh sách!');
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
        if (discount.type === 'percentage') {
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
        if (discount.type === 'percentage') {
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
            toast.error('Vui lòng nhập đầy đủ thông tin khách hàng và ngày!');
            return;
        }
        if (createFormData.books.length === 0) {
            toast.error('Vui lòng thêm ít nhất một sách vào hóa đơn!');
            return;
        }

        const newInvoice: Invoice = {
            id: invoices.length + 1,
            invoiceNumber: `HD${String(invoices.length + 1).padStart(3, '0')}`,
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
            invoiceNumber: '',
            customer: '',
            date: new Date().toISOString().split('T')[0],
            books: [],
            status: 'Chưa thanh toán',
            discountCode: '',
            discountAmount: 0,
        });
        toast.success('Hóa đơn mới đã được tạo thành công!');
    };

    const getStatusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'Đã thanh toán':
                return 'bg-green-100 text-green-800';
            case 'Chưa thanh toán':
                return 'bg-yellow-100 text-yellow-800';
            case 'Quá hạn':
                return 'bg-red-100 text-red-800';
        }
    };

    return (
        <div className="space-y-6">
            <InvoiceHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
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
            <InvoiceTable
                invoices={filteredInvoices}
                onEdit={handleEditInvoiceOpen}
                onDelete={handleDeleteInvoiceOpen}
                onViewBooks={openViewBooks}
                getStatusColor={getStatusColor}
            />

            <ViewInvoiceDialog
                isOpen={isViewBooksOpen}
                onOpenChange={setIsViewBooksOpen}
                selectedInvoice={selectedInvoice}
                mockDiscountCodes={mockDiscountCodes}
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
                mockDiscountCodes={mockDiscountCodes}
                calculateTotalItems={calculateTotalItems}
                calculateTotalAmount={calculateTotalAmount}
                calculateDiscountAmount={calculateDiscountAmount}
                calculateFinalTotal={calculateFinalTotal}
                handleDiscountCodeChange={handleDiscountCodeChange}
            />

            <EditInvoiceDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                selectedInvoice={selectedInvoice}
                formData={formData}
                setFormData={setFormData}
                onSave={handleEditInvoice}
                mockDiscountCodes={mockDiscountCodes}
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
