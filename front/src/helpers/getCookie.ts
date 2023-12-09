export function getCookie(cookieName: string): string | null {
    return localStorage.getItem(cookieName);
}