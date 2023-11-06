import { Request, Response } from 'express';
import { AuthService } from '../../services/auth/authService';

export class AuthController {
    constructor(readonly authService: AuthService) {}

    async login(req: Request, res: Response) {
        const response = await this.authService.login(req.body.email, req.body.password);
        res.json(response);
    }

    async register(req: Request, res: Response) {
        const user = await this.authService.register(req.body.name, req.body.email, req.body.password);
        if(user === 'Usuário com este email já existente') {
            res.status(409).json({ message: 'Usuário já registrado com este email'});
            return;
        }
        res.json(user);
    }
}