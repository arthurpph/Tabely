import { User } from "../../entities/user/user"

export interface AuthInterface {
    login(email: string, password: string): Promise<User>
    register(name: string, email: string, password: string): Promise<string>
}