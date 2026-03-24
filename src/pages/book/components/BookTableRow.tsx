import React from 'react';
import { BookItem } from '../BooksPage';
import { Button } from '../../../components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';

interface BookTableRowProps {
    book: BookItem;
    onEdit: (book: BookItem) => void;
    onDelete: (book: BookItem) => void;
    onView: (book: BookItem) => void;
}

export function BookTableRow({ book, onEdit, onDelete, onView }: BookTableRowProps) {
    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                {book.bookCode}
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {book.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {book.author}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {book.category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {book.publisher}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {book.price.toLocaleString('vi-VN')}đ
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                        book.stock < 30
                            ? 'bg-red-100 text-red-800'
                            : book.stock < 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                    }`}
                >
                    {book.stock}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(book)}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(book)}
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(book)}
                    >
                        <Eye className="w-4 h-4 text-blue-500" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
