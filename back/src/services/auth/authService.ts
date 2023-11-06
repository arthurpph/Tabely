import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import 'dotenv/config'
import { AuthInterface } from "../../interfaces/auth/authInterface";
import { LoginResponse } from "../../interfaces/auth/loginInterface";

export class AuthService {
    constructor(readonly authRepository: AuthInterface) {}

    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const data = await this.authRepository.login(email, password);
            
            if(!process.env.SECRET_KEY) {
                throw new Error('JWT Secret Key not defined');
            }

            if(!data) {
                return {
                    success: false,
                    response: 'Usuário não encontrado'
                }
            }

            if(!await bcrypt.compare(password, data.password)) {
                return {
                    success: false,
                    response: 'Senha incorreta'
                }
            }

            return {
                success: true,
                response: 'Login realizado',
                accessToken: jwt.sign(data, process.env.SECRET_KEY)
            }
        } catch (err) {
            throw err;
        }
    }

    async register(name: string, email: string, password: string): Promise<string> {
        try {
            const emailValidation = await axios.get(`${process.env.API_URL}/user`, {
                params: {
                    email: email
                }
            });

            if(emailValidation.data !== null) {
                return "Usuário com este email já existente";
            }

            return await this.authRepository.register(name, email, password);
        } catch (err) {
            throw err;
        }
    }
}