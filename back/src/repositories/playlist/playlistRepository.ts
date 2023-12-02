import { MongoClient, ObjectId } from "mongodb";
import { userService } from "../..";
import { PlaylistStructure } from "../../interfaces/playlist/playlistStructure";

export class PlaylistRepository {
    constructor(readonly client: MongoClient) {}

    async getUserPlaylists(userEmail: string): Promise<PlaylistStructure[]> {
        try {
            const user = await userService.getUserByEmail(userEmail);

            const userPlaylists = user?.playlists;

            const db = this.client.db();
            const playlistsCollection = db.collection('playlists');

            const playlists: PlaylistStructure[] = []

            if(userPlaylists) {
                for(const playlistId of userPlaylists) {
                    if(typeof playlistId === 'string' || playlistId instanceof ObjectId) {
                        const playlist = await playlistsCollection.findOne({
                            _id: new ObjectId(playlistId)
                        });
            
                        if(playlist) {
                            const mappedPlaylist: PlaylistStructure = {
                                name: playlist.name,
                                musics: playlist.musics,
                                ownerId: playlist.ownerId,
                            };

                            playlists.push(mappedPlaylist);
                        }
                    }
                }
            }

            return playlists;
        } catch (err) {
            throw err;
        }
    }

    async getPlaylist(name: string, ownerId: number): Promise<PlaylistStructure | null> {
        const db = this.client.db();
        const playlistsCollection = db.collection('playlists');

        const playlist = await playlistsCollection.findOne({
            name: name,
            ownerId: ownerId
        });

        if(playlist) {
            return {
                _id: playlist._id,
                name: playlist.name,
                musics: playlist.musics,
                ownerId: playlist.ownerId
            }
        } else {
            return null;
        }
    }

    async createPlaylist(name: string, ownerId: number): Promise<void> {
        try {
            const db = this.client.db();
            const playlistsCollection = db.collection('playlists');

            const createdPlaylist = await playlistsCollection.insertOne({
                name: name,
                musics: [],
                ownerId: ownerId
            });

            const playlistId: ObjectId = createdPlaylist.insertedId;

            await userService.addUserPlaylist(ownerId, playlistId);
        } catch (err) {
            throw err;
        }
    }
}