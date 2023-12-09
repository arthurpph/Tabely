import { Request, Response } from "express";
import { uploadToImgur } from "../../infra/imgurAPI";
import { MongoClient, ObjectId } from "mongodb";

export class ImageController {
    constructor(readonly client: MongoClient) {}

    async uploadPlaylistImageToImgur(req: Request, res: Response): Promise<void> {
        const playlistId = req.query.playlistId as string;
        const file = req.file?.buffer;

        if(!file) {
            console.error('Invalid image');
            return;
        }

        try {
            const imageUploadLink = await uploadToImgur(file);

            const db = this.client.db();
            const playlistsCollection = db.collection('playlists');

            await playlistsCollection.updateOne({
                _id: new ObjectId(playlistId)
            },
            {
                $set: {
                    imageURL: imageUploadLink
                }
            })

            res.json(imageUploadLink);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error', error: JSON.stringify(err) });
        }
    }
}