import React from 'react';
import { BookItem } from '../BooksPage';
import { BookTableHeader } from './BookTableHeader';
import { BookTableBody } from './BookTableBody';

interface BookTableProps {
    books: BookItem[];
    onEdit: (book: BookItem) => void;
    onDelete: (book: BookItem) => void;
    onView: (book: BookItem) => void;
}

export function BookTable({ books, onEdit, onDelete, onView }: BookTableProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
                <BookTableHeader />
                <BookTableBody
                    books={books}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            </table>
        </div>
    );
}
