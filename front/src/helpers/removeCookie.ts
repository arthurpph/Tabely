import cookies from 'js-cookie';

export function removeCookie(cookieName: string): void {
    cookies.remove(cookieName);
}