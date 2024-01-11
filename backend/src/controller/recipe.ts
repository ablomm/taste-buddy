import express from 'express';
import { generateUploadURL } from '../service/s3';
import {
    createRecipe,
    createIngredients,
    createInstructions,
    getRecipeByUserAndTitle,
    getAllRecipes,
    updateRecipe,
    updateIngredients,
    updateInstructions
} from '../service/recipe';
import { getUserByUsername } from "../service/user";
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

router.get("/getAllRecipes", async (req: express.Request, res: express.Response) => {
    const allRecipes = await getAllRecipes();
    return res.json({allRecipes});
});

router.put("/edit-recipe", async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    const {
        username,
        recipeId,
        title,
        description,
        instructions,
        cookTime,
        calories,
        servings,
        ingredients,
        tags,
        image
    } = req.body;

    try {
        const user = await getUserByUsername(username)
        const userId = user?.id;

        console.log("Updating recipe ID: " + recipeId + " for user ID: " + userId);

        await updateRecipe(
            recipeId,
            userId,
            title,
            description,
            cookTime,
            calories,
            servings,
            image
        );

        await updateIngredients(recipeId, ingredients);
        await updateInstructions(recipeId, instructions);

        console.log(`Successfully updated recipe ID: ${recipeId}`);
    } catch (error) {
        console.error(error);
    }

    return res.send('success');
});

export default router;
