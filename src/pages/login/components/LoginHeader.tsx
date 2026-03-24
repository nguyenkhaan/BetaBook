import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';

export function LoginHeader() {
    return (
        <CardHeader className="space-y-6 pb-8">
            <div className="flex items-center justify-center mb-4">
                <span className="text-orange-500 text-3xl font-bold">
                    Beta Book
                </span>
            </div>

            <div className="text-center space-y-2">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription className="text-base">
                    Login to continue
                </CardDescription>
            </div>
        </CardHeader>
    );
}
