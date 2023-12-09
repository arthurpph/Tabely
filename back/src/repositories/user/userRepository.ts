import { User } from "../../entities/user/user";
import { MusicStructure } from "../../interfaces/music/musicStructure";
import { UserInterface } from "../../interfaces/user/userInterface";
import { MongoClient, ObjectId } from 'mongodb';

export class UserRepository implements UserInterface {
    constructor(readonly client: MongoClient) {}

    async getUsers(): Promise<User[]> {
        try {
            const db = this.client.db();
            const usersCollection = db.collection('users');

            const users = await usersCollection.find({}).toArray();
            return users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                playlists: user.playlists
            }));
        } catch (err) {
            throw err;
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        try {
            const db = this.client.db();
            const usersCollection = db.collection('users');

            const user = await usersCollection.findOne({ email: email });

            if(user) {
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    currentMusic: user.currentMusic,
                    playlists: user.playlists
                };
            }

            return null;            
        } catch (err) {
            throw err;
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        try {
            const db = this.client.db();
            const usersCollection = db.collection('users');

            const user = await usersCollection.findOne({ 
                _id: new ObjectId(userId)
            });

            if(user) {
                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    currentMusic: user.currentMusic,
                    playlists: user.playlists
                }
            }

            return null;
        } catch (err) {
            throw err;
        }
    }

    async saveUser(user: User): Promise<void> {
        try {
            const db = this.client.db();
            const usersCollection = db.collection('users');
            
            delete user.currentMusic;
            delete user.id;

            await usersCollection.insertOne(user);
        } catch (err) {
            throw err;
        }
    }

    async changeUserCurrentMusic(userId: string, music: MusicStructure): Promise<void> {
        try {
            if (!music || typeof music !== 'object') {
                throw new Error('Music is not valid');
            }

            const db = this.client.db();
            const usersCollection = db.collection('users');

            await usersCollection.updateOne({ 
                _id: new ObjectId(userId) 
            }, 
            { 
                $set: {
                    currentMusic: music
                }
            });
        } catch (err) {
            throw err;
        }
    }

    async addUserPlaylist(userId: number, playlistId: ObjectId, name: string): Promise<void> {
        try {
            const db = this.client.db();
            const usersCollection = db.collection('users');

            await usersCollection.updateOne({
                _id: new ObjectId(userId)
            },
            {
                $push: {
                    playlists: {
                        _id: playlistId,
                        name: name
                    }
                }
            });
        } catch (err) {
            throw err;
        }
    }
}