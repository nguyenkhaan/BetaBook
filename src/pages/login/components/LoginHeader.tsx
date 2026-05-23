import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';

export function LoginHeader() {
    return (
        <CardHeader className="space-y-6 pb-8">
            <div className="flex items-center justify-center mb-4">
                <span className="text-orange-500 text-3xl font-bold">
                    Utahime Book
                </span>
            </div>

            <div className="text-center space-y-2">
                <CardTitle className="text-2xl">Chào mừng quay trở lại</CardTitle>
                <CardDescription className="text-base">
                    Đăng nhập để tiếp tục
                </CardDescription>
            </div>
        </CardHeader>
    );
}
