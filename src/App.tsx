import { useState } from "react";
import { ResignationDashboard } from "./components/pages/resignation/ResignationDashboard";
import { ApprovalManagement } from "./components/pages/Approval/ApprovalManagement";
import { MyPage } from "./components/pages/userprofile/MyPage";
import { LeaveoffPage } from "./components/pages/leave/LeaveoffPage";
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
import { Resignation } from "./components/pages/resignation/ResignationDashboard";
import { LeaveRequest } from "./components/pages/leave/LeaveoffPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const mockResignations: Resignation[] = [
  {
    id: 1,
    employeeName: "A Nguyen Van",
    position: "Senior Developer",
    department: "Engineering",
    submissionDate: "11/01/2025 - 09:30",
    daysTakenOff: "02/12",
    reason: "Lý do cá nhân",
    status: "Đang xử lý",
    approver: "Nguyễn Vũ Linh",
  },
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeName: "A Nguyen Van",
    startDate: "11/04/2025 - 08:30",
    endDate: "11/04/2025 - 17:30",
    submissionDate: "11/03/2025 - 22:22",
    reason: "Xin Nghỉ Ốm",
    status: "Chờ duyệt",
    approver: "Nguyễn Vũ Linh",
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const [resignations, setResignations] =
    useState<Resignation[]>(mockResignations);
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(mockLeaveRequests);
  const [selectedRegulation, setSelectedRegulation] = useState<any>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);

    toast.success("Đăng nhập thành công!", {
      description: "Chào mừng bạn đến với hệ thống Beta Book",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAddResignation = (newResignation: Resignation) => {
    setResignations([newResignation, ...resignations]);
  };

  const handleUpdateResignation = (
    id: number,
    status: "Chấp nhận" | "Từ chối",
  ) => {
    setResignations(
      resignations.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  };

  const handleAddLeaveRequest = (newRequest: LeaveRequest) => {
    setLeaveRequests([newRequest, ...leaveRequests]);
  };

  if (!isAuthenticated) {
    if (showForgotPassword) {
      return (
        <ForgotPasswordPage
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      );
    }

    return (
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
        />

        <div
          className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}
        >
          <Header onLogout={handleLogout} />

          <main className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/invoice" element={<InvoicePage />} />

              <Route path="/books" element={<BooksPage />} />

              <Route path="/customers" element={<CustomersPage />} />

              <Route path="/receipts" element={<ReceiptsPage />} />

              <Route path="/import" element={<ImportPage />} />

              <Route path="/promotions" element={<PromotionsPage />} />

              <Route path="/employees" element={<EmployeesPage />} />



              <Route path="/reports" element={<ReportsPage />} />

              <Route
                path="/regulations"
                element={
                  <RegulationsPage
                    onSelectRegulation={setSelectedRegulation}
                    onNavigate={() => {}}
                  />
                }
              />

              <Route
                path="/regulation-detail"
                element={
                  <RegulationDetailPage
                    regulation={selectedRegulation}
                    onBack={() => {}}
                  />
                }
              />

              <Route path="/employee-profile" element={<EmployeeProfile />} />

              <Route
                path="/resignation"
                element={
                  <ResignationDashboard
                    resignations={resignations}
                    onAddResignation={handleAddResignation}
                  />
                }
              />

              <Route
                path="/approval"
                element={
                  <ApprovalManagement
                    resignations={resignations}
                    onUpdateResignation={handleUpdateResignation}
                  />
                }
              />

              <Route
                path="/leaveoff"
                element={
                  <LeaveoffPage
                    leaveRequests={leaveRequests}
                    onAddLeaveRequest={handleAddLeaveRequest}
                  />
                }
              />

              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}


