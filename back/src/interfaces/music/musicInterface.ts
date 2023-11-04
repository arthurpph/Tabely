import { Music } from "../../entities/music/music";

export interface MusicInterface {
    getMusics(): Promise<Music[]>
}