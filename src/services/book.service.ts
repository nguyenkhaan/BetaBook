import { privateApi } from '../api/api';
import { BookItem } from '../pages/book/BooksPage';

export class BookService {
    private static extractPayload<T>(response: any): T {
        if (response && typeof response === 'object' && 'data' in response) {
            return response.data as T;
        }

        return response as T;
    }

    static async getAllBook(): Promise<BookItem[]> {
        const responseData = await privateApi.get('/book');
        return this.extractPayload<BookItem[]>(responseData) || [];
    }

    static async createBook(data: any, file?: File) {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                data[key].forEach((val: any) => {
                    if (val !== undefined && val !== null) {
                        formData.append(key, val);
                    }
                });
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
        return this.extractPayload(responseData);
    }

    static async updateBook(id: number, data: Partial<any>, file?: File) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                data[key].forEach((val: any) => {
                    if (val !== undefined && val !== null) {
                        formData.append(key, val);
                    }
                });
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
        return this.extractPayload(responseData);
    }

    static async deleteBook(id: number) {
        const responseData = await privateApi.delete(`/book/${id}`);
        return this.extractPayload(responseData);
    }

   
    static async importExcel(file: File) {
        const formData = new FormData();
        formData.append('data', file);

        const responseData = await privateApi.post('/book/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return this.extractPayload(responseData);
    }

   
    static async getStatistics() {
        const responseData = await privateApi.get('/book/statistic');
        return this.extractPayload(responseData);
    }
    static async getBookById(id: number) {
        const responseData = await privateApi.get(`/book/${id}`);
        return this.extractPayload(responseData);
    }

    static async searchAuthors(query: string): Promise<any[]> {
        try {
            const responseData = await privateApi.get('/author/search', {
                params: { search: query }
            });
            return this.extractPayload<any[]>(responseData) || [];
        } catch (error) {
            console.error('Error searching authors:', error);
            return [];
        }
    }

    static async getAllAuthors(): Promise<any[]> {
        try {
            // Use wildcard search to get all authors
            const responseData = await privateApi.get('/author/search', {
                params: { search: '' }
            });
            return this.extractPayload<any[]>(responseData) || [];
        } catch (error) {
            console.error('Error fetching authors:', error);
            return [];
        }
    }

    static async searchPublishers(query: string): Promise<any[]> {
        try {
            const responseData = await privateApi.get('/publisher/search', {
                params: { name: query }
            });
            return this.extractPayload<any[]>(responseData) || [];
        } catch (error) {
            console.error('Error searching publishers:', error);
            return [];
        }
    }

    static async getAllPublishers(): Promise<any[]> {
        try {
            // Use wildcard search to get all publishers
            const responseData = await privateApi.get('/publisher/search', {
                params: { name: '' }
            });
            return this.extractPayload<any[]>(responseData) || [];
        } catch (error) {
            console.error('Error fetching publishers:', error);
            return [];
        }
    }

    static async getCategories(): Promise<string[]> {
        try {
            const responseData = await privateApi.get('/category');
            return this.extractPayload<string[]>(responseData) || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
}
