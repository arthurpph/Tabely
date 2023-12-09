import { Request, Response } from "express";
import { PlaylistService } from "./playlistService";

export class PlaylistController {
    constructor(readonly playlistService: PlaylistService) {}

    async getUserPlaylists(req: Request, res: Response): Promise<void> {
        try {
            const email = req.query.email as string;
            const playlists = await this.playlistService.getUserPlaylists(email);
            res.json(playlists);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async getPlaylist(req: Request, res: Response): Promise<void> {
        try {
            const playlistId = req.query.playlistId as string;
            const playlist = await this.playlistService.getPlaylist(playlistId);
            res.json(playlist);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async createPlaylist(req: Request, res: Response): Promise<void> {
        try {
            const { name, ownerId } = req.body;
            const playlistId = await this.playlistService.createPlaylist(name, ownerId);
            res.json({ playlistId: playlistId });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async addPlaylistMusic(req: Request, res: Response): Promise<void> {
        try {
            const { playlistId, music } = req.body;
            await this.playlistService.addPlaylistMusic(playlistId, music);
            res.json(`Music ${music} successfully added to playlist ${playlistId}`);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }

    async updatePlaylist(req: Request, res: Response): Promise<void> {
        try {
            const { playlistId, playlistName } = req.body;
            await this.playlistService.updatePlaylistName(playlistId, playlistName);
            res.json(`Playlist ${playlistId} successfully updated`);
        } catch (err) {
            res.status(500).json({ error: err});
        }
    }

    async deletePlaylist(req: Request, res: Response): Promise<void> {
        try {
            const playlistId = req.query.playlistId as string;
            await this.playlistService.deletePlaylist(playlistId);
            res.json(`Playlist ${playlistId} successfully deleted`);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    }
}