import { MusicInterface } from "../../interfaces/music/musicInterface";

export class MusicService {
    constructor(readonly musicRepository: MusicInterface) {}

    async getMusics() {
        return await this.musicRepository.getMusics();
    }
}