import { User } from "../entities/user";

export interface userInterface {
    getUsers(): Promise<User[]>
    saveUser(user: User): void;
}