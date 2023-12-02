import { Request, Response } from "express";
import { PlaylistService } from "../../services/playlist/playlistService";

export class PlaylistController {
    constructor(readonly playlistService: PlaylistService) {}

    async getUserPlaylist(req: Request, res: Response): Promise<void> {
        try {
            const email = req.query.email as string;
            const playlists = await this.playlistService.getUserPlaylists(email);
            res.json(playlists);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async createPlaylist(req: Request, res: Response): Promise<void> {
        try {
            const { name, ownerId } = req.body;
            await this.playlistService.createPlaylist(name, ownerId);
            res.json(`Playlist ${name} sucessfully created`);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}