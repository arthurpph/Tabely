import { ObjectId } from "mongodb";
import { MusicStructure } from "../music/musicStructure";

export interface PlaylistStructure {
    _id?: ObjectId,
    name: string;
    musics: MusicStructure[];
    ownerId: number;
    imageURL: string | null;
}