import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
import bcrypt from 'bcrypt';

export async function createUser(email: string, username: string, plainTextPassword: string) {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    const post = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
            profilePic: ""
        },
    })
}

export async function getUserByEmail(email: string) {

    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
    })

    return user;
}

export async function getUserByUsername(username: string) {

    const user = await prisma.user.findUnique({
        where: {
            username: username
        },
    })

    return user;
}

export async function getUserById(id: number) {

    const user = await prisma.user.findUnique({
        where: {
            id: id
        },
    })

    return user;
}

// Retrieve moderator status of user 
export async function getModeratorStatus(username: string) {
    // Retrieve mod status from db 
    const userData = await prisma.user.findFirst({
        where: {
            username: username
        }
    });

    // User should always exist since this is checked after logging in
    return userData?.isModerator;
}

export async function getProfilePhotoByUsername(username: string) {
    const userData = await prisma.user.findFirst({
        where: {
            username: username
        }
    });

    return userData?.profilePic;
}

export async function addDietaryPref(username: string, dietaryPref: string) {
    const updateUser = await prisma.user.update({
        where: {
            username: username,
        },
        data: {
            dietaryPref: {
                create: {
                    dietaryPref: dietaryPref,
                },
            },
        },
    });
}

export async function saveRecipe(username: string, recipeID: number) {
    const updateUser = await prisma.user.update({
        where: {
            username: username,
        },
        data: {
            savedRecipes: {
                create: {
                    recipeID: recipeID,
                },
            },
        },
    });
}