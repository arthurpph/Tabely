import { Request, Response } from "express";
import { uploadToImgur } from "../../infra/imgurAPI";
import { MongoClient, ObjectId } from "mongodb";

export class ImageController {
    constructor(readonly client: MongoClient) {}

    async uploadPlaylistImageToImgur(req: Request, res: Response): Promise<void> {
        const { image, playlistId } = req.body;

        try {
            const imageUploadLink = uploadToImgur(image);

            const db = this.client.db();
            const playlistsCollection = db.collection('playlists');

            await playlistsCollection.updateOne({
                _id: new ObjectId(playlistId)
            },
            {
                imageURL: imageUploadLink
            })

            res.json(imageUploadLink);
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error', error: JSON.stringify(err) });
        }
    }
}