import { Navigate } from "react-router-dom";

type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER";

interface Props {
  children: React.ReactNode;
  role: Role;
  allowedRoles?: Role[];
}

export const ProtectedRoute = ({ children, role, allowedRoles }: Props) => {
  if (!allowedRoles) return <>{children}</>;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
