import { User } from "../../entities/user/user";
import { UserInterface } from "../../interfaces/user/userInterface";
import { MongoClient } from 'mongodb';

export class UserRepository implements UserInterface {
    constructor(readonly client: MongoClient) {}

    async getUsers(): Promise<User[]> {
        try {
            const db = this.client.db();
            const usersCollection = db.collection('users');

            const users = await usersCollection.find({}).toArray();
            return users.map(user => ({
                name: user.name,
                email: user.email,
                password: user.password
            }));
        } catch (err) {
            throw err;
        }
    }

    async getUser(email: string): Promise<User | null> {
        try {
            const db = this.client.db();
            const usersCollection = db.collection('users');

            const user = await usersCollection.findOne({ email: email });

            if(user) {
                return {
                    name: user.name,
                    email: user.email,
                    password: user.password
                };
            }

            return null;            
        } catch (err) {
            throw err;
        }
    }

    async saveUser(user: User): Promise<void> {
        try {
            const db = this.client.db();
            const usersCollection = db.collection('users');
            
            await usersCollection.insertOne(user);
        } catch (err) {
            throw err;
        }
    }
}