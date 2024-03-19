import express from 'express';
import { getUserByUsername } from "../service/user";
import {createPost, deletePost, getPostsByPage, getPostsByUserAndID} from "../service/post";
import {storePost, hidePost } from "../service/search";
import jwt, { JwtPayload } from "jsonwebtoken";

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

router.put("/delete-post", async (req: express.Request, res: express.Response) => {
    const { token } = req.cookies;
    let verify;

    if(token) {
         verify  = jwt.verify(token, process.env.JWTSHARED as any) as JwtPayload;
         if(verify) {
            const {userId, postId} = req.body;
    
            try {
                console.log("Deleting post ID: " + postId + " for user ID: " + userId);
    
                await deletePost(postId);
    
                await hidePost(postId)
    
                console.log(`Successfully deleted post ID: ${postId}`);
            } catch (error) {
                console.error(error);
            }
    
            return res.status(200).send('success');
        }
    }else{return res.status(403).send('Failed to authenticate user');}
});

export default router;
