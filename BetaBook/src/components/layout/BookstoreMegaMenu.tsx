import React from 'react';
import { Heart, Search, Bell, ShoppingCart, User, ChevronDown, LayoutGrid } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const primaryCategories = [
  { name: 'Sách Trong Nước', active: true },
  { name: 'FOREIGN BOOKS', active: false },
  { name: 'VPP - Dụng Cụ Học Sinh', active: false },
  { name: 'Đồ Chơi', active: false },
  { name: 'Làm Đẹp - Sức Khỏe', active: false },
  { name: 'Sách Giáo Khoa 2025', active: false },
  { name: 'VPP - DCHS Theo Thương Hiệu', active: false },
  { name: 'Đồ Chơi Theo Thương Hiệu', active: false },
  { name: 'Bách Hóa Online - Lưu Niệm', active: false },
];

const megaMenuColumns = [
  {
    title: 'VĂN HỌC',
    items: ['Tiểu Thuyết', 'Truyện Ngắn - Tản Văn', 'Light Novel', 'Ngôn Tình'],
  },
  {
    title: 'KINH TẾ',
    items: ['Nhân Vật - Bài Học Kinh Doanh', 'Quản Trị - Lãnh Đạo', 'Marketing - Bán Hàng', 'Phân Tích Kinh Tế'],
  },
  {
    title: 'TÂM LÝ - KĨ NĂNG SỐNG',
    items: ['Kỹ Năng Sống', 'Rèn Luyện Nhân Cách', 'Tâm Lý', 'Sách Cho Tuổi Mới Lớn'],
  },
  {
    title: 'NUÔI DẠY CON',
    items: ['Cẩm Nang Làm Cha Mẹ', 'Phương Pháp Giáo Dục Trẻ...', 'Phát Triển Trí Tuệ Cho Trẻ', 'Phát Triển Kỹ Năng Cho Trẻ'],
  },
  {
    title: 'SÁCH THIẾU NHI',
    items: ['Manga - Comic', 'Kiến Thức Bách Khoa', 'Sách Tranh Kỹ Năng Sống...', 'Vừa Học - Vừa Học Vừa Chơi...'],
  },
  {
    title: 'TIÊU SỬ - HỒI KÝ',
    items: ['Câu Chuyện Cuộc Đời', 'Chính Trị', 'Kinh Tế', 'Nghệ Thuật - Giải Trí'],
  },
  {
    title: 'GIÁO KHOA - THAM KHẢO',
    items: ['Sách Giáo Khoa', 'Sách Tham Khảo', 'Luyện Thi THPT Quốc Gia', 'Mẫu Giáo'],
  },
  {
    title: 'SÁCH HỌC NGOẠI NGỮ',
    items: ['Tiếng Anh', 'Tiếng Nhật', 'Tiếng Hoa', 'Tiếng Hàn'],
  },
];

const specialSections = [
  { name: 'SÁCH MỚI', hasHeart: true },
  { name: 'MANGA MỚI', hasHeart: true },
  { name: 'LIGHT NOVEL MỚI', hasHeart: true },
  { name: 'SÁCH BÁN CHẠY', hasHeart: true },
];

export const BookstoreMegaMenu: React.FC = () => {
  return (
    <div className="w-full bg-white shadow-lg font-sans">
      {/* Top Header Section */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-bold text-red-600 flex items-center">
            Fahasa<span className="text-gray-800">.com</span>
            <div className="ml-2 bg-red-600 rounded-full p-1">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </h1>
        </div>

        {/* Category Trigger & Search */}
        <div className="flex-grow flex items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600">
            <LayoutGrid className="w-6 h-6" />
            <ChevronDown className="w-4 h-4" />
          </Button>
          <div className="relative flex-grow max-w-2xl">
            <Input 
              placeholder="Boxset Kính Vạn Hoa" 
              className="w-full pr-12 h-10 border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
            <div className="absolute right-0 top-0 h-10 px-6 bg-red-600 hover:bg-red-700 rounded-r-md flex items-center justify-center cursor-pointer">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center cursor-pointer text-gray-600 hover:text-red-600">
            <Bell className="w-6 h-6" />
            <span className="text-xs mt-1 whitespace-nowrap">Thông Báo</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-gray-600 hover:text-red-600">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs mt-1 whitespace-nowrap">Giỏ Hàng</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer text-gray-600 hover:text-red-600">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1 whitespace-nowrap">Tài khoản</span>
          </div>
          <div className="flex items-center gap-1 border border-gray-300 rounded p-1 cursor-pointer">
            <div className="w-6 h-4 bg-red-600 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-400 rotate-45"></div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mega Menu Overlay Container */}
      <div className="container mx-auto px-4 pb-8 mt-2">
        <div className="grid grid-cols-12 bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden min-h-[500px]">
          
          {/* Left Sidebar (3/12 columns) */}
          <div className="col-span-3 border-r border-gray-200 bg-white py-4">
            <h2 className="px-6 py-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Danh mục sản phẩm
            </h2>
            <nav>
              {primaryCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className={`px-6 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between group
                    ${cat.active ? 'bg-gray-100 text-red-600 font-semibold border-l-4 border-red-600' : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'}
                  `}
                >
                  <span className="text-[13px] font-bold uppercase tracking-tight">{cat.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 -rotate-90`} />
                </div>
              ))}
            </nav>
          </div>

          {/* Right Mega Menu Content (9/12 columns) */}
          <div className="col-span-9 p-8">
            {/* Header of Content */}
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Sách Trong Nước</h3>
            </div>

            {/* Main Columns Grid (4 columns) */}
            <div className="grid grid-cols-4 gap-x-10 gap-y-12">
              {megaMenuColumns.map((col, idx) => (
                <div key={idx} className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-[13px] uppercase tracking-wider border-b border-transparent group-hover:border-red-600 inline-block">
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.items.map((item, i) => (
                      <li key={i} className="text-[13px] text-gray-600 hover:text-red-600 cursor-pointer transition-colors line-clamp-1 leading-relaxed">
                        {item}
                      </li>
                    ))}
                    <li className="text-[13px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer pt-1 transition-colors">
                      Xem tất cả
                    </li>
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Special Sections */}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-x-12 gap-y-6">
                {specialSections.map((section, idx) => (
                  <div key={idx} className="flex items-center gap-2 group cursor-pointer">
                    <span className="font-bold text-[13px] text-gray-900 uppercase group-hover:text-red-600 transition-colors tracking-wide">
                      {section.name}
                    </span>
                    {section.hasHeart && (
                      <Heart className="w-4 h-4 text-red-500 fill-red-500 group-hover:scale-125 transition-transform duration-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookstoreMegaMenu;
