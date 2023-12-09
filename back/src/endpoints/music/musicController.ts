import { Request, Response } from "express";
import { MusicService } from "./musicService";
import path from 'path';

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

    async getMusic(req: Request, res: Response): Promise<void> {
        const musicName = req.params.musicname;
        const musicPath = path.join(__dirname, '../../public/', musicName);

        res.download(`${musicPath}.mp3`);
    }
}