import { ObjectId } from "mongodb";
import { PlaylistStructure } from "../../interfaces/playlist/playlistStructure";
import { PlaylistRepository } from "./playlistRepository";
import { MusicStructure } from "../../interfaces/music/musicStructure";

export class PlaylistService {
    constructor(readonly playlistRepository: PlaylistRepository) {}

    async getUserPlaylists(userEmail: string): Promise<PlaylistStructure[]> {
        try {
            return await this.playlistRepository.getUserPlaylists(userEmail);
        } catch (err) {
            throw err;
        }
    }

    async getPlaylist(playlistId: string): Promise<PlaylistStructure | null> {
        try {
            return await this.playlistRepository.getPlaylist(playlistId)
        } catch (err) {
            throw err;
        } 
    }

    async createPlaylist(playlistName: string, ownerId: number): Promise<ObjectId> {
        try {
            return this.playlistRepository.createPlaylist(playlistName, ownerId);
        } catch (err) {
            throw err;
        }
    }

    async addPlaylistMusic(playlistId: string, music: MusicStructure): Promise<void> {
        try {
            this.playlistRepository.addPlaylistMusic(playlistId, music);
        } catch (err) {
            throw err;
        }
    }

    async updatePlaylistName(playlistId: string, newPlaylistName: string): Promise<void> {
        try {
            this.playlistRepository.updatePlaylistName(playlistId, newPlaylistName);
        } catch (err) {
            throw err;
        }
    }

    async deletePlaylist(playlistId: string): Promise<void> {
        try {
            this.playlistRepository.deletePlaylist(playlistId);
        } catch (err) {
            throw err;
        }
    }
}