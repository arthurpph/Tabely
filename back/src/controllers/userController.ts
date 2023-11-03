import { Request, Response } from "express";
import { UserService } from "../services/user/userService";
import { User } from "../entities/user";

export class UserController {
    constructor(readonly userService: UserService) {}

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getUsers();

            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Error while finding users ', description: err})
        }
    }

    async addUser(req: Request, res: Response) {
        try {
            const user = await this.userService.createUser(new User(req.body.name, req.body.email, req.body.password));
            res.json(`Usuário ${user.name} criado com sucesso`);
        } catch (err) {
            res.status(500).json({ error: 'Error while finding users ', description: err})
        }
    }
}