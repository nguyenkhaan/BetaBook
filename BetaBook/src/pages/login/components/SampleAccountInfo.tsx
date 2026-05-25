import React from 'react';

export function SampleAccountInfo() {
    return (
        <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-2">
                Sample Account (Tour employee):
            </p>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-gray-600">
                    <span className="font-medium">Email:</span>{' '}
                    nguyen.vana@company.com
                </p>
                <p className="text-xs text-gray-600">
                    <span className="font-medium">
                        Password:
                    </span>{' '}
                    password
                </p>
            </div>
        </div>
    );
}
