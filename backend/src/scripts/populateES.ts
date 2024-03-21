import { PrismaClient } from "@prisma/client"
import { processIngredients, processInstructions, processTags } from "../service/recipe";
import { storePost, storeRecipe } from "../service/search";
const prisma = new PrismaClient()

const populateES = async () => {
    await populateESRecipes();
    await populateESPosts();

    process.exit(0);

}

const populateESRecipes = async () => {
    let recipes = await prisma.recipe.findMany({
        include: {
            ingredients: true,
            instructions: true,
            tags: true,
        }
    });

    for (let recipe of recipes) {
        const ingredientsObj = processIngredients(recipe.id, recipe.ingredients);
        const instructionsObj = processInstructions(recipe.id, recipe.ingredients);
        const processedTags = processTags(recipe.tags);


        // Assemble elastic search recipe object
        const elasticSearchRecipe: any = {
            ...recipe,
            ingredients: ingredientsObj,
            instructions: instructionsObj,
            tags: processedTags
        }

        // Store in elastic search db
        await storeRecipe(elasticSearchRecipe, recipe.id);
    }
}

const populateESPosts = async () => {
    let posts = await prisma.posts.findMany({
        include: {
            postTags: true,
        }
    });

    for (let post of posts) {
        // Store in elastic search db
        await storePost(post.author, post.description, post.postTags, post.image, post.recipeURL, post.id);
    }
}


export default populateES;