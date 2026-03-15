import { Bell, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";

interface HeaderProps {
  onLogout?: () => void;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const pageLabels: Record<string, string> = {
  dashboard: "Bảng điều khiển",
  invoice: "Hóa đơn",
  books: "Sách",
  customers: "Khách hàng",
  receipts: "Phiếu thu",
  import: "Phiếu nhập",
  promotions: "Khuyến mãi",
  employees: "Nhân viên",
  reports: "Báo cáo",
  regulations: "Quy định",
  "regulation-detail": "Chi tiết quy định",
  resignation: "Nghỉ việc",
  approval: "Quản lý phê duyệt",
  leaveoff: "Quản lý nghỉ phép",
  mypage: "Trang của tôi",
  "employee-profile": "Trang cá nhân",
};

export function Header({
  onLogout,
  currentPage = "resignation",
  onNavigate,
}: HeaderProps) {
  const navigate = useNavigate();

  // Breadcrumb logic for nested pages
  const getBreadcrumb = () => {
    if (currentPage === "regulation-detail") {
      return (
        <>
          <span
            className="cursor-pointer hover:text-orange-600"
            onClick={() => onNavigate?.("dashboard")}
          >
            Trang chủ
          </span>
          <ChevronRight className="w-4 h-4" />
          <span
            className="cursor-pointer hover:text-orange-600"
            onClick={() => onNavigate?.("regulations")}
          >
            Quy định
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Chi tiết quy định</span>
        </>
      );
    }

    return (
      <>
        <span
          className="cursor-pointer hover:text-orange-600"
          onClick={() => onNavigate?.("dashboard")}
        >
          Trang chủ
        </span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">
          {pageLabels[currentPage] || "Nghỉ việc"}
        </span>
      </>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getBreadcrumb()}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
            onClick={() => navigate("/employee-profile")}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gray-300 text-gray-700">
                A
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">A Nguyen Van</span>
          </div>

          {onLogout && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onLogout}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Đăng xuất
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </header>
  );
}
