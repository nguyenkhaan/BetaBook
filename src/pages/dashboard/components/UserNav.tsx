import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';

interface UserNavProps {
    userName: string;
    onLogout?: () => void;
}

export const UserNav: React.FC<UserNavProps> = ({ userName, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    2
                </span>
            </div>

            <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
                onClick={() => navigate('/employee-profile')}
            >
                <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-300 text-gray-700">
                        {userName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm">{userName}</span>
            </div>

            {onLogout && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Xác nhận đăng xuất
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Bạn có chắc chắn muốn đăng xuất khỏi hệ
                                thống không?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onLogout}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                Đăng xuất
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
};
