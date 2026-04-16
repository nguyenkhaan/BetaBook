// BookCategory enum values based on Prisma schema
export const BOOK_CATEGORIES = {
    FICTION: 'FICTION',
    NON_FICTION: 'NON_FICTION',
    ROMANCE: 'ROMANCE',
    MYSTERY: 'MYSTERY',
    SCIENCE_FICTION: 'SCIENCE_FICTION',
    FANTASY: 'FANTASY',
    BIOGRAPHY: 'BIOGRAPHY',
    HISTORY: 'HISTORY',
    SELF_HELP: 'SELF_HELP',
    EDUCATIONAL: 'EDUCATIONAL',
    CHILDREN: 'CHILDREN',
    POETRY: 'POETRY',
    COOKING: 'COOKING',
    ART: 'ART',
    BUSINESS: 'BUSINESS',
    TECHNOLOGY: 'TECHNOLOGY',
} as const;

export const BOOK_CATEGORIES_LABEL: Record<string, string> = {
    FICTION: 'Tiểu thuyết',
    NON_FICTION: 'Văn học phi hư cấu',
    ROMANCE: 'Lãng mạn',
    MYSTERY: 'Bí ẩn',
    SCIENCE_FICTION: 'Khoa học viễn tưởng',
    FANTASY: 'PhFantasy',
    BIOGRAPHY: 'Tiểu sử',
    HISTORY: 'Lịch sử',
    SELF_HELP: 'Kỹ năng sống',
    EDUCATIONAL: 'Giáo dục',
    CHILDREN: 'Sách thiếu nhi',
    POETRY: 'Thơ',
    COOKING: 'Nấu ăn',
    ART: 'Nghệ thuật',
    BUSINESS: 'Kinh doanh',
    TECHNOLOGY: 'Công nghệ',
};

export function getCategoryLabel(category: string): string {
    return BOOK_CATEGORIES_LABEL[category] || category;
}
