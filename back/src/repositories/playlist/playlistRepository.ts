import { MongoClient, ObjectId } from "mongodb";
import { userService } from "../..";
import { PlaylistStructure } from "../../interfaces/playlist/playlistStructure";
import { MusicStructure } from "../../interfaces/music/musicStructure";

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
                                _id: playlist._id,
                                name: playlist.name,
                                musics: playlist.musics,
                                ownerId: playlist.ownerId,
                                imageURL: playlist.imageURL
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

    async getPlaylist(playlistId: string): Promise<PlaylistStructure | null> {
        const db = this.client.db();
        const playlistsCollection = db.collection('playlists');

        const playlist = await playlistsCollection.findOne({
            _id: new ObjectId(playlistId)
        });

        if(playlist) {
            return {
                _id: playlist._id,
                name: playlist.name,
                musics: playlist.musics,
                ownerId: playlist.ownerId,
                imageURL: playlist.imageURL
            }
        } else {
            return null;
        }
    }

    async createPlaylist(name: string, ownerId: number): Promise<ObjectId> {
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

            return playlistId
        } catch (err) {
            throw err;
        }
    }

    async addPlaylistMusic(playlistId: string, music: MusicStructure): Promise<void> {
        try {
            const db = this.client.db();
            const playlistsCollection = db.collection('playlists');

            await playlistsCollection.updateOne({
                _id: new ObjectId(playlistId)
            },
            {
                $push: { musics: music }
            });
        } catch (err) {
            throw err;
        }
    }

    async updatePlaylistName(playlistId: string, newPlaylistName: string): Promise<void> {
        try {
            const db = this.client.db();
            const playlistsCollection = db.collection('playlists');

            await playlistsCollection.updateOne({
                _id: new ObjectId(playlistId)
            }, 
            {
                $set: { name: newPlaylistName }
            });
        } catch (err) {
            throw err;
        }
    }

    async deletePlaylist(playlistId: string): Promise<void> {
        try {
            const db = this.client.db();
            const playlistsCollection = db.collection('playlists');

            const playlist = await playlistsCollection.findOne({
                _id: new ObjectId(playlistId)
            });

            if(!playlist) {
                throw new Error('Playlist not found');
            }
            const ownerId = playlist.ownerId;

            await playlistsCollection.deleteOne({
                _id: new ObjectId(playlistId)
            });

            const usersCollection = db.collection('users');

            await usersCollection.updateOne({
                _id: new ObjectId(ownerId)
            }, 
            {
                $pull: { playlists: new ObjectId(playlistId) }
            });
        } catch (err) {
            throw err;
        }
    }
}