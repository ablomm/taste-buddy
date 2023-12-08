import { PrismaClient } from '@prisma/client';
import { getUserByEmail, getUserByUsername } from "../service/user";
import { AnyArn } from 'aws-sdk/clients/groundstation';
import { InstanceAccessControlAttributeConfiguration } from 'aws-sdk/clients/ssoadmin';
const prisma = new PrismaClient()

function formatInstructions(instructions: string): any {
    return instructions;
}

export async function createRecipe(userID: number|any, title: string,description: string,instructions: string,cookTime: number,calories: number,servings: number,tags: any,image: string) {
    
    const cookTimeHours = Math.floor(cookTime/60);
    const cootTimeMinutes = cookTime%60;

    const post = await prisma.recipe.create({
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

    //let ingredientList: { [id: string] : Ingredient; } = formatInstructions(instructions);

    console.log('ingredients')
    console.log(ingredients)
    let data = []
    //TO DO: replace measurementType with input field.
    for (let id in ingredients) {
        data.push({recipeID: recipeID, ingredient: ingredients[id].title, amount: Number(ingredients[id].amount), measurementType: ingredients[id].title});
    }

    const post = await prisma.recipeIngredients.createMany({
        data: data,
    }) 
}

export async function createInstructions(recipeID: number|any, instructions: string) {

    let instructionList = formatInstructions(instructions);

    console.log('instructionList')
    console.log(instructionList)
    let data = [{recipeID: recipeID, step: 1, instruction: instructionList}]; //temp
    /*for (let id in instructionList) {
        data.push({recipeID: recipeID, step: instructionList[id].step, instruction: instructionList[id].instruction});
    }*/

    const post = await prisma.recipeInstructions.createMany({
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

export async function getRecipes() {

    const user = await prisma.recipe.findMany({
    })

    return user;
}