import { User } from "../../entities/user";

export interface UserInterface {
    getUsers(): Promise<User[]>
    getUser(email: string): Promise<User | null>
    saveUser(user: User): void;
}