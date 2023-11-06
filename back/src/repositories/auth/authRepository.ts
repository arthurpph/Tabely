import axios from 'axios';
import bcrypt from 'bcrypt';
import 'dotenv/config'
import { MongoClient } from "mongodb";
import { AuthInterface } from "../../interfaces/auth/authInterface";
import { User } from '../../entities/user/user';

export class AuthRepository implements AuthInterface {
    constructor(readonly client: MongoClient) {}

    async login(email: string, password: string): Promise<User> {
        try {
            const user = await axios.get(`${process.env.API_URL}/user`, {
                params: {
                    email: email
                }
            });
            return user.data;
        } catch (err) {
            throw err;
        }
        
    }

    async register(name: string, email: string, password: string): Promise<string> {
        try {
            const response = await axios.post(`${process.env.API_URL}/users`, {
                "name": name,
                "email": email,
                "password": await bcrypt.hash(password, 10)
            });

            return response.data;
        } catch (err) {
            throw err;
        }
    }
}