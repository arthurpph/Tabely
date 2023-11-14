import { User } from "../../entities/user/user";
import { MusicStructure } from "../music/musicStructure";

export interface UserInterface {
    getUsers(): Promise<User[]>
    getUserByEmail(email: string): Promise<User | null>
    saveUser(user: User): void;
    changeUserCurrentMusic(userId: string, music: MusicStructure): Promise<void>
}