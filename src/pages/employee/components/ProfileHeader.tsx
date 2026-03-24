import React from 'react';
import { Key } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface ProfileHeaderProps {
    onOpenChangePassword: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onOpenChangePassword }) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Trang cá nhân
                </h1>
                <p className="text-gray-600 mt-1">
                    Xem và quản lý thông tin cá nhân của bạn
                </p>
            </div>
            <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={onOpenChangePassword}
            >
                <Key className="w-4 h-4 mr-2" />
                Đổi mật khẩu
            </Button>
        </div>
    );
};
