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
            // @ts-ignore
            dietaryPref: {
                create: {
                    dietaryPref: dietaryPref,
                },
            },
        },
    });
}

export async function saveRecipe(recipeID: number, userID: any) {
    //check if saved already
    const existingRecord = await prisma.userSavedRecipes.findUnique({
        where: {
            userID_recipeID: {
                userID: userID,
                recipeID: recipeID
            }
        }
    });

    //check if folder 0 exists already
    const existingFolder0 = await prisma.folder.findUnique({
        where: {
            userID: userID,
            id: 1
        }
    });

    //create if doesnt exist
    if (!existingRecord) {
        //first check if folder 0 exists (all saved recipes folder)

        if (!existingFolder0) { //if it doesnt exist then create it
            const newFolder0  = await prisma.folder.create({
                data: {
                    userID: userID,
                    folderName: 'All',
                }
            });

            console.log("folder 1 doesn't exist");
            return newFolder0;

        } else {
            console.log("folder 1 exists");
        }

        const newUserSavedRecipe  = await prisma.userSavedRecipes.create({
            data: {
                recipeID: recipeID,
                userID: userID,
                // @ts-ignore
                isShowing: true,
                folderID: 1,
            }
        });
        return newUserSavedRecipe;
    } else {
        const newUserSavedRecipeAgain = await prisma.userSavedRecipes.update({
            where: {
                userID_recipeID: {
                    userID: userID,
                    recipeID: recipeID
                }
            },
            data: {
                // @ts-ignore
                isShowing: true,
            }
        });
        return newUserSavedRecipeAgain;
    }
}

export async function deleteSavedRecipe(recipeID: any, userID: any) {
    const deleteSavedRecipe = await prisma.userSavedRecipes.update({
        where: {
            userID_recipeID: {
                userID: userID,
                recipeID: recipeID
            }
        },
        data: {
            // @ts-ignore
            isShowing: false,
        }
    });
}

export async function getSavedRecipes(userId: any) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            savedRecipes: {
              include: {
                recipe: true,
              },
            },
          },
    })

    return user;
}

export async function createFolder(userID: any, folderName: any) {
    const newFolder  = await prisma.folder.create({
        data: {
            userID: userID,
            folderName: folderName,
        }
    });

    console.log("created new folder " + folderName);
    return newFolder;
}

export async function getUserFolders(userId: any) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        include: {
            folder: true
          },
    })

    return user;
}

export async function deleteFolder(folderID: any) {
    const user = await prisma.folder.delete({
        where: {
            id: folderID,
        },
    })

    return user;
}

export async function getRecipesInFolder(userID: any, folderName: any) {
    const user = await prisma.user.findMany({
        where: {
            id: userID,
        },
        include: {
            savedRecipes: {
                include: {
                    recipe: true,
                    folder: true, // Include the folder information
                },
                where: {
                    folder: {
                        folderName: folderName,
                    },
                },
            },
        },
    })

    return user;
}
