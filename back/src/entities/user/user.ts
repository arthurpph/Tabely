import { ObjectId } from "mongodb";

export class User {
    constructor(public name: string, public email: string, public password: string, public currentMusic?: string, public id?: ObjectId) {}
}