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

    async getUserById(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const user = await this.userService.getUserById(userId);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: 'Error while finding user', description: err});
        }
    }

    async addUser(req: Request, res: Response) {
        try {
            const user = await this.userService.createUser(new User(req.body.name, req.body.email, req.body.password, []));
            res.json(`Usuário ${user.name.charAt(0).toUpperCase() + user.name.slice(1)} criado com sucesso`);
        } catch (err) {
            res.status(500).json({ error: 'Error adding user', description: err});
        }
    }

    async changeUserCurrentMusic(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const music = req.body.music;
            await this.userService.changeUserCurrentMusic(id, music);
            res.json(`Usuário atualizado com sucesso`);
        } catch (err) {
            res.status(500).json({ error: 'Error while updating user', description: err });
        }
    }

    async addUserPlaylist(req: Request, res: Response) {
        try {
            const { userId, playlistId } = req.body;
            await this.userService.addUserPlaylist(userId, playlistId);
            res.json(`Playlist ${playlistId} adicionada ao usuário ${userId}`);
        } catch (err) {
            res.status(500).json({ error: 'Error while adding playlist to a user', description: err});
        }
    }
}