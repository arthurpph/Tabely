import { User } from "../../entities/user";
import { userInterface } from "../../interfaces/userInterface";

export class UserService {
    constructor(readonly userRepository: userInterface) {}

    async getUsers(): Promise<User[]> {
        return await this.userRepository.getUsers();
    }

    async createUser(user: User): Promise<User> {
        await this.userRepository.saveUser(user);
    
        return user;
    }
}