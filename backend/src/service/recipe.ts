import { PrismaClient } from "@prisma/client";
import { RequestOptions, IncomingMessage } from "http";
import {updateRatingES} from "./search";

const prisma = new PrismaClient();
const http = require("http");

type Ingredient = {
    id: number;
    recipeID: number;
    ingredient: string;
    amount: number;
    measurementType: string;
};

type Instruction = {
    step: string;
};

export enum OrderBy {
    DateAscending = "DateAscending",
    DateDescending = "DateDescending",
    RatingAscending = "RatingAscending",
    RatingDescending = "RatingDescending",
}


export function processTags(tags: any[]) {
    return tags.map((tag) => tag.value);
}

export async function createRecipe(userID: number | any, title: string, description: string, instructions: string, cookTime: number, calories: number, servings: number, tags: any[], image: string) {

    const cookTimeHours = Math.floor(cookTime/60);
    const cootTimeMinutes = cookTime%60;

    const newRecipe = await prisma.recipe.create({
        data: {
            authorID: userID,
            recipeTitle: title,
            description: description,
            cookTimeHours: cookTimeHours,
            cootTimeMinutes: cootTimeMinutes,
            calories: calories / 1,
            servings: servings / 1,
            recipeImage: image,
            averageRating: 0,
        },
    })

    // Connect or create tags
    await Promise.all(tags.map(async tagName => {
        const existingTag = await prisma.tag.findUnique({
            where: {name: tagName},
        });

        if (existingTag) {
            // Tag already exists, connect it to the recipe
            await prisma.recipe.update({
                where: {id: newRecipe.id},
                data: {
                    tags: {
                        connect: {id: existingTag.id},
                    },
                },
            });
        } else {
            // Tag does not exist, create it and connect it to the recipe
            await prisma.tag.create({
                data: {
                    name: tagName,
                    recipes: {
                        connect: {id: newRecipe.id},
                    },
                },
            });
        }
    }));
}

export async function createIngredients(
    recipeID: number | any,
    ingredients: any
) {
    const data = processIngredients(recipeID, ingredients);

    await prisma.recipeIngredients.createMany({
        data: data,
    });
}

export function processIngredients(recipeID: any, ingredients: any) {
    let data = [];

    for (let id in ingredients) {
        data.push({
            recipeID: recipeID,
            ingredient: ingredients[id].title,
            amount: Number(ingredients[id].amount),
            measurementType: ingredients[id].unit,
        });
    }

    return data;
}

export async function createInstructions(
    recipeID: number | any,
    instructions: any
) {
    const data = processInstructions(recipeID, instructions);

    await prisma.recipeInstructions.createMany({
        data: data,
    });
}

export function processInstructions(recipeID: any, instructions: any) {
    let data = [];

    for (let i = 0; i < instructions.length; i++) {
        data.push({
            recipeID: recipeID,
            step: i + 1,
            instruction: instructions[i].step,
        });
    }

    return data;
}

export async function getRecipeByUserAndTitle(
    userID: number | undefined,
    title: string
) {
    return await prisma.recipe.findFirst({
        where: {
            authorID: userID,
            recipeTitle: title,
        },
    });
}

export async function getAllRecipes() {
    return await prisma.recipe.findMany();
}

// placeholder, use the algorithm when it is finished. Currently just displays it sequentually
export async function getRecipeBatch(batchNum: number) {
    const batchSize = 2;

    return await prisma.recipe.findMany({
        skip: batchSize * batchNum,
        take: batchSize,
    });
}

export async function getPersonalizedRecipes(savedRecipeIDs: any, rejectedRecipeIDs: any): Promise<any> {
    return new Promise((resolve, reject) => {
        // Create payload with saved + rejected recipe IDs
        const payload = {savedRecipeIDs: savedRecipeIDs, rejectedRecipeIDs:rejectedRecipeIDs}
        const postData = JSON.stringify(payload);

        // Options for the HTTP request personalized
        const options: RequestOptions = {
            // hostname: 'localhost',
            hostname: "127.0.0.1",
            port: 5000,
            path: "/api/personalized-recommendations",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData),
            },
        };

        // Set up the request
        const req = http.request(options, (res: IncomingMessage) => {
            // Handle incoming data
            let body = "";
            res.on("data", (chunk: Buffer) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    // Try to parse the JSON data
                    resolve(JSON.parse(body));
                    // resolve(body);
                } catch (error) {
                    reject(error);
                }
            });
        });
        req.on("error", (error: Error) => {
            reject(error);
        });

        // Write data to request body and end the request
        req.write(postData);
        req.end();
    });
}

export async function getTopRatedRecipes(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        // Convert the data to a JSON string
        const postData = JSON.stringify(data);

        // Options for the HTTP request top rated
        const options: RequestOptions = {
            // hostname: 'localhost',
            hostname: "127.0.0.1",
            port: 5000,
            path: "/api/top-rated-recipes",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData),
            },
        };
        // Set up the request
        const req = http.request(options, (res: IncomingMessage) => {
            // Handle incoming data
            let body = "";
            res.on("data", (chunk: Buffer) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    // Try to parse the JSON data
                    // resolve(JSON.parse(body));
                    resolve(body);
                } catch (error) {
                    reject(error);
                }
            });
        });
        req.on("error", (error: Error) => {
            reject(error);
        });

        // Write data to request body and end the request
        req.write(postData);
        req.end();
    });
}

export async function setupTopRatedModel(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        // Convert the data to a JSON string
        const postData = JSON.stringify(data);

        // Options for the HTTP request top rated
        const options: RequestOptions = {
            // hostname: 'localhost',
            hostname: "127.0.0.1",
            port: 5000,
            path: "/api/top-rated/setup",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData),
            },
        };
        // Set up the request
        const req = http.request(options, (res: IncomingMessage) => {
            // Handle incoming data
            let body = "";
            res.on("data", (chunk: Buffer) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    // Try to parse the JSON data
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(error);
                }
            });
        });
        req.on("error", (error: Error) => {
            reject(error);
        });

        // Write data to request body and end the request
        req.write(postData);
        req.end();
    });
}


export async function trainTopRated(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
        // Convert the data to a JSON string
        const postData = JSON.stringify(data);

        // Options for the HTTP request top rated
        const options: RequestOptions = {
            // hostname: 'localhost',
            hostname: "127.0.0.1",
            port: 5000,
            path: "/api/top-rated/train",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData),
            },
        };
        // Set up the request
        const req = http.request(options, (res: IncomingMessage) => {
            // Handle incoming data
            let body = "";
            res.on("data", (chunk: Buffer) => {
                body += chunk;
            });
            res.on("end", () => {
                try {
                    // Try to parse the JSON data
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(error);
                }
            });
        });
        req.on("error", (error: Error) => {
            reject(error);
        });

        // Write data to request body and end the request
        req.write(postData);
        req.end();
    });
}

/**
 * This function updates the recipe table using the recipe and user ID.
 * Any general information changes will be updated in the database.
 *
 * @param recipeID
 * @param userID
 * @param title
 * @param description
 * @param cookTime
 * @param calories
 * @param servings
 * @param image
 */
export async function updateRecipe(
    recipeID: number,
    userID: number | any,
    title: string,
    description: string,
    cookTime: number,
    calories: number,
    servings: number,
    image: string
) {
    const cookTimeHours = Math.floor(cookTime / 60);
    const cootTimeMinutes = cookTime % 60;

    await prisma.recipe.update({
        where: {
            id: recipeID,
            authorID: userID,
        },
        data: {
            recipeTitle: title,
            description: description,
            cookTimeHours: cookTimeHours,
            cootTimeMinutes: cootTimeMinutes,
            calories: calories / 1,
            servings: servings / 1,
            recipeImage: image,
        },
    });

    console.log("Recipe update completed ...");
}

/**
 * This function updates the ingredients using the recipe ID.
 * A full comparison between the currently stored ingredients and new ingredient lists is done.
 * This consists of comparing ingredient name, amount, and measurement type. Any discrepancies
 * found will invoke an update, deletion or creation of an ingredient in the database.
 * Update occurs when a modification of the amount or measurement type is made.
 * If the ingredient name no longer exists then it will be deleted from the database.
 * If a new ingredient is added then it will be inserted into the database.
 *
 * @param recipeId
 * @param newIngredients
 */
export async function updateIngredients(
    recipeId: number,
    newIngredients: Ingredient[]
) {
    // Retrieve all existing ingredients
    const ingredients: Ingredient[] = await prisma.recipeIngredients.findMany({
        where: {
            recipeID: recipeId,
        },
    });

    // Compare new ingredients to old ingredients
    let ingredientsToAdd: Ingredient[] = [];
    let ingredientsToRemove: number[] = [];

    // Check for ingredients to update and add
    for (const newIngredient of newIngredients) {
        let found = false;

        for (const oldIngredient of ingredients) {
            // If ingredient is found then check for differences
            if (newIngredient.ingredient == oldIngredient.ingredient) {
                found = true;

                // If new ingredient details are different to old then update
                if (
                    newIngredient.amount != oldIngredient.amount ||
                    !newIngredient.measurementType.includes(oldIngredient.measurementType)
                ) {
                    await prisma.recipeIngredients.update({
                        where: {
                            id: oldIngredient.id,
                        },
                        data: newIngredient,
                    });
                }
                break;
            }
        }

        // If new ingredient doesn't exist in old then add to db
        if (!found) {
            newIngredient.recipeID = recipeId;
            ingredientsToAdd.push(newIngredient);
        }
    }

    // Check for ingredients to remove
    for (const oldIngredient of ingredients) {
        let found = false;
        for (const newIngredient of newIngredients) {
            // If found then don't remove
            if (oldIngredient.ingredient == newIngredient.ingredient) {
                found = true;
                break;
            }
        }

        // If old ingredient no longer in new ingredient list then remove it
        if (!found) {
            ingredientsToRemove.push(oldIngredient.id);
        }
    }

    // Remove all ingredients no longer needed
    if (ingredientsToRemove.length > 0) {
        await prisma.recipeIngredients.deleteMany({
            where: {
                id: {
                    in: ingredientsToRemove,
                },
            },
        });
    }

    // Add new ingredients
    if (ingredientsToAdd.length > 0) {
        await prisma.recipeIngredients.createMany({
            data: processIngredients(recipeId, ingredientsToAdd),
        });
    }

    console.log("Ingredient update completed ...");
}

/**
 * This function updates the instructions in the database through the recipe ID.
 * Old and new instructions are compared by step length and content. If there are
 * any discrepancies between the two instruction lists then all currently stored instructions
 * will be removed then the new instructions will be inserted.
 *
 * @param recipeId
 * @param newInstructions
 */
export async function updateInstructions(
    recipeId: number,
    newInstructions: Instruction[]
) {
    try {
        // Retrieve existing instructions
        const instructions = await prisma.recipeInstructions.findMany({
            where: {
                recipeID: recipeId,
            },
        });

        let containSameInstructions: boolean = true;

        // Check if all old instruction steps are in the new instructions
        for (const instruction of instructions) {
            for (const newInstruction of newInstructions) {
                if (instruction.instruction != newInstruction.step) {
                    containSameInstructions = true;
                    break;
                }
            }

            if (!containSameInstructions) {
                break;
            }
        }

        // If some change occurred then reinsert new instructions
        if (
            instructions.length != newInstructions.length ||
            !containSameInstructions
        ) {
            // If so then delete all and insert new instructions
            await prisma.recipeInstructions.deleteMany({
                where: {
                    recipeID: recipeId,
                },
            });

            // insert new instructions
            await createInstructions(recipeId, newInstructions);
        }

        console.log("Instruction update complete ...");
    } catch (error) {
        console.error(
            "The following issue occurred during recipe instruction retrieval: \n" +
            error
        );
    }
}

/**
 * This function will create a new Review table entry given the required parameters.
 *
 * @param recipeID
 * @param reviewText
 * @param rating
 * @param userID
 * @param username
 * @param profilePic
 */
