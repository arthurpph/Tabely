import express, { Request, Response } from 'express';
import 'dotenv/config';
import { MongoDatabase } from './drivers/mongoClient';
import { UserRepository } from './repositories/userRepository';
import { UserService } from './services/user/userService';
import { UserController } from './controllers/userController';

const app: express.Application = express();

app.use(express.json());

if(!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL undefined');
}

const mongoDatabase: MongoDatabase = new MongoDatabase(process.env.DATABASE_URL);
const userRepository: UserRepository = new UserRepository(mongoDatabase.getClient());
const userService: UserService = new UserService(userRepository);
const userController: UserController = new UserController(userService);

app.get('/users', (req, res) => userController.getAllUsers(req, res));
app.post('/users', (req, res) => userController.addUser(req, res));

app.listen(8080, () => {
    console.log("Server initialized");
});