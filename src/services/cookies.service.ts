import Cookies from 'js-cookie';
export class CookiesService {
    static saveCookies(key: string, value: string, options?: any) {
        Cookies.set(key, value, {
            ...(options && options),
        });
    }
    static getCookie(key: string): string | undefined {
        const value = Cookies.get(key);
        if (!value) return undefined;
        try {
            const js = JSON.parse(value);
            return js; //Try to parse the json object
        } catch {
            return value;
        }
    }

    static removeCookie(key: string) {
        Cookies.remove(key);
    }
}
