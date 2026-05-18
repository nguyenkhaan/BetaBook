import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Statistic } from './components/Statistic';
import { FilterBar } from './components/FilterBar';
import { CustomerTable } from './components/CustomerTable';
import { CustomerDialogs } from './components/CustomerDialogs';
import { CustomerService } from '../../services/customer.service';
export interface Customer {
    id: number;
    code : string; 
    name: string;
    email: string;
    phone: string;
    password : string; 
    totalOrders: number;
    totalSpent: number;
    joinDate: string;
    grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
}

export function CustomersPage() {
    // khởi tạo một state rỗng
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<string>('Tất cả');
    const [selectedDate, setSelectedDate] = useState<string>('');
    // UI state
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        password : '', 
        email: '',
        phone: '',
        grade: 'BRONZE' as Customer['grade'],
    });

    // hàm lấy dữ liệu từ be

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await CustomerService.getAllCustomers();
            console.log("Customer Data: " , data) 
            setCustomers(data);
        } catch (err: any) {
            const status = err.response?.status;
            const message =
                err.response?.data?.message ||
                'Không thể tải danh sách khách hàng ';
            console.error(`Lỗi ${status} : ${message}`);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );

    const handleCreateCustomer = async () => {
        try {
            await CustomerService.createCustomer(formData);
            toast.success('Thêm khách hàng mới thành công');
            setIsCreateDialogOpen(false);
            fetchData();
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || 'Không thể thêm khách hàng mới',
            );
        }
    };

    const handleEditCustomer = async () => {
        
        if (selectedCustomer) {
            try {
                await CustomerService.updateCustomer(
                    selectedCustomer.id,
                    formData,
                );
                toast.success('Cập nhật thông tin khách hàng thành công');
                setIsEditDialogOpen(false);
                fetchData();
            } catch (err: any) {
                toast.error(
                    err.response?.data.message ||
                        'Không thể cập nhật thông tin khách hàng',
                );
            }
        }
    };

    const handleDeleteCustomer = async () => {
        if (selectedCustomer) {
            try {
                await CustomerService.deleteCustomer(selectedCustomer.id);
                toast.success('Xoá thông tin khách hàng thành công');
                setIsEditDialogOpen(false);
                fetchData();
            } catch (err: any) {
                toast.error(
                    err.response?.data?.message ||
                        'Không thễ xoá thông tin khách hàng. Vui lòng kiểm tra lại!',
                );
            }
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedGrade('Tất cả');
        setSelectedDate('');
    };

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm);
        const matchesLevel =
            selectedGrade === 'Tất cả' || customer.grade === selectedGrade;
        const matchesDate = !selectedDate || customer.joinDate === selectedDate;
        return matchesSearch && matchesLevel && matchesDate;
    });

    const calculateLevel = (totalSpent: number): Customer['grade'] => {
        if (totalSpent >= 5000000) return 'DIAMOND';
        if (totalSpent >= 2500000) return 'GOLD';
        if (totalSpent >= 1000000) return 'SILVER';
        return 'BRONZE';
    };

    const isNewCustomer = (joinDate: string): boolean => {
        const join = new Date(joinDate);
        const today = new Date('2026-03-11');
        const diffTime = Math.abs(today.getTime() - join.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 30;
    };

    const getLevelColor = (grade: Customer['grade']) => {
        switch (grade) {
            case 'GOLD':
                return 'bg-yellow-100 text-yellow-800';
            case 'DIAMOND':
                return 'bg-blue-100 text-blue-800';
            case 'SILVER': 
                return 'bg-gray-100 text-gray-800' 
            case 'BRONZE': 
                return 'bg-orange-100 text-orange-800'
            default:
                return 'text-black';
        }
    };

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewDialogOpen(true);
    };

    const handleEditAction = (customer: Customer) => {
        setSelectedCustomer(customer);
        setFormData({ ...customer });
        setIsEditDialogOpen(true);
    };

    const handleDeleteAction = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý khách hàng
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý thông tin khách hàng của Beta Book
                    </p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    <Plus className="w-4 h-4" /> Thêm khách hàng
                </Button>
            </div>

            <Statistic
                totalCustomers={customers.length}
                vipCustomers={
                    customers.filter((c) => c.grade === 'DIAMOND').length
                }
                totalRevenue={customers.reduce(
                    (sum, c) => sum + c.totalSpent,
                    0,
                )}
                newCustomers={
                    customers.filter((c) => isNewCustomer(c.joinDate)).length
                }
            />

            <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedLevel={selectedGrade}
                setSelectedLevel={setSelectedGrade}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handleResetFilters={handleResetFilters}
            />

            <CustomerTable
                customers={filteredCustomers}
                onView={handleViewCustomer}
                onEdit={handleEditAction}
                onDelete={handleDeleteAction}
                getLevelColor={getLevelColor}
            />

            <CustomerDialogs
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                isEditDialogOpen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                isDeleteDialogOpen={isDeleteDialogOpen}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                selectedCustomer={selectedCustomer}
                formData={formData}
                setFormData={setFormData}
                handleCreateCustomer={handleCreateCustomer}
                handleEditCustomer={handleEditCustomer}
                handleDeleteCustomer={handleDeleteCustomer}
                calculateLevel={calculateLevel}
            />
        </div>
    );
}
