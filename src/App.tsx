import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import { DashboardPage } from "./components/pages/dashboard/DashboardPage";
import { Sidebar } from "./components/pages/dashboard/Sidebar";
import { Header } from "./components/pages/dashboard/Header";
import { LoginPage } from "./components/pages/login/LoginPage";
import { ForgotPasswordPage } from "./components/pages/login/ForgotPasswordPage";
import { InvoicePage } from "./components/pages/invoice/InvoicePage";
import { BooksPage } from "./components/pages/book/BooksPage";
import { CustomersPage } from "./components/pages/customer/CustomersPage";
import { ReceiptsPage } from "./components/pages/ReceiptsPage";
import { ImportPage } from "./components/pages/import/ImportPage";
import { PromotionsPage } from "./components/pages/promotion/PromotionsPage";
import { EmployeesPage } from "./components/pages/employee/EmployeesPage";
import { ReportsPage } from "./components/pages/report/ReportsPage";
import { RegulationsPage } from "./components/pages/regulation/RegulationsPage";
import { RegulationDetailPage } from "./components/pages/regulation/RegulationDetailPage";
import { EmployeeProfile } from "./components/pages/employee/EmployeeProfile";
import {
  ResignationDashboard,
  Resignation,
} from "./components/pages/resignation/ResignationDashboard";
import { ApprovalManagement } from "./components/pages/Approval/ApprovalManagement";
import { MyPage } from "./components/pages/userprofile/MyPage";
import {
  LeaveoffPage,
  LeaveRequest,
} from "./components/pages/leave/LeaveoffPage";

type Role = "admin" | "owner" | "staff";

interface RoutePermission {
  path: string;
  roles: Role[];
}

const MOCK_USERS = [
  {
    email: "nguyen.vana@company.com",
    password: "password",
    role: "staff" as Role,
    name: "Nguyễn Văn A",
  },
  {
    email: "admin@betabook.com",
    password: "admin123",
    role: "admin" as Role,
    name: "Quản trị hệ thống",
  },
  {
    email: "owner@betabook.com",
    password: "owner123",
    role: "owner" as Role,
    name: "Chủ nhà sách",
  },
];

export const routePermissions: RoutePermission[] = [
  { path: "/dashboard", roles: ["admin", "owner", "staff"] },
  { path: "/invoice", roles: ["admin", "owner", "staff"] },
  { path: "/import", roles: ["admin", "owner"] },
  { path: "/books", roles: ["admin", "owner"] },
  { path: "/customers", roles: ["admin", "owner", "staff"] },
  { path: "/receipts", roles: ["admin", "owner", "staff"] },
  { path: "/promotions", roles: ["admin", "owner"] },
  { path: "/employees", roles: ["admin", "owner"] },
  { path: "/reports", roles: ["admin", "owner", "staff"] },
  { path: "/regulations", roles: ["admin", "owner"] },
  { path: "/regulation-detail", roles: ["admin", "owner"] },
  { path: "/employee-profile", roles: ["admin", "owner", "staff"] },
  { path: "/resignation", roles: ["admin", "owner", "staff"] },
  { path: "/approval", roles: ["admin", "owner"] },
  { path: "/leaveoff", roles: ["admin", "owner", "staff"] },
  { path: "/mypage", roles: ["admin", "owner", "staff"] },
];

const ProtectedRoute = ({
  children,
  userRole,
  path,
}: {
  children: React.ReactNode;
  userRole: Role;
  path: string;
}) => {
  const permission = routePermissions.find((p) => p.path === path);
  if (!permission || permission.roles.includes(userRole)) {
    return <>{children}</>;
  }
  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<Role>("staff");
  const [userName, setUserName] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const [resignations, setResignations] = useState<Resignation[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedRegulation, setSelectedRegulation] = useState<any>(null);

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      setUserRole(user.role);
      setUserName(user.name);
      setIsAuthenticated(true);
      toast.success(`Chào mừng ${user.name}!`, {
        description: `Bạn đã đăng nhập với quyền ${user.role}`,
      });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    toast.info("Đã đăng xuất khỏi hệ thống");
  };

  if (!isAuthenticated) {
    return showForgotPassword ? (
      <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />
    ) : (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          userRole={userRole}
        />
        <div
          className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}
        >
          <Header onLogout={handleLogout} userName={userName} />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute userRole={userRole} path="/dashboard">
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoice"
                element={
                  <ProtectedRoute userRole={userRole} path="/invoice">
                    <InvoicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books"
                element={
                  <ProtectedRoute userRole={userRole} path="/books">
                    <BooksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute userRole={userRole} path="/customers">
                    <CustomersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receipts"
                element={
                  <ProtectedRoute userRole={userRole} path="/receipts">
                    <ReceiptsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/import"
                element={
                  <ProtectedRoute userRole={userRole} path="/import">
                    <ImportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/promotions"
                element={
                  <ProtectedRoute userRole={userRole} path="/promotions">
                    <PromotionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute userRole={userRole} path="/employees">
                    <EmployeesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute userRole={userRole} path="/reports">
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/regulations"
                element={
                  <ProtectedRoute userRole={userRole} path="/regulations">
                    <RegulationsPage
                      onSelectRegulation={setSelectedRegulation}
                      onNavigate={() => {}}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/regulation-detail"
                element={
                  <ProtectedRoute userRole={userRole} path="/regulation-detail">
                    <RegulationDetailPage
                      regulation={selectedRegulation}
                      onBack={() => {}}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee-profile"
                element={
                  <ProtectedRoute userRole={userRole} path="/employee-profile">
                    <EmployeeProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resignation"
                element={
                  <ProtectedRoute userRole={userRole} path="/resignation">
                    <ResignationDashboard
                      resignations={resignations}
                      onAddResignation={(n) =>
                        setResignations([n, ...resignations])
                      }
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approval"
                element={
                  <ProtectedRoute userRole={userRole} path="/approval">
                    <ApprovalManagement
                      resignations={resignations}
                      onUpdateResignation={(id, status) =>
                        setResignations(
                          resignations.map((r) =>
                            r.id === id ? { ...r, status } : r,
                          ),
                        )
                      }
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaveoff"
                element={
                  <ProtectedRoute userRole={userRole} path="/leaveoff">
                    <LeaveoffPage
                      leaveRequests={leaveRequests}
                      onAddLeaveRequest={(n) =>
                        setLeaveRequests([n, ...leaveRequests])
                      }
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mypage"
                element={
                  <ProtectedRoute userRole={userRole} path="/mypage">
                    <MyPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
