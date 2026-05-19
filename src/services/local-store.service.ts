const AUTH_STORAGE_EVENT = 'betabook-auth-storage-change';

export class LocalStorageService {
    private static notifyAuthChanged(key: string) {
        if (key !== 'me' || typeof window === 'undefined') return;
        window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
    }

    static saveValue(key: string, value: any) {
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(key, data);
            this.notifyAuthChanged(key);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    static getValue(key: string) {
        const value = localStorage.getItem(key);
        if (!value) return undefined;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
    static getRole()  {
        const value = localStorage.getItem('me') 
        if (!value) return undefined  //Yeu cau nguoi dung phai dang nhap lai 
        return JSON.parse(value).roles 
    }

    static removeValue(key: string) {
        localStorage.removeItem(key);
        this.notifyAuthChanged(key);
    }

    static isAdmin(): boolean {
        return this.getRole()?.includes('ADMIN') ?? false;
    }

    static isEmployee(): boolean {
        return this.getRole()?.includes('EMPLOYEE') ?? false;
    }
}

export { AUTH_STORAGE_EVENT };
