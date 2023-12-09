import { MongoClient } from "mongodb";

export class MongoDatabase {
    private client: MongoClient;

    constructor(readonly DATABASE_URL: string) {
        this.client = new MongoClient(this.DATABASE_URL);
        this.connect();
    }

    async connect(): Promise<void> {
        await this.client.connect();
    }

    getClient(): MongoClient {
        return this.client;
    }
}