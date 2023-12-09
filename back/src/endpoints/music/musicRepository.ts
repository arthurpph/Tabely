import { MongoClient } from "mongodb";
import { MusicInterface } from "../../interfaces/music/musicInterface";
import { Music } from "../../entities/music/music";

export class MusicRepository implements MusicInterface {
    constructor(readonly client: MongoClient) {}

    async getMusics(): Promise<Music[]> {
        try {
            const db = this.client.db();
            const musicsCollection = db.collection('musics');

            const musics = await musicsCollection.find({}).toArray();
            return musics.map(music => ({
                name: music.name,
                artist: music.artist,
                album: music.album,
                duration: music.duration,
                imageURL: music.imageURL,
                musicURL: music.musicURL
            }));
        } catch (err) {
            throw err;
        }
    }
}