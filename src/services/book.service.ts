import { privateApi } from '../api/api';
import { BookItem } from '../pages/book/BooksPage';

export class BookService {
  
    static async getAllBook(): Promise<BookItem[]> {
        const responseData = await privateApi.get('/book');
        return responseData.data;
    }

    static async createBook(data: any, file?: File) {
        const formData = new FormData();

       
        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                data[key].forEach((val: any) => formData.append(key, val));
            } else if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        if (file) {
            formData.append('coverImage', file);
        }

        const responseData = await privateApi.post('/book', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return responseData.data;
    }

    static async updateBook(id: number, data: Partial<any>, file?: File) {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                data[key].forEach((val: any) => formData.append(key, val));
            } else if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

       
        if (file) {
            formData.append('coverImage', file);
        }

        const responseData = await privateApi.put(`/book/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return responseData.data;
    }

    static async deleteBook(id: number) {
        const responseData = await privateApi.delete(`/book/${id}`);
        return responseData.data;
    }

   
    static async importExcel(file: File) {
        const formData = new FormData();
        formData.append('data', file);

        const responseData = await privateApi.post('/book/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return responseData.data;
    }

   
    static async getStatistics() {
        const responseData = await privateApi.get('/book/statistic');
        return responseData.data;
    }
    static async getBookById(id: number) {
        const responseData = await privateApi.get(`/book/${id}`);
        return responseData.data;
    }
}
