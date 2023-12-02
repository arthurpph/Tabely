import { userService } from "../..";
import { PlaylistStructure } from "../../interfaces/playlist/playlistStructure";
import { PlaylistRepository } from "../../repositories/playlist/playlistRepository";

export class PlaylistService {
    constructor(readonly playlistRepository: PlaylistRepository) {}

    async getUserPlaylists(userEmail: string): Promise<PlaylistStructure[]> {
        try {
            return await this.playlistRepository.getUserPlaylists(userEmail);
        } catch (err) {
            throw err;
        }
    }

    async createPlaylist(name: string, ownerId: number): Promise<void> {
        try {
            this.playlistRepository.createPlaylist(name, ownerId);
        } catch (err) {
            throw err;
        }
    }
}