import {Client} from '@elastic/elasticsearch';
import 'dotenv/config';


// Elastic search db configurations
const client = new Client({
    node: process.env.ELASTICSEARCH_URL,
});

/**
 * The search term provided in the query will be searched across the recipes and posts indices
 * where the best matches across all fields will be returned. Upon retrieving the results, they
 * are divided by post and recipes in the JSON.
 *
 * @param searchTerm       Search query that will utilize to find relevant posts and recipes
 *                         in the Elasticsearch database.
 */
export async function search(searchTerm: string) {
    let response = null;

    try {
        console.log('Querying for ' + searchTerm + '...');

        // Search through both recipes and posts indices
        response = await client.search({
            index: ['recipes', 'posts'],
            query: {
                bool: {
                    must: {
                        multi_match: {
                            query: searchTerm,
                            type: 'best_fields', // Find best match based on relevancy
                            fields: ['*'] // Search through all fields
                        }
                    },
                    filter: {
                        bool: {
                            must_not: {
                                term: { isDeleted: true }
                            }
                        }
                    }
                }
            }
        });

        // Separate response by posts and recipes
        const {recipes, posts}:any = separateResponse(response);

        // Assemble JSON structure
        response = {
            searchTerm: searchTerm,
            foundRecipes: recipes.length > 0,
            foundPosts: posts.length > 0,
            numOfMatchingRecipes: recipes.length,
            numOfMatchingPosts: posts.length,
            recipes: recipes,
            posts: posts
        };

    } catch (error) {
        console.error(error);
        return error;
    }

    return response;
}

/**
 * This functions extracts and divides hits by posts and recipes.
 *
 * @param response      Elasticsearch response.
 */
function separateResponse(response: any) {
    let recipes: any[] = [];
    let posts: any[] = [];

    // Check if the 'hits' property exists in the response data
    if (response.hits && Array.isArray(response.hits.hits)) {
        // Iterate over each item in the 'hits' array
        response.hits.hits.forEach((hit: { _index: string; _source: any; }) => {
            // Add to recipes array if recipe otherwise the posts array
            if(hit._index == 'recipes') {
                recipes.push(hit._source);
            } else {
                posts.push(hit._source);
            }
        });
    } else {
        throw new Error('Error occurred while retrieving search results.');
    }

    return { recipes, posts };
}


/**
 * This function stores the recipe in the Elasticsearch database.
 *
 * @param recipe    Recipe object from request.
 * @param recipeID  Recipe ID as referenced in SQL database
 */
export async function storeRecipe(recipe: any, recipeID: number|undefined) {
    try {
        if (recipeID == undefined) {
            new Error("Recipe ID is missing.");
        } else {
            await client.index({
                index: 'recipes',
                id: recipeID.toString(),
                document: recipe
            });

            console.log("Successfully saved recipe to Elasticsearch DB ...");
        }
    } catch(error) {
        console.error(error);
        throw new Error("Error storing the recipe: " + error);
    }
}

export async function updateRatingES(recipeID: number, newRating: number) {
    try {
        if (recipeID == undefined) {
            new Error("Recipe ID is missing.");
        } else {
            await client.update({
                index: 'recipes',
                id: recipeID.toString(),
                doc: {
                    averageRating: newRating
                }
            });

            console.log("Successfully updated recipe rating in Elasticsearch DB ...");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error updating the recipe rating: " + error);
    }
}

/**
 * This function updates a recipe based on user edits.
 *
 * @param recipeId          Recipe ID as referenced in the SQL database
 * @param recipeTitle       Title of the recipe set by the user
 * @param description       Description of the recipe as set by the user
 * @param cookTime          Cook time as inputted by the user
 * @param calories          Calories of the recipe as set by the user
 * @param servings          Number of servings in the recipe as set by the user
 * @param recipeImage       URL of the image added by the user
 * @param ingredients       Ingredients inputted by the user
 * @param instructions      Instructions as set by the user
 */
export async function editRecipe(
    recipeId: number,
    recipeTitle: string,
    description: string,
    cookTime: number,
    calories: number | null,
    servings: number,
    recipeImage: string,
    ingredients: any[],
    instructions: any[]
    ) {
    try {
        const cookTimeHours = Math.floor(cookTime/60);
        const cookTimeMinutes = cookTime%60;

        // Assemble fields to update
        const updatedFields = {
            recipeTitle: recipeTitle,
            description: description,
            cookTimeHours: cookTimeHours,
            cootTimeMinutes: cookTimeMinutes,
            calories: calories,
            servings: servings,
            recipeImage: recipeImage,
            ingredients: ingredients,
            instructions: instructions
        }

        await client.update({
            index: 'recipes',
            id: recipeId.toString(),
            doc: updatedFields
        });

        console.log("Successfully updated recipe in Elasticsearch DB ...");
    } catch(error) {
        console.error(error);
    }
}

/**
 * This function stores posts in the Elasticsearch database.
 *
 * @param userId            User ID as referenced in the SQL database
 * @param description       Description of post
 * @param tags              Tags created by the user
 * @param image             URL of the image posted by the user
 * @param recipeURL         URL of the recipe provided by the user
 * @param postID            Post ID as referenced in the SQL database
 */
export async function storePost(userId: number|any, description: string, tags: any[], image: string, recipeURL: string, postID: number) {
    try {
        const document = {
            id: postID,
            userId: userId,
            description: description,
            tags: tags,
            image: image,
            recipeURL: recipeURL
        }

        await client.index({
            index: 'posts',
            id: postID.toString(),
            document: document
        });

        console.log("Successfully added to Elasticsearch DB ...");
    } catch(error) {
        console.error(error);
    }
}

export async function hidePost(postId: number) {
    try {
        await client.update({
            index: 'posts',
            id: postId.toString(),
            doc: {isDeleted: true}
        });

        console.log("Successfully set deleted to true in Elasticsearch DB ...");
    } catch(error) {
        console.error(error);
    }
}