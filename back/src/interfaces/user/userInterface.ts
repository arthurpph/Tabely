import { User } from "../../entities/user/user";

export interface UserInterface {
    getUsers(): Promise<User[]>
    getUserByEmail(email: string): Promise<User | null>
    saveUser(user: User): void;
}