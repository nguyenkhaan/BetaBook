import { CookiesService } from '../services/cookies.service';
import { LocalStorageService } from '../services/local-store.service';
export function checkLogin() {
    if (
        CookiesService.getCookie('accessToken') &&
        CookiesService.getCookie('refreshToken') &&
        localStorage.getItem('me')
    )
        return true;
    return false;
}
