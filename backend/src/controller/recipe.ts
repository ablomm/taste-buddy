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
    getRecipesByUserID, 
    getReviewByUser, 
    OrderBy, 
    deleteReview, 
    getRecipeRating, 
    processTags,
    getPersonalizedRecipes,
    getTopRatedRecipes,
    getRecipesByIDs,
    setupTopRatedModel,
    trainTopRated
} from '../service/recipe';
import { getUserByUsername, getProfilePhotoByUsername, getSavedRecipeIDs, getRejectedRecipeIDs } from "../service/user";
import {editRecipe, storeRecipe} from "../service/search";
import jwt, { JwtPayload } from "jsonwebtoken";


const router = express.Router();


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
    const processedTags = processTags(tags);

    await createRecipe(userId, title, description, instructions, cookTime, calories, servings, processedTags, image);

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
        instructions: instructionsObj,
        tags: tags
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

interface DatasetRecipe {
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

const convertFromDatasetRecipe = (recipe: DatasetRecipe) => {
    return {
      id: recipe.RecipeId,
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
      ingredients: recipe.RecipeIngredientParts.map((ingredient, index) => {
        return { recipeID: recipe.RecipeId, amount: recipe.RecipeIngredientQuantities[index], ingredient: ingredient, measurementType: ""}}),
      instructions: recipe.RecipeInstructions,
      tags: []
    };
  }

router.post("/api/recommendations", async (req: express.Request, res: express.Response) => {
    try {
        const userID = req.body.userID;
        const savedRecipeIDs = await getSavedRecipeIDs(userID); 
        const rejectedRecipeIDs = await getRejectedRecipeIDs(userID);

        let personalizedResult = [], personalizedRecipes = [];

        // const temp = [ { recipeID: 39}, {recipeID: 41}, {recipeID: 43}, {recipeID: 51}, {recipeID: 52}, {recipeID: 54}, {recipeID: 60}]
        // const tempReject = [ {recipeID: 1}, {recipeID: 2}, {recipeID: 3}, {recipeID: 4}, {recipeID: 5}]

        // If there are saved recipes, get personalized recipes
        if(savedRecipeIDs.length > 0){
            // personalizedResult = await getPersonalizedRecipes(temp, rejectedRecipeIDs);
            personalizedResult = await getPersonalizedRecipes(savedRecipeIDs, rejectedRecipeIDs);
            personalizedRecipes = JSON.parse(personalizedResult);
         }
             
        // Get top rated recipes -- COMMENT OUT IF YOU DON'T HAVE ENOUGH RAM
        const topRatedResult = await getTopRatedRecipes(true);
        const topRecipes = JSON.parse(topRatedResult.replace(/\bNaN\b/g, "null"));
        const recipes: number[] = Array.from(new Set<number>(personalizedRecipes.concat(topRecipes))); // Combine personalized results with top rated -- ensure no duplicate
        
      // UNCOMMENT THIS IF COMMENTING OUT PREVIOUS (also ensure that the user you are signing in with has a saved recipe)
        // const recipes = personalizedRecipes;

        // Randomize combined list so that they are shown randomly to user
        for (let i = recipes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [recipes[i], recipes[j]] = [recipes[j], recipes[i]];
        }

        // convert recipes to Recipe object matching database before returning -- when return dataset object
        // const recommend = recipes.map(convertFromDatasetRecipe)

        // get recipes with the ID list that was returned
        const recommend = await getRecipesByIDs(recipes);

        // Send the result back to the client
        res.json(recommend);
    } catch (error) {
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

router.put("/edit-recipe", async (req: express.Request, res: express.Response) => {
    const { token } = req.cookies;
    let verify;

    if(token) {
         verify  = jwt.verify(token, process.env.JWTSHARED as any) as JwtPayload;
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
    }else{return res.status(403).send('Failed to authenticate user');}
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

router.get("/review-by-user", async (req: express.Request, res: express.Response) => {
    try {
        const userID = req.query.userID;
        const recipeID = req.query.recipeID;

        const review = await getReviewByUser(Number(userID), Number(recipeID));

        res.status(200).send({
            found: review != null,
            review: review
        });
    } catch (error) {
        res.status(500).send("Something went wrong ...");
    }
});

router.get("/reviews", async (req: express.Request, res: express.Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const orderBy = req.query.orderBy as OrderBy || OrderBy.DateDescending;
    const recipeID = parseInt(req.query.recipeID as string);

    const {reviews, totalPages} = await getReviewsByPage(recipeID, page, orderBy)
    res.send({reviews, totalPages});
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

router.get("/delete-review", async (req: express.Request, res: express.Response) => {
    try {
        const userID = parseInt(req.query.userID as string);
        const recipeID = parseInt(req.query.recipeID as string);

        await deleteReview(recipeID, userID);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.get("/get-recipe-rating", async (req: express.Request, res: express.Response) => {
    try {
        const recipeID = parseInt(req.query.recipeID as string);

        const rating = await getRecipeRating(recipeID);

        res.json({rating});
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
