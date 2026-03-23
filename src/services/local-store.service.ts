export class LocalStorageService {
    static saveValue(key : string , value : any) 
    {
        try 
        {
            const data = JSON.stringify(value) 
            localStorage.setItem(key , data) 
            return true 
        } 
        catch (err) 
        {
            return false 
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
}
