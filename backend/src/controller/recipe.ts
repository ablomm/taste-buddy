import express from 'express';
import { generateUploadURL } from '../service/s3';
import {
    createRecipe,
    createIngredients,
    createInstructions,
    getRecipeByUserAndTitle,
    updateRecipe,
    updateIngredients,
    updateInstructions,
    getRecipes,
    createReview,
    getReviewsByPage
} from '../service/recipe';
import { getUserByUsername, getProfilePhotoByUsername } from "../service/user";
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

router.get("/getPosts", async (req: express.Request, res: express.Response) => {
    const posts = await getRecipes()
    return res.send({posts});
});

router.post("/saveReview", async (req: express.Request, res: express.Response) => {
    const { username,
        recipeID,
        rating,
        reviewText,
    } = req.body;

    console.log("username", req.body)
    try {
        const user = await getUserByUsername(username)
        const profilePic = await getProfilePhotoByUsername(username);
        const userID = user?.id;
        await createReview(recipeID ,reviewText, rating, userID, username, profilePic?profilePic:"");
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
    }
});

router.get("/reviews", async (req: express.Request, res: express.Response) => {
    const {
        recipeID, 
        page,
        orderBy   
    } = req.body;
    
    const reviews = await getReviewsByPage(recipeID, page, orderBy)
    res.send({reviews});
});
export default router;
