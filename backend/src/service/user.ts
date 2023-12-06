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