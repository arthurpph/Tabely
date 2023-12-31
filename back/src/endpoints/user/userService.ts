import { ObjectId } from "mongodb";
import { User } from "../../entities/user/user";
import { MusicStructure } from "../../interfaces/music/musicStructure";
import { UserRepository } from "./userRepository";

export class UserService {
    constructor(readonly userRepository: UserRepository) {}

    async getUsers(): Promise<User[]> {
        try {
            return await this.userRepository.getUsers();
        } catch (err) {
            throw err;
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.getUserByEmail(email);
        } catch (err) {
            throw err;
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        try {
            return await this.userRepository.getUserById(userId)
        } catch (err) {
            throw err;
        }
    }

    async createUser(user: User): Promise<User> {
        try {
            await this.userRepository.saveUser(user);

            return user;
        } catch (err) {
            throw err;
        }
        
    }

    async changeUserCurrentMusic(userId: string, music: MusicStructure): Promise<void> {
        try {
            await this.userRepository.changeUserCurrentMusic(userId, music);
        } catch (err) {
            throw err;
        }
    }

    async changeUserCurrentTime(userId: string, time: number): Promise<void> {
        try {
            await this.userRepository.changeUserCurrentTime(userId, time);
        } catch (err) {
            throw err;
        }
    }

    async addUserPlaylist(userId: number, playlistId: ObjectId, name: string) {
        try {
            await this.userRepository.addUserPlaylist(userId, playlistId, name);
        } catch (err) {
            throw err;
        }
    }
}