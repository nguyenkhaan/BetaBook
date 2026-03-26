import {
    Routes,
    Route,
} from 'react-router-dom';
import { Toaster } from 'sonner';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { RegulationsPage } from './pages/regulation/RegulationsPage';
import { LoginPage } from './pages/login/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { InvoicePage } from './pages/invoice/InvoicePage';
import { BooksPage } from './pages/book/BooksPage';
import { CustomersPage } from './pages/customer/CustomersPage';
import { ReceiptsPage } from './pages/ReceiptsPage';
import { ImportPage } from './pages/import/ImportPage';
import { PromotionsPage } from './pages/promotion/PromotionsPage';
import { EmployeesPage } from './pages/employee/EmployeesPage';
import { ReportsPage } from './pages/report/ReportsPage';
import { EmployeeProfile } from './pages/employee/EmployeeProfile';
import { BookstoreDemoPage } from './pages/BookstoreDemoPage';
import { routePermission } from './routes/route.permission';
import { DashboardLayout } from './layouts/DashboardLayouts';

export default function App() {
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [userRole, setUserRole] = useState<Role>('EMPLOYEE');
    // const [userName, setUserName] = useState('');
    // const [showForgotPassword, setShowForgotPassword] = useState(false);
    // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    // const navigate = useNavigate();
    // const location = useLocation();
    return (
        <>
            <Toaster position="top-right" richColors />

            <Routes>
                <Route path="/" element={<LoginPage />} />

                <Route path="/bookstore-demo" element={<BookstoreDemoPage />} />

                {Object.entries(routePermission).map(([path, roles]) => {
                    const routePath =
                        path === 'importPage' ? '/import' : `/${path}`;
                    return (
                        <Route
                            key={path}
                            path={routePath}
                            element={
                                <ProtectedRoute neededRoles={roles}>
                                    <DashboardLayout>
                                        {(() => {
                                            switch (path) {
                                                case 'dashboard':
                                                    return <DashboardPage />;
                                                case 'invoice':
                                                    return <InvoicePage />;
                                                case 'books':
                                                    return <BooksPage />;
                                                case 'customers':
                                                    return <CustomersPage />;
                                                case 'receipts':
                                                    return <ReceiptsPage />;
                                                case 'importPage':
                                                    return <ImportPage />;
                                                case 'promotions':
                                                    return <PromotionsPage />;
                                                case 'employees':
                                                    return <EmployeesPage />;
                                                case 'reports':
                                                    return <ReportsPage />;
                                                case 'regulations':
                                                    return <RegulationsPage />;
                                                case 'eProfile':
                                                    return <EmployeeProfile />;
                                                // case 'profile':
                                                //       return <MyPage />
                                                default:
                                                    return (
                                                        <div>
                                                            Page not found
                                                        </div>
                                                    );
                                            }
                                        })()}
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                    );
                })}
            </Routes>
        </>
    );
}
