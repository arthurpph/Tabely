import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import { MongoDatabase } from './drivers/mongoClient';
import { UserRepository } from './repositories/user/userRepository';
import { UserService } from './services/user/userService';
import { UserController } from './controllers/user/userController';
import { AuthRepository } from './repositories/auth/authRepository';
import { AuthService } from './services/auth/authService';
import { AuthController } from './controllers/auth/authController';
import { MusicRepository } from './repositories/music/musicRepository';
import { MusicService } from './services/music/musicService';
import { MusicController } from './controllers/music/musicController';

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
            cb(new Error('Unauthorized by CORS'), false);
        }
    }
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

const mongoDatabase: MongoDatabase = new MongoDatabase(process.env.DATABASE_URL);

const userRepository: UserRepository = new UserRepository(mongoDatabase.getClient());
const userService: UserService = new UserService(userRepository);
const userController: UserController = new UserController(userService);

const authRepository: AuthRepository = new AuthRepository(mongoDatabase.getClient());
const authService: AuthService = new AuthService(authRepository);
const authController: AuthController = new AuthController(authService);

const musicRepository: MusicRepository = new MusicRepository(mongoDatabase.getClient());
const musicService: MusicService = new MusicService(musicRepository);
const musicController: MusicController = new MusicController(musicService);

app.get('/users', (req, res) => userController.getAllUsers(req, res));
app.post('/users', (req, res) => userController.addUser(req, res));

app.get('/user', (req, res) => userController.getUserByEmail(req, res));

app.get('/musics', (req, res) => musicController.getMusics(req, res));

app.post('/auth/login', (req, res) => authController.login(req, res));
app.post('/auth/register', (req, res) => authController.register(req, res));

app.listen(8080, () => {
    console.log("Server initialized");
});