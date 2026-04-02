// Định nghĩa Interface để đảm bảo tính nhất quán của dữ liệu
export interface BookItem {
    id: number;
    bookCode: string;
    title: string;
    author: string;
    category: string;
    price: number;
    stock: number;
    publisher: string;
    year: number;
    description?: string; // Thêm mô tả (tùy chọn)
    imageUrl?: string; // Thêm ảnh bìa (tùy chọn)
}

export const mockBooks: BookItem[] = [
    {
        id: 1,
        bookCode: 'BK001',
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        category: 'Kỹ năng sống',
        price: 120000,
        stock: 45,
        publisher: 'NXB Tổng Hợp',
        year: 2024,
        description:
            'Cuốn sách nổi tiếng nhất mọi thời đại về nghệ thuật giao tiếp.',
        imageUrl: 'https://picsum.photos/200/300?random=1',
    },
    {
        id: 2,
        bookCode: 'BK002',
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        category: 'Tiểu thuyết',
        price: 95000,
        stock: 32,
        publisher: 'NXB Văn Học',
        year: 2023,
        description: 'Hành trình đi tìm vận mệnh của chàng chăn cừu Santiago.',
        imageUrl: 'https://picsum.photos/200/300?random=2',
    },
    {
        id: 3,
        bookCode: 'BK003',
        title: 'Sapiens: Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        category: 'Lịch sử',
        price: 180000,
        stock: 28,
        publisher: 'NXB Tri Thức',
        year: 2024,
        description: 'Khám phá lịch sử loài người từ thời đồ đá đến tương lai.',
        imageUrl: 'https://picsum.photos/200/300?random=3',
    },
    {
        id: 4,
        bookCode: 'BK004',
        title: 'Atomic Habits',
        author: 'James Clear',
        category: 'Kỹ năng sống',
        price: 150000,
        stock: 52,
        publisher: 'NXB Thế Giới',
        year: 2024,
        description: 'Thay đổi nhỏ, kết quả lớn - Cách xây dựng thói quen tốt.',
        imageUrl: 'https://picsum.photos/200/300?random=4',
    },
    {
        id: 5,
        bookCode: 'BK005',
        title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        category: 'Kỹ năng sống',
        price: 85000,
        stock: 67,
        publisher: 'NXB Hội Nhà Văn',
        year: 2023,
        description: 'Những bài học quý giá cho hành trang của người trẻ.',
        imageUrl: 'https://picsum.photos/200/300?random=5',
    },
];
