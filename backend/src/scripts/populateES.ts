import { PrismaClient } from "@prisma/client"
import { processIngredients, processInstructions, processTags } from "../service/recipe";
import { storeRecipe } from "../service/search";
const prisma = new PrismaClient()


const populateES = async () => {
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

export default populateES;