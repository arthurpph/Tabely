import { ObjectId } from "mongodb";
import { MusicStructure } from "../../interfaces/music/musicStructure";

export class User {
    constructor(public name: string, public email: string, public password: string, public currentMusic?: MusicStructure, public id?: ObjectId) {}
}