import { Request, Response } from "express";
import { UserService } from "../../services/user/userService";
import { User } from "../../entities/user/user";

export class UserController {
    constructor(readonly userService: UserService) {}

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getUsers();

            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Error while finding users', description: err});
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        try {
            const email = req.query.email;

            if(typeof email === 'string') {
                const user = await this.userService.getUserByEmail(email);

                res.json(user);
            } else {
                res.status(400).json({ error: 'Email is not a string'});
            }
        } catch (err) {
            res.status(500).json({ error: 'Error while finding user', description: err});
        }
    }

    async addUser(req: Request, res: Response) {
        try {
            const user = await this.userService.createUser(new User(req.body.name, req.body.email, req.body.password));
            res.json(`Usuário ${user.name.charAt(0).toUpperCase() + user.name.slice(1)} criado com sucesso`);
        } catch (err) {
            res.status(500).json({ error: 'Error adding user', description: err});
        }
    }
}