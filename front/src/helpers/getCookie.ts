import cookies from 'js-cookie';

export function getCookie(cookieName: string): string | undefined {
    return cookies.get(cookieName);
}