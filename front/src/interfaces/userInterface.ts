import { MusicStructure } from "./musicStructure";

export interface UserInterface {
    id: string;
    name: string;
    email: string;
    password: string;
    currentMusic: MusicStructure;
    currentTime: number;
}