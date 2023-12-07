import express, { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateUploadURL } from '../service/s3';
import { createRecipe, createIngredients, createInstructions, getRecipeByUserAndTitle } from '../service/recipe';
import { getUserByUsername } from "../service/user";
const prisma = new PrismaClient();
const router = express.Router();

router.post("/save", async (req: express.Request, res: express.Response) => {
    const { username,
        title,
        description,
        instructions,
        cookTime,
        calories,
        servings,
        ingredients: ingredients,
        tags: tags,
        image 
    } = req.body;
    console.log("recipe /save username: " + username)
    const user = await getUserByUsername(username)
    const userId = user?.id;
    await createRecipe(userId,title,description,instructions,cookTime,calories,servings,tags,image);
    
    const recipeID = (await getRecipeByUserAndTitle(userId,title))?.id;

    await createIngredients(recipeID, ingredients);
    await createInstructions(recipeID, instructions);

    res.sendStatus(200);
});

router.get("/s3Url", async (req: express.Request, res: express.Response) => {
    const imageURL = await generateUploadURL()
    return res.send({ imageURL });
});

export default router;