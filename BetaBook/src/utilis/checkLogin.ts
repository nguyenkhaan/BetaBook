import { TokenType } from '../bases/enums/jwt.enum';
import { CookiesService } from '../services/cookies.service';
import { LocalStorageService } from '../services/local-store.service';
export function checkLogin() {
    if (
        CookiesService.getToken(TokenType.ACCESS_TOKEN) &&
        CookiesService.getToken(TokenType.REFRESH_TOKEN) &&
        LocalStorageService.getValue('me')
    )
        return true;
    return false;
}
