import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function createRecipe(userID: number|any, title: string,description: string,instructions: string,cookTime: number,calories: number,servings: number,tags: any,image: string) {
    
    const cookTimeHours = Math.floor(cookTime/60);
    const cootTimeMinutes = cookTime%60;

    const recipe = await prisma.recipe.create({
        data: {
            authorID: userID,
            recipeTitle: title,
            description: description,
            cookTimeHours: cookTimeHours,
            cootTimeMinutes: cootTimeMinutes,
            calories: calories/1,
            servings: servings/1,
            recipeImage: image
        },
    })

    
}

export async function createIngredients(recipeID: number|any, ingredients: any) {

    let data = []

    for (let id in ingredients) {
        data.push({recipeID: recipeID, ingredient: ingredients[id].title, amount: Number(ingredients[id].amount), measurementType: ingredients[id].unit});
    }

    const post = await prisma.recipeingredients.createMany({
        data: data,
    }) 
}

export async function createInstructions(recipeID: number|any, instructions: any) {

    let data = []; 

    for (let i = 0; i < instructions.length; i++ ) {
        data.push({recipeID: recipeID, step: i+1, instruction: instructions[i].step});
    }

    const post = await prisma.recipeinstructions.createMany({
        data: data,
    }) 

}

export async function getRecipeByUserAndTitle(userID: number|undefined, title: string) {

    const recipe = await prisma.recipe.findFirst({
        where: {
            authorID: userID,
            recipeTitle: title
        },
    })

    return recipe;
}

// export async function updateRecipe(recipeID:number, userID: number|any, title: string,description: string,instructions: string,cookTime: number,calories: number,servings: number,tags: any,image: string) {
//     const cookTimeHours = Math.floor(cookTime/60);
//     const cootTimeMinutes = cookTime%60;
//
//     await prisma.recipe.update({
//         where: {
//           id: recipeID,
//           authorID: userID
//         },
//         data: {
//             recipeTitle: title,
//             description: description,
//             cookTimeHours: cookTimeHours,
//             cootTimeMinutes: cootTimeMinutes,
//             calories: calories/1,
//             servings: servings/1,
//             recipeImage: image
//         },
//     });
// }
//
// export async function updateInstructions(userId: number|any, recipeID: number|any, instructions: string) {
//     await prisma.recipeInstructions.update({
//        where: {
//            recipeID: recipeID
//        }
//     });
// }
//
// export async function updateIngredients(recipeID: number, ingredients: any) {
//     let data = []
//     //TO DO: replace measurementType with input field.
//     for (let id in ingredients) {
//         data.push({recipeID: recipeID, ingredient: ingredients[id].title, amount: Number(ingredients[id].amount), measurementType: ingredients[id].title});
//     }
//
//     await prisma.recipeIngredients.updateMany({
//         data: data,
//     })
// }