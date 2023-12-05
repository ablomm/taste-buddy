import express, { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateUploadURL } from '../service/s3';
import { createRecipe } from '../service/recipe';
const prisma = new PrismaClient();
const router = express.Router();

router.post("/save", async (req: express.Request, res: express.Response) => {
    const { title,
        description,
        instructions,
        cookTime,
        calories,
        servings,
        image 
    } = req.body;
    
    await createRecipe(title,description,instructions,cookTime,calories,servings,image);
    res.sendStatus(200);
});

router.get("/s3Url", async (req: express.Request, res: express.Response) => {
    const imageURL = await generateUploadURL()
    return res.send({ imageURL });
});

export default router;