import { User } from "../../entities/user/user";
import { UserInterface } from "../../interfaces/user/userInterface";

export class UserService {
    constructor(readonly userRepository: UserInterface) {}

    async getUsers(): Promise<User[]> {
        return await this.userRepository.getUsers();
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.getUserByEmail(email)
    }

    async createUser(user: User): Promise<User> {
        await this.userRepository.saveUser(user);
    
        return user;
    }
}