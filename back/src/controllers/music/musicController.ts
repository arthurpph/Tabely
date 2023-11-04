import { Request, Response } from "express";
import { MusicService } from "../../services/music/musicService";

export class MusicController {
    constructor(readonly musicService: MusicService) {}

    async getMusics(req: Request, res: Response): Promise<void> {
        try {
            const musics = await this.musicService.getMusics();

            res.json(musics);
        } catch (err) {
            res.status(500).json({ error: 'Error while finding musics', description: err});
        }
    }
}