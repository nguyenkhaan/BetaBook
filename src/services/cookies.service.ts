import Cookies from 'js-cookie';
import { TokenType } from '../bases/enums/jwt.enum';
import { ACCESS_LIVE_TIME, REFRESH_LIVE_TIME } from '../bases/constants/jwt.constants';
export class CookiesService {
    static saveToken(token : string , type : TokenType) 
    {
        const ti : number = ((type == TokenType.ACCESS_TOKEN)? ACCESS_LIVE_TIME : REFRESH_LIVE_TIME) 
        Cookies.set(type.toString() , token , {
            expires : ti, 
            path : '/', 
            secure : true, 
            sameSite : 'Strict'
        })
    } 
    static getToken(type : TokenType) 
    {
        const token = Cookies.get(type.toString()) 
        return token 
    }

    static removeCookie(key: string) {
        Cookies.remove(key);
    }
}
