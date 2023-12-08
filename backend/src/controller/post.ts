import express from 'express';
import { generateUploadURL } from '../service/s3';
import { getUserByUsername } from "../service/user";
import {createPost, getPostsByUserAndID} from "../service/post";
const router = express.Router();

router.post("/create", async (req: express.Request, res: express.Response) => {
    const { username,
        description,
        tags,
        image,
        recipeURL
    } = req.body;

    console.log("post /post/create username: " + username);

    const user = await getUserByUsername(username);
    const userId = user?.id;

    await createPost(userId, description, tags, image, recipeURL);

    res.sendStatus(200);
});

router.get("/get-posts/:username", async (req: express.Request, res: express.Response) => {
    try {
        const username: string = req.params["username"]

        const user = await getUserByUsername(username);
        const userId = user?.id;

        const posts = await getPostsByUserAndID(userId);

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.get("/s3Url", async (req: express.Request, res: express.Response) => {
    const imageURL = await generateUploadURL()
    return res.send({ imageURL });
});

export default router;