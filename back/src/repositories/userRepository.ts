import { User } from "../entities/user";
import { userInterface } from "../interfaces/userInterface";
import { MongoClient } from 'mongodb';

export class UserRepository implements userInterface {
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