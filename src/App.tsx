import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { Sidebar } from "./pages/dashboard/Sidebar";
import { Header } from "./pages/dashboard/Header";
import { LoginPage } from "./pages/login/LoginPage";
import { ForgotPasswordPage } from "./pages/login/ForgotPasswordPage";
import { InvoicePage } from "./pages/invoice/InvoicePage";
import { BooksPage } from "./pages/book/BooksPage";
import { CustomersPage } from "./pages/customer/CustomersPage";
import { ReceiptsPage } from "./pages/ReceiptsPage";
import { ImportPage } from "./pages/import/ImportPage";
import { PromotionsPage } from "./pages/promotion/PromotionsPage";
import { EmployeesPage } from "./pages/employee/EmployeesPage";
import { ReportsPage } from "./pages/report/ReportsPage";
import { RegulationsPage } from "./pages/regulation/RegulationsPage";
import { RegulationDetailPage } from "./pages/regulation/RegulationDetailPage";
import { EmployeeProfile } from "./pages/employee/EmployeeProfile";
import {
   ResignationDashboard,
   Resignation,
} from "./pages/resignation/ResignationDashboard";

import { ApprovalManagement } from "./pages/Approval/ApprovalManagement";
import { MyPage } from "./pages/userprofile/MyPage";
import { LeaveoffPage, LeaveRequest } from "./pages/leave/LeaveoffPage";

type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER";
                                                                                                                                           
interface RoutePermission {
   path: string;
   roles: Role[];
}

const MOCK_USERS = [
   {
      email: "nguyenvana@company.com",
      password: "password",
      role: "EMPLOYEE" as Role,
      name: "Nguyễn Văn A",
   },
   {
      email: "admin@betabook.com",
      password: "admin123",
      role: "ADMIN" as Role,
      name: "Quản trị hệ thống",
   },
];

export const routePermissions: RoutePermission[] = [
   { path: "/dashboard", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/invoice", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/import", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/books", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/customers", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/receipts", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/promotions", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/employees", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/reports", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/regulations", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/regulation-detail", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/employee-profile", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/resignation", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/approval", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/leaveoff", roles: ["ADMIN", "EMPLOYEE"] },
   { path: "/mypage", roles: ["ADMIN", "EMPLOYEE"] },
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
   const [userRole, setUserRole] = useState<Role>("EMPLOYEE");
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
         <ForgotPasswordPage
            onBackToLogin={() => setShowForgotPassword(false)}
         />
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
                           <ProtectedRoute
                              userRole={userRole}
                              path="/dashboard"
                           >
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
                           <ProtectedRoute
                              userRole={userRole}
                              path="/customers"
                           >
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
                           <ProtectedRoute
                              userRole={userRole}
                              path="/promotions"
                           >
                              <PromotionsPage />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/employees"
                        element={
                           <ProtectedRoute
                              userRole={userRole}
                              path="/employees"
                           >
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
                           <ProtectedRoute
                              userRole={userRole}
                              path="/regulations"
                           >
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
                           <ProtectedRoute
                              userRole={userRole}
                              path="/regulation-detail"
                           >
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
                           <ProtectedRoute
                              userRole={userRole}
                              path="/employee-profile"
                           >
                              <EmployeeProfile />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/resignation"
                        element={
                           <ProtectedRoute
                              userRole={userRole}
                              path="/resignation"
                           >
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
