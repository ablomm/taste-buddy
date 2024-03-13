import express from 'express';
import {
    createRecipe,
    createIngredients,
    createInstructions,
    getRecipeByUserAndTitle,
    getAllRecipes,
    updateRecipe,
    updateIngredients,
    updateInstructions,
    getRecipes,
    createReview,
    getReviewsByPage,
    processIngredients,
    processInstructions,
    getRecipeBatch,
    getRecipesByUserID
} from '../service/recipe';
import { getUserByUsername, getProfilePhotoByUsername } from "../service/user";
import {editRecipe, storeRecipe} from "../service/search";
const router = express.Router();

/*
TODO: Update average rating everytime new rating is added
 */

router.get("/get-recipe", async (req: express.Request, res: express.Response) => {
    let recipe = null;

    try {
        const { userId, title } : { userId?: number, title?: string } = req.query;

        if(userId != undefined && title != undefined) {
            recipe = await getRecipeByUserAndTitle(Number(userId), title);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Something went wrong ...");
    }
    if(recipe == null) {
        return res.status(404).send("Could not find this recipe ...");
    } else {
        return res.status(200).json(recipe);
    }
});

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

    console.log("recipe /save username: " + username);

    const user = await getUserByUsername(username);
    const userId = user?.id;
    await createRecipe(userId,title,description,instructions,cookTime,calories,servings,tags,image);

    const recipe = await getRecipeByUserAndTitle(userId,title);

    const recipeID = recipe?.id;
    await createIngredients(recipeID, ingredients);
    await createInstructions(recipeID, instructions);

    // Assemble ingredient and instructional objects for storage
    const ingredientsObj = processIngredients(recipeID, ingredients);
    const instructionsObj = processInstructions(recipeID, instructions);

    // Assemble elastic search recipe object
    const elasticSearchRecipe: any = {
        ...recipe,
        ingredients: ingredientsObj,
        instructions: instructionsObj
    }

    // Store in elastic search db
    await storeRecipe(elasticSearchRecipe, recipeID);

    res.sendStatus(200);
});

router.get("/get-all-recipes", async (req: express.Request, res: express.Response) => {
    try{
        const allRecipes = await getAllRecipes();
        return res.json(allRecipes);
    }catch (error){
        console.error(error);
    }
});

router.get("/batch/:num", async (req: express.Request, res: express.Response) => {
    const num: number = parseInt(req.params["num"]); // how many batches the client has seen in it's session. Increments every batch (on frontend)
    try{
        const recipes = await getRecipeBatch(num);
        return res.json(recipes);
    }catch (error){
        console.error(error);
    }
});

router.put("/edit-recipe", async (req: express.Request, res: express.Response) => {
    const { token } = req.cookies;
    let verify = true;

    // if(token) {
    //     verify  = jwt.verify(token, process.env.JWTSHARED as any) as JwtPayload;
    // }

    if(verify) {
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

            // Edit recipe in elastic search
            await editRecipe(
                recipeId,
                title,
                description,
                cookTime,
                calories,
                servings,
                image,
                processIngredients(recipeId, ingredients),
                processInstructions(recipeId, instructions)
                );

            console.log(`Successfully updated recipe ID: ${recipeId}`);
        } catch (error) {
            console.error(error);
        }

        return res.status(200).send('success');
    }

    return res.status(403).send('Failed to authenticate user');
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

    try {
        const user = await getUserByUsername(username)
        const profilePic = await getProfilePhotoByUsername(username);
        const userID = user?.id;
        await createReview(recipeID ,reviewText, rating, userID, username, profilePic?profilePic:"");
        console.log("Review created by: " + username);
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


router.get("/get-recipes-for-user/:username", async (req: express.Request, res: express.Response) => {
    try {
        const username: string = req.params["username"]

        const user = await getUserByUsername(username);
        const userId = user?.id;

        const recipes = await getRecipesByUserID(userId); 

        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});