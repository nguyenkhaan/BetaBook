export class LocalStorageService {
    static saveKey(key: string, value: string) {
        localStorage.setItem(key, value);
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
}
