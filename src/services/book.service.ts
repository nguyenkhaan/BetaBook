import { privateApi } from '../api/api';
import { BookItem } from '../pages/book/BooksPage';

export class BookService {
  
    static async getAllBook(): Promise<BookItem[]> {
        const responseData = await privateApi.get('/book');
        return responseData.data;
    }

    static async createBook(data: any, file?: File) {
        console.log("Data gui len la: " , data) 
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
        console.log(file) 
        if (file) {
            formData.append('coverImage', file);
        }
        console.log("AAA" , formData)
        const responseData = await privateApi.post('/book', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return responseData.data;
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

    static async searchAuthors(query: string): Promise<any[]> {
        try {
            const responseData = await privateApi.get('/author/search', {
                params: { search: query }
            });
            return responseData.data || [];
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
            return responseData.data || [];
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
            return responseData.data || [];
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
            return responseData.data || [];
        } catch (error) {
            console.error('Error fetching publishers:', error);
            return [];
        }
    }

    static async getCategories(): Promise<string[]> {
        try {
            const responseData = await privateApi.get('/category');
            return responseData.data || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
}
