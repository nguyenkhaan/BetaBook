import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { Statistic } from './components/Statistic';
import { FilterBar } from './components/FilterBar';
import { CustomerTable } from './components/CustomerTable';
import { CustomerDialogs } from './components/CustomerDialogs';

export interface Customer {
    id: number;
    customerCode: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    joinDate: string;
    level: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim cương';
}

const mockCustomers: Customer[] = [
    {
        id: 1,
        customerCode: 'KH001',
        name: 'Nguyễn Văn A',
        email: 'nguyen.vana@email.com',
        phone: '0901234567',
        totalOrders: 12,
        totalSpent: 2500000,
        joinDate: '2025-01-15',
        level: 'Vàng',
    },
    {
        id: 2,
        customerCode: 'KH002',
        name: 'Trần Thị B',
        email: 'tran.thib@email.com',
        phone: '0912345678',
        totalOrders: 8,
        totalSpent: 1800000,
        joinDate: '2025-01-20',
        level: 'Bạc',
    },
    {
        id: 3,
        customerCode: 'KH003',
        name: 'Lê Văn C',
        email: 'le.vanc@email.com',
        phone: '0923456789',
        totalOrders: 25,
        totalSpent: 5200000,
        joinDate: '2024-12-05',
        level: 'Kim cương',
    },
    {
        id: 4,
        customerCode: 'KH004',
        name: 'Phạm Thị D',
        email: 'pham.thid@email.com',
        phone: '0934567890',
        totalOrders: 15,
        totalSpent: 3100000,
        joinDate: '2025-01-10',
        level: 'Vàng',
    },
    {
        id: 5,
        customerCode: 'KH005',
        name: 'Hoàng Văn E',
        email: 'hoang.vane@email.com',
        phone: '0945678901',
        totalOrders: 5,
        totalSpent: 950000,
        joinDate: '2025-02-01',
        level: 'Đồng',
    },
];

export function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('Tất cả');
    const [selectedDate, setSelectedDate] = useState<string>('');

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );

    const [formData, setFormData] = useState({
        customerCode: '',
        name: '',
        email: '',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0,
        level: 'Đồng' as Customer['level'],
    });

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedLevel('Tất cả');
        setSelectedDate('');
    };

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm);
        const matchesLevel =
            selectedLevel === 'Tất cả' || customer.level === selectedLevel;
        const matchesDate = !selectedDate || customer.joinDate === selectedDate;
        return matchesSearch && matchesLevel && matchesDate;
    });

    const calculateLevel = (totalSpent: number): Customer['level'] => {
        if (totalSpent >= 5000000) return 'Kim cương';
        if (totalSpent >= 2500000) return 'Vàng';
        if (totalSpent >= 1000000) return 'Bạc';
        return 'Đồng';
    };

    const isNewCustomer = (joinDate: string): boolean => {
        const join = new Date(joinDate);
        const today = new Date('2026-03-11');
        const diffTime = Math.abs(today.getTime() - join.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 30;
    };

    const getLevelColor = (level: Customer['level']) => {
        switch (level) {
            case 'Vàng':
                return 'bg-yellow-100 text-yellow-800';
            case 'Kim cương':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCreateCustomer = () => {
        const newCustomer: Customer = {
            ...formData,
            id: customers.length + 1,
            customerCode: `KH${String(customers.length + 1).padStart(3, '0')}`,
        };
        setCustomers([...customers, newCustomer]);
        setIsCreateDialogOpen(false);
        toast.success('Khách hàng đã được thêm thành công!');
    };

    const handleEditCustomer = () => {
        if (selectedCustomer) {
            setCustomers(
                customers.map((c) =>
                    c.id === selectedCustomer.id ? { ...c, ...formData } : c,
                ),
            );
            setIsEditDialogOpen(false);
            toast.success('Khách hàng đã được cập nhật thành công!');
        }
    };

    const handleDeleteCustomer = () => {
        if (selectedCustomer) {
            setCustomers(customers.filter((c) => c.id !== selectedCustomer.id));
            setIsDeleteDialogOpen(false);
            toast.success('Khách hàng đã được xóa thành công!');
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
                    customers.filter((c) => c.level === 'Kim cương').length
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
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
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
