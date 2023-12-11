import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import 'dotenv/config';
import { MongoDatabase } from './infra/mongoClient';
import { UserRepository } from './endpoints/user/userRepository';
import { UserService } from './endpoints/user/userService';
import { UserController } from './endpoints/user/userController';
import { AuthRepository } from './endpoints/auth/authRepository';
import { AuthService } from './endpoints/auth/authService';
import { AuthController } from './endpoints/auth/authController';
import { MusicRepository } from './endpoints/music/musicRepository';
import { MusicService } from './endpoints/music/musicService';
import { MusicController } from './endpoints/music/musicController';
import { PlaylistRepository } from './endpoints/playlist/playlistRepository';
import { PlaylistService } from './endpoints/playlist/playlistService';
import { PlaylistController } from './endpoints/playlist/playlistController';
import { ImageController } from './endpoints/image/imageController';

const app: express.Application = express();

if(!process.env.DATABASE_URL || !process.env.ALLOWED_ORIGINS) {
    throw new Error('Environment variables undefined');
}

const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);
const corsOptions = {
    origin: (origin: string | undefined, cb: (error: Error | null, success: boolean) => void) => {
        if(!origin || allowedOrigins.indexOf(origin) !== -1) {
            cb(null, true);
        } else {
            console.log(origin);
            cb(new Error('Unauthorized by CORS'), false);
        }
    }

}

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mongoDatabase: MongoDatabase = new MongoDatabase(process.env.DATABASE_URL);

const userRepository: UserRepository = new UserRepository(mongoDatabase.getClient());
export const userService: UserService = new UserService(userRepository);
const userController: UserController = new UserController(userService);

const authRepository: AuthRepository = new AuthRepository(mongoDatabase.getClient());
const authService: AuthService = new AuthService(authRepository);
const authController: AuthController = new AuthController(authService);

const musicRepository: MusicRepository = new MusicRepository(mongoDatabase.getClient());
const musicService: MusicService = new MusicService(musicRepository);
const musicController: MusicController = new MusicController(musicService);

const playlistRepository: PlaylistRepository = new PlaylistRepository(mongoDatabase.getClient());
const playlistService: PlaylistService = new PlaylistService(playlistRepository);
const playlistController: PlaylistController = new PlaylistController(playlistService);

const imageController: ImageController = new ImageController(mongoDatabase.getClient());

app.get('/users', (req, res) => userController.getAllUsers(req, res));
app.post('/users', (req, res) => userController.addUser(req, res));

app.get('/user', (req, res) => userController.getUserByEmail(req, res));
app.get('/user/:userId', (req, res) => userController.getUserById(req, res));
app.put('/user/playlist', (req, res) => userController.addUserPlaylist(req, res));

app.put('/music/user/:id', (req, res) => userController.changeUserCurrentMusic(req, res));
app.put('/music/user/time/:time', (req, res) => userController.changeUserCurrentTime(req, res));

app.get('/music/:musicname', (req, res) => musicController.getMusic(req, res));
app.get('/musics', (req, res) => musicController.getMusics(req, res));

app.post('/auth/login', (req, res) => authController.login(req, res));
app.post('/auth/register', (req, res) => authController.register(req, res));

app.get('/playlists', (req, res) => playlistController.getUserPlaylists(req, res));
app.get('/playlist', (req, res) => playlistController.getPlaylist(req, res));
app.post('/playlist', (req, res) => playlistController.createPlaylist(req, res));
app.put('/playlist', (req, res) => playlistController.updatePlaylist(req, res));
app.put('/playlist/music', (req, res) => playlistController.addPlaylistMusic(req, res));
app.delete('/playlist', (req, res) => playlistController.deletePlaylist(req, res));

app.post('/playlist/image', upload.single('image'), (req, res) => imageController.uploadPlaylistImageToImgur(req, res));

app.listen(8080, () => {
    console.log("Server initialized");
});

import axios from 'axios';

const request = async () => {
    const response = await axios.get('https://tabely-py16.onrender.com/users');
}

setInterval(request, 600000);