export async function createReview(
    recipeID: number,
    reviewText: string,
    rating: number,
    userID: number | any,
    username: string,
    profilePic: string
) {
    await prisma.review.create({
        data: {
            recipeID,
            reviewText,
            rating,
            userID,
            username,
            profilePic,
        },
    });

    console.log('created recipe review in mysql');

    // Calculate new average
    const newAverageRating = await recalculateAverageRating(recipeID);

    // Update recipe rating in mysql db
    await updateRecipeRating(recipeID, newAverageRating);

    // Update elastic search db
    await updateRatingES(recipeID, newAverageRating);
}

/**
 * This function retrieves the reviews per the page given the recipeID, page number,
 * and the order. If an OrderBy is given, then the query will be ordered, otherwise
 * it will retrieve in the same order inserted in the database.
 *
 * @param recipeID
 * @param page
 * @param order
 */
export async function getReviewsByPage(
    recipeID: number,
    page: number,
    order: OrderBy
) {
    const reviewsPerPage = 15;
    let orderBy = {};

    switch (order) {
        case OrderBy.DateAscending:
            orderBy = {timePosted: 'asc'};
            break;
        case OrderBy.DateDescending:
            orderBy = {timePosted: 'desc'};
            break;
        case OrderBy.RatingAscending:
            orderBy = {rating: 'asc'};
            break;
        case OrderBy.RatingDescending:
            orderBy = {rating: 'desc'};
            break;
        default:
            break;
    }

    try {
        const totalReviews = await prisma.review.count({
            where: {
                recipeID: recipeID,
            },
        });

        const totalPages = Math.ceil(totalReviews / reviewsPerPage);

        const reviews = await prisma.review.findMany({
            skip: reviewsPerPage * (page - 1),
            take: reviewsPerPage,
            where: {
                recipeID: recipeID,
            },
            orderBy: orderBy,
        });

        return {reviews, totalPages};
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        throw error;
    }
}

export async function getReviewByUser(userID: number, recipeID: number) {
    return await prisma.review.findFirst({
        where: {
            recipeID: recipeID,
            userID: userID
        },
    });
}

export async function getRecipes() {
    const user = await prisma.recipe.findMany({});

    return user;
}

export async function getRecipesByUserID(userID: number | undefined) {
    return await prisma.recipe.findMany({
        where: {
            authorID: userID
        },
    });
}

export async function getNumOfReviewByRecipe(recipeID: number) {
    return await prisma.review.count({
        where: {
            recipeID: recipeID,
        },
    });

}

export async function updateRecipeRating(recipeID: number, rating: number) {
    await prisma.recipe.update({
        where: {
            id: recipeID,
        },
        data: {
            averageRating: rating,
        },
    });
}
export async function getRecipeRating(recipeID: number) {
    const recipe = await prisma.recipe.findFirst({
        where: {
            id: recipeID,
        },
    });

    if (!recipe) {
        throw Error('Error retrieving recipe.');
    }

    return recipe.averageRating;
}

export async function deleteReview(recipeID: number, userID: number) {
    await prisma.review.deleteMany({
        where: {
            recipeID: recipeID,
            userID: userID
        }
    });


    const newAverageRating = await recalculateAverageRating(recipeID);

    await updateRecipeRating(recipeID, newAverageRating);
    await updateRatingES(recipeID, newAverageRating)
}

export async function recalculateAverageRating(recipeID: number) {
    // Query all reviews for the recipe
    const reviews = await prisma.review.findMany({
        where: {
            recipeID: recipeID
        }
    });

    if (reviews.length === 0) {
        return 0;
    }

    // Calculate the new average rating
    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRatings / reviews.length;
}


export async function getRecipesInFolder(userID: any, folderName: any) {
    const recipes = await prisma.recipe.findMany({
        include: {
            ingredients: true,
            instructions: true,
            tags: true,
        },
        where: {
            usersSaved: {
                some: {
                    userID: { equals: userID },
                    folders: {
                        some: {
                            folderName: { equals: folderName }
                        }
                    }
                }
            }
        }
    });
    return recipes;
}

export async function getRecipesByIDs(recipeIDs: number[]) {
    const recipes = await prisma.recipe.findMany({
        include: {
            ingredients: true,
            instructions: true,
            tags: true,
        },
        where: {
            id: {
                in: recipeIDs
            }
        }
    });
    return recipes;
}
