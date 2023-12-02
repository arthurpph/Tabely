import { MusicStructure } from "./musicStructure";

export interface PlaylistStructure {
    _id?: string,
    name: string;
    musics: MusicStructure[];
    ownerId: string;
}