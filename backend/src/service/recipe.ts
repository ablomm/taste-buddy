import { PrismaClient } from '@prisma/client';
import { getUserByEmail, getUserByUsername } from "../service/user";
const prisma = new PrismaClient()

export async function createRecipe(title: string,description: string,instructions: string,cookTime: any,calories: any,servings: any,image: string) {
    
    const cookTimeHours = Math.floor(cookTime/60);
    const cootTimeMinutes = cookTime%60;

    const post = await prisma.recipe.create({
        data: {
            authorID: 1,
            recipeTitle: title,
            description: description + instructions,
            cookTimeHours: cookTimeHours,
            cootTimeMinutes: cootTimeMinutes,
            calories: calories/1,
            servings: servings/1,
            recipeImage: image
        },
    })
}
