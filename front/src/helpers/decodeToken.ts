import { jwtDecode } from 'jwt-decode';
import { JwtDecodeInterface } from '../interfaces/jwtDecodeInterface';
import { getCookie } from './getCookie';

export function decodeToken(token: string, tokenName?: string): JwtDecodeInterface {
    if(!token && !tokenName) {
        throw new Error('At least one parameter should be passed');
    }

    let tokenContent;

    if(tokenName) {
        tokenContent = getCookie(tokenName);
    } else {
        tokenContent = token;
    }

    return jwtDecode<JwtDecodeInterface>(tokenContent!);
}