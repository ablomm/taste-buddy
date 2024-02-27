import express from 'express';
import { generateUploadURL } from '../service/s3';
import { getUserByUsername } from "../service/user";
import {createPost, getPostsByPage, getPostsByUserAndID} from "../service/post";
import {storePost} from "../service/search";
const router = express.Router();

router.post("/create", async (req: express.Request, res: express.Response) => {
    try {
        const { username,
            description,
            tags,
            image,
            recipeURL
        } = req.body;

        console.log("post /create username: " + username)

        const user = await getUserByUsername(username);
        const userId = user?.id;
        const postID = await createPost(userId, description, tags, image, recipeURL);

        // Store post in elastic search db
        await storePost(userId, description, tags, image, recipeURL, postID);

        res.sendStatus(200);
    } catch(error) {
        console.error(error);
    }
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

router.get("/page/:page", async (req: express.Request, res: express.Response) => {
    const page: number = parseInt(req.params["page"]);
    return res.send(await getPostsByPage(page));
});

router.get("/s3Url", async (req: express.Request, res: express.Response) => {
    const imageURL = await generateUploadURL()
    return res.send({ imageURL });
});

export default router;
