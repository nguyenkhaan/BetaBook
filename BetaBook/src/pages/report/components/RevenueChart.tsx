import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: any[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Biểu đồ doanh thu
            </h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                        <YAxis stroke="#888888" fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
