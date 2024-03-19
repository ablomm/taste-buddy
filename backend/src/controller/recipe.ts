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
    updateInstructions,
    getRecipes,
    createReview,
    getReviewsByPage,
    processIngredients,
    processInstructions,
    getRecipeBatch,
    getRecipesByUserID,
    getPersonalizedRecipes,
    getTopRatedRecipes,
    setupTopRatedModel,
    trainTopRated
} from '../service/recipe';
import { getUserByUsername, getProfilePhotoByUsername, getSavedRecipeIDs, getRejectedRecipeIDs } from "../service/user";
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

router.get("/s3Url", async (req: express.Request, res: express.Response) => {
    const imageURL = await generateUploadURL()
    return res.send({ imageURL });
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

interface Recipe {
    RecipeId: number | 0;
    Name: string;
    CookTime: string | null;
    Description: string;
    Images: string[];
    RecipeCategory: string;
    Keywords: string[];
    RecipeIngredientQuantities: string[];
    RecipeIngredientParts: string[];
    AggregatedRating: number | 0;
    Calories: number | 0;
    RecipeServings: number | 0;
    RecipeInstructions: string[];
}

const convertToRecipe = (recipe: Recipe) => {
    return {
      id: 0,
      authorID: 0,
      creationTime: Date.now(),
      recipeTitle: recipe.Name,
      description: recipe.Description,
      cookTimeHours: 0,
      cootTimeMinutes: 0,
      calories: recipe.Calories,
      servings: recipe.RecipeServings,
      recipeImage: recipe.Images.length > 0 ? recipe.Images[0] : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png",
      averageRating: recipe.AggregatedRating,
      ingredients: recipe.RecipeIngredientQuantities.map((quantity, index) => {
        return { quantity: quantity, part: recipe.RecipeIngredientParts[index] }}),
      instructions: recipe.RecipeInstructions
    };
  }

router.post("/api/recommendations", async (req: express.Request, res: express.Response) => {
    try {
       // add batch logic here so that cards can be reloaded 
        // add contitional logic for calling correct calls
        // add logic to combine recipes from both calls before returning 
        // remove buttons on front end
        // find out how to show full recipe 
        // (maybe) add visual display for right/left/top swipe functionalities 
        const userID = req.body.userID;
        const savedRecipeIDs = await getSavedRecipeIDs(20); 
        const rejectedRecipeIDs = await getRejectedRecipeIDs(20);
        const temp = [ { recipeID: 39}, {recipeID: 41}, {recipeID: 43}, {recipeID: 51}, {recipeID: 52}, {recipeID: 54}, {recipeID: 60}]
        const tempReject = [ {recipeID: 1}, {recipeID: 2}, {recipeID: 3}, {recipeID: 4}, {recipeID: 5}]
        
        const personalizedResult = await getPersonalizedRecipes(temp, tempReject);
        const topRatedResult = await getTopRatedRecipes(req.body);

        // insert logic to combine list of top rated and personalized recipes
        //const recipes = JSON.parse(personalizedResult); //personalized results
        const recipes = JSON.parse(topRatedResult.replace(/\bNaN\b/g, "null")); //top rated results

        const recommend = recipes.map(convertToRecipe)

        // Send the result back to the client
        res.json(recommend);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/api/recommendations/setup", async (req: express.Request, res: express.Response) => {
    try { 
        const topRatedSetupResult = await setupTopRatedModel(req.body); 
        console.log(topRatedSetupResult)
        // Send the result back to the client
        res.json(topRatedSetupResult);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/api/recommendations/train", async (req: express.Request, res: express.Response) => {
    try { 
        const trainingModel = await trainTopRated(req.body); 
        // Send the result back to the client
        res.json(trainingModel);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
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