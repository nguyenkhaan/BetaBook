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
  LogOut,
  CalendarDays,
} from "lucide-react";

// Định nghĩa kiểu Role khớp với App.tsx
type Role = "admin" | "owner" | "staff";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userRole: Role; // Đã sửa từ role? thành userRole bắt buộc
}

export function Sidebar({ isCollapsed, onToggle, userRole }: SidebarProps) {
  const location = useLocation();

  // Danh sách menu kèm theo quyền truy cập (roles) khớp với routePermissions ở App.tsx
  const menuItems = [
    {
      icon: LayoutGrid,
      label: "Bảng điều khiển",
      path: "/dashboard",
      roles: ["admin", "owner", "staff"],
    },
    {
      icon: FileText,
      label: "Hóa đơn",
      path: "/invoice",
      roles: ["admin", "owner", "staff"],
    },
    { icon: Book, label: "Sách", path: "/books", roles: ["admin", "owner"] },
    {
      icon: Users,
      label: "Khách hàng",
      path: "/customers",
      roles: ["admin", "owner", "staff"],
    },
    {
      icon: DollarSign,
      label: "Phiếu thu",
      path: "/receipts",
      roles: ["admin", "owner", "staff"],
    },
    {
      icon: FileDown,
      label: "Phiếu nhập",
      path: "/import",
      roles: ["admin", "owner"],
    },
    {
      icon: Ticket,
      label: "Khuyến mãi",
      path: "/promotions",
      roles: ["admin", "owner"],
    },
    {
      icon: User,
      label: "Nhân viên",
      path: "/employees",
      roles: ["admin", "owner"],
    },
    {
      icon: UserCircle,
      label: "Hồ sơ cá nhân",
      path: "/employee-profile",
      roles: ["admin", "owner", "staff"],
    },
    {
      icon: CalendarDays,
      label: "Nghỉ phép",
      path: "/leaveoff",
      roles: ["admin", "owner", "staff"],
    },
    {
      icon: LogOut,
      label: "Thôi việc",
      path: "/resignation",
      roles: ["admin", "owner", "staff"],
    },
    {
      icon: ClipboardList,
      label: "Báo cáo",
      path: "/reports",
      roles: ["admin", "owner", "staff"],
    },
    {
      icon: Settings,
      label: "Quy định",
      path: "/regulations",
      roles: ["admin", "owner"],
    },
  ];

  // Lọc menu: Chỉ giữ lại những mục mà userRole hiện tại có quyền xem
  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

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
      <nav className="mt-4 px-3 overflow-y-auto max-h-[calc(100vh-140px)]">
        {filteredMenu.map((item, index) => {
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
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
