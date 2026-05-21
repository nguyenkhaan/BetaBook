import { useEffect, useState } from 'react';
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
import { EmployeesService } from '../../services/employees.service';
import { AuthService } from '../../services/auth.service';

export function EmployeeProfile() {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [employee , setEmployee] = useState({
        name: '', position : '' , status: '' 
    })
    const [userProfile, setUserProfile] = useState<any>();
    const [loading, setLoading] = useState(false);
    // const [avatar, setAvatar] = useState('');
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const employeeProfile =
                    (await AuthService.getMyProfile()) as any;
                const workInfo = [
                    {
                        icon: Building,
                        label: 'Phòng ban',
                        value: employeeProfile.department.name,
                        iconBgColor: 'bg-blue-100',
                        iconColor: 'text-blue-600',
                    },
                    {
                        icon: Briefcase,
                        label: 'Chức vụ',
                        value: employeeProfile.position.name,
                        iconBgColor: 'bg-blue-100',
                        iconColor: 'text-blue-600',
                    },
                ];
                const contactInfo = [
                    {
                        icon: Mail,
                        label: 'Email',
                        value: employeeProfile.email,
                    },
                    {
                        icon: Phone,
                        label: 'Số điện thoại',
                        value: employeeProfile.phone,
                    },
                ];
                const additionalInfo = [
                    {
                        icon: User,
                        label: 'Mã nhân viên',
                        value: `${employeeProfile.code}`,
                        iconBgColor: 'bg-purple-100',
                        iconColor: 'text-purple-600',
                    },
                    {
                        icon: Building,
                        label: 'Chi nhánh',
                        value: 'Beta Book - Trụ sở chính',
                        iconBgColor: 'bg-purple-100',
                        iconColor: 'text-purple-600',
                    },
                ];

                const employmentInfo = [
                    {
                        icon: Calendar,
                        label: 'Ngày bắt đầu làm việc',
                        value: employeeProfile.createdAt,
                        iconBgColor: 'bg-green-100',
                        iconColor: 'text-green-600',
                    },
                    {
                        icon: DollarSign,
                        label: 'Mức lương',
                        value: `${employeeProfile.salary.toLocaleString('vi-VN')}đ`,
                        iconBgColor: 'bg-green-100',
                        iconColor: 'text-green-600',
                    },
                ];
                setEmployee({
                    name: employeeProfile.name, 
                    status: employeeProfile.status, 
                    position: employeeProfile.position.name 
                })
                // setAvatar(employeeProfile.avatar || '')   //-> Hien tai chua co chuc nang update avatar 
                setUserProfile({
                    workInfo,
                    additionalInfo,
                    contactInfo,
                    employmentInfo,
                });
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);
    // Mock employee data - in real app, this would come from context/props

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
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="space-y-6">
            <ProfileHeader
                onOpenChangePassword={() => setIsChangePasswordOpen(true)}
            />

            <ProfileCard employee={employee} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoSection
                    title="Thông tin liên hệ"
                    items={userProfile?.contactInfo || []}
                />
                <InfoSection
                    title="Thông tin công việc"
                    items={userProfile?.workInfo || []}
                />
                <InfoSection
                    title="Thông tin tuyển dụng"
                    items={userProfile?.employmentInfo || []}
                />
                <InfoSection
                    title="Thông tin bổ sung"
                    items={userProfile?.additionalInfo || []}
                />
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
