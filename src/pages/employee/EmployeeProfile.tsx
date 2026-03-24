import { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    Building,
    Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileCard } from './components/ProfileCard';
import { InfoSection } from './components/InfoSection';
import { ChangePasswordDialog } from './components/ChangePasswordDialog';

export function EmployeeProfile() {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Mock employee data - in real app, this would come from context/props
    const employee = {
        id: 1,
        name: 'A Nguyen Van',
        email: 'nguyen.vana@company.com',
        phone: '0901234567',
        position: 'Quản lý cửa hàng',
        department: 'Quản lý',
        joinDate: '01/01/2024',
        status: 'Đang làm việc',
        salary: 15000000,
        avatar: '',
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Mật khẩu mới không khớp!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }
        // In real app, call API to change password
        toast.success('Đổi mật khẩu thành công!');
        setIsChangePasswordOpen(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    const contactInfo = [
        { icon: Mail, label: 'Email', value: employee.email },
        { icon: Phone, label: 'Số điện thoại', value: employee.phone },
    ];

    const workInfo = [
        { icon: Building, label: 'Phòng ban', value: employee.department, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
        { icon: Briefcase, label: 'Chức vụ', value: employee.position, iconBgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    ];

    const employmentInfo = [
        { icon: Calendar, label: 'Ngày bắt đầu làm việc', value: employee.joinDate, iconBgColor: 'bg-green-100', iconColor: 'text-green-600' },
        { icon: DollarSign, label: 'Mức lương', value: `${employee.salary.toLocaleString('vi-VN')}đ`, iconBgColor: 'bg-green-100', iconColor: 'text-green-600' },
    ];

    const additionalInfo = [
        { icon: User, label: 'Mã nhân viên', value: `NV${employee.id.toString().padStart(4, '0')}`, iconBgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
        { icon: Building, label: 'Chi nhánh', value: 'Beta Book - Trụ sở chính', iconBgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
    ];

    return (
        <div className="space-y-6">
            <ProfileHeader onOpenChangePassword={() => setIsChangePasswordOpen(true)} />
            
            <ProfileCard employee={employee} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoSection title="Thông tin liên hệ" items={contactInfo} />
                <InfoSection title="Thông tin công việc" items={workInfo} />
                <InfoSection title="Thông tin tuyển dụng" items={employmentInfo} />
                <InfoSection title="Thông tin bổ sung" items={additionalInfo} />
            </div>

            <ChangePasswordDialog
                isOpen={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                onConfirm={handleChangePassword}
            />
        </div>
    );
}
