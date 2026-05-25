import { Role } from '../bases/constants/app.constants';
export const routePermission: Record<string, Role[]> = {
    dashboard: ['EMPLOYEE'],
    invoice: ['EMPLOYEE'],
    books: ['EMPLOYEE'],
    customers: ['EMPLOYEE'],
    receipts: ['EMPLOYEE'],
    importPage: ['EMPLOYEE'],
    promotions: ['EMPLOYEE'],
    employees: ['ADMIN'],
    reports: ['ADMIN'],
    regulations: ['EMPLOYEE'],
    profile: ['EMPLOYEE'],
    eProfile: ['ADMIN' , 'EMPLOYEE'],
};
