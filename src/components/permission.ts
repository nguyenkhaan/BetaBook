export type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER";

interface RoutePermission {
  path: string;
  roles: Role[];
}

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

  // { path: "/resignation", roles: ["admin", "EMPLOYEE"] },
  { path: "/approval", roles: ["ADMIN", "EMPLOYEE"] },

  { path: "/mypage", roles: ["ADMIN", "EMPLOYEE"] },
];
