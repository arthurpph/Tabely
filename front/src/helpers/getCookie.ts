import cookies from 'js-cookie';

export function getCookie(tokenName: string): string | undefined {
    return cookies.get(tokenName);
}