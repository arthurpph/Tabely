import { ObjectId } from "mongodb";
import { MusicStructure } from "../../interfaces/music/musicStructure";
import { PlaylistStructure } from "../../interfaces/playlist/playlistStructure";

export class User {
    constructor(
        public name: string, 
        public email: string, 
        public password: string, 
        public playlists: PlaylistStructure[], 
        public currentMusic?: MusicStructure, 
        public currentTime?: string, 
        public id?: ObjectId, 
    ) {}
}