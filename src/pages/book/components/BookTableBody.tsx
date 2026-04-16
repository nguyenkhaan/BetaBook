import React from 'react';
import { BookItem } from '../BooksPage';
import { BookTableRow } from './BookTableRow';

interface BookTableBodyProps {
    books: BookItem[];
    onEdit: (book: BookItem) => void;
    onDelete: (book: BookItem) => void;
    onView: (book: BookItem) => void;
}

export function BookTableBody({ books, onEdit, onDelete, onView }: BookTableBodyProps) {
    console.log(books) 
    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
                <BookTableRow
                    key={book.id}
                    book={book}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            ))}
        </tbody>
    );
}
