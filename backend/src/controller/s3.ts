import express from 'express';
import { generateUploadURL } from '../service/s3';

const router = express.Router();

router.get("/s3GenerateUrl", async (req: express.Request, res: express.Response) => {
    const imageURL = await generateUploadURL()
    return res.send({ imageURL });
});

export default router;