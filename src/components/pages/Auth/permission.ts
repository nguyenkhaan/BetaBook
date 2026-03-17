export type Role = "admin" | "owner" | "staff";

interface RoutePermission {
  path: string;
  roles: Role[];
}

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
