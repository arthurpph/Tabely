import axios from 'axios';
import bcrypt from 'bcrypt';
import { MongoClient } from "mongodb";
import { AuthInterface } from "../../interfaces/auth/authInterface";
import { User } from '../../entities/user';

export class AuthRepository implements AuthInterface {
    constructor(readonly client: MongoClient) {}

    async login(email: string, password: string): Promise<User> {
        try {
            const user = await axios.get('http://localhost:8080/user', {
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
            const response = await axios.post('http://localhost:8080/users', {
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