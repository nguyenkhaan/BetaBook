import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Book,
  Users,
  DollarSign,
  FileDown,
  Ticket,
  User,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutGrid, label: "Bảng điều khiển", path: "/dashboard" },
    { icon: FileText, label: "Hóa đơn", path: "/invoice" },
    { icon: Book, label: "Sách", path: "/books" },
    { icon: Users, label: "Khách hàng", path: "/customers" },
    { icon: DollarSign, label: "Phiếu thu", path: "/receipts" },
    { icon: FileDown, label: "Phiếu nhập", path: "/import" },
    { icon: Ticket, label: "Khuyến mãi", path: "/promotions" },
    { icon: User, label: "Nhân viên", path: "/employees" },
    { icon: UserCircle, label: "Hồ sơ cá nhân", path: "/employee-profile" },
    { icon: ClipboardList, label: "Báo cáo", path: "/reports" },
    { icon: Settings, label: "Quy định", path: "/regulations" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#1a2332] text-white transition-all duration-300 z-40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-700">
        <UserCircle size={36} className="text-orange-500" />
        {!isCollapsed && (
          <div className="text-orange-500 font-bold text-xl">Beta Book</div>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-4 px-3">
        {menuItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mb-1 transition-colors rounded-lg ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {/* SỬA DUY NHẤT Ở ĐÂY */}
              <item.icon className="w-5 h-5 flex-shrink-0" />

              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
