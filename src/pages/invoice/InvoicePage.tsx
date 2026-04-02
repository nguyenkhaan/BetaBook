
import { toast } from 'sonner';
import { InvoiceHeader } from './components/InvoiceHeader';
import { InvoiceStats } from './components/InvoiceStats';
import { InvoiceFilterBar } from './components/InvoiceFilterBar';
import { InvoiceTable } from './components/InvoiceTable';
import { ViewInvoiceDialog } from './components/ViewInvoiceDialog';
import { CreateInvoiceDialog } from './components/CreateInvoiceDialog';
import { EditInvoiceDialog } from './components/EditInvoiceDialog';
import { DeleteInvoiceDialog } from './components/DeleteInvoiceDialog';
import { mockDiscountCodes, mockInvoices } from '../invoice/InvoiceData';

import {
    InvoiceService,
    CreateInvoiceDto,
} from '../../services/invoice.service';
import { useState, useEffect } from 'react';

export interface InvoiceBook {
    title: string;
    bookid: number;
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
    code: string;
    customer: string;
    date: string;
    cost: number;
    status: 'Đã thanh toán' | 'Chưa thanh toán' | 'Quá hạn';
    items: number;
    books: InvoiceBook[];
    discountCode?: string;
    discountAmount?: number;
}

export function InvoicePage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [customers, setCustomers] = useState<any[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isViewBooksOpen, setIsViewBooksOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
        null,
    );


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

    useEffect(() => {
        loadInvoices();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setCustomers([{ id: 1, name: 'Khách hàng lẻ' }]);
            } catch (error) {
                console.error('Lỗi lấy danh sách khách hàng');
            }
        };
        fetchCustomers();
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
                billDetails: createFormData.books.map((b) => ({
                    bookId: b.bookid,
                    quantity: b.quantity,
                })),
                vouchers: createFormData.discountCode ? [{ voucherId: 1 }] : [],
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
        phoneNumber: '', 
        date: new Date().toISOString().split('T')[0],
        books: [] as InvoiceBook[],
        status: 'Chưa thanh toán' as Invoice['status'],
        discountCode: '',
        discountAmount: 0,
    });
    
    const [newBook, setNewBook] = useState({
        bookid: 0, 
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
                    status: formData.status,
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
            newBook.bookid &&
            newBook.title &&
            newBook.quantity > 0 &&
            newBook.price > 0
        ) {
            setCreateFormData({
                ...createFormData,
                books: [...createFormData.books, newBook as InvoiceBook],
            });
            setNewBook({ bookid: 0, title: '', quantity: 1, price: 0 });
            toast.success('Đã thêm sách vào danh sách!');
        } else {
            toast.error('Vui lòng nhập đầy đủ thông tin sách (bao gồm ID)!');
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
               customers={customers}
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