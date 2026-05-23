import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { BarChart3 } from 'lucide-react';

interface Book {
    title: string;
    author: string;
    sold: number;
    revenue: string;
}

interface TopBooksProps {
    books: Book[];
}

export const TopBooks: React.FC<TopBooksProps> = ({ books }) => {
    return (
        <Card className="border-0 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    Sách bán chạy
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {books.map((book, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                    {book.title}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {book.author}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">
                                    {book.revenue}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {book.sold} cuốn
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
