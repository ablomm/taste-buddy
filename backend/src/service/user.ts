import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
import bcrypt from 'bcrypt';

export async function createUser(email: string, username: string, plainTextPassword: string) {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    return await prisma.user.create({
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

export async function setProfilePicOfUser(username:string, profilePic: string){
    const updateUser = await prisma.user.update({
        where: {
            username: username,
        },
        data: {
            profilePic:profilePic
        },
    });
}
export async function setProfileDescription(username:string, description: string){
    const updateUser = await prisma.user.update({
        where: {
            username: username,
        },
        data: {
            description:description
        },
    });
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

export async function saveRecipeToFolder(recipeID: number, userID: any, folderID: any) {
    //check if saved already

    for (let i=0; i<folderID.length;i++) {

        const existingFolder = await prisma.folder.findUnique({ //check if folder exists first
            where: {
                id: folderID[i],
            },
        });
        if (existingFolder) {
            const newUserSavedRecipe = await prisma.userSavedRecipes.update({
                where: {
                    userID_recipeID: {
                        userID: userID,
                        recipeID: recipeID
                    }
                }, data: {
                    folders: {
                        connect: [{ id: folderID[i] }] // Assuming you have 'id' properties in your Folder type
                    }
                }
            });
        } else if (!existingFolder){
            console.log("Folder doesn't exist!")
        }
    }
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

    //check if folder 0 exists already (this is unique)
    const existingFolder0 = await prisma.folder.findFirst({
        where: {
            userID: userID,
            folderName: 'All'
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

            console.log("folder 1 doesn't exist, recipe doesnt exist");
            const newUserSavedRecipe  = await prisma.userSavedRecipes.create({
                data: {
                    recipeID: recipeID,
                    userID: userID,
                    isShowing: true,
                    folders: {
                        connect: [{ id: newFolder0.id }] // Assuming you have 'id' properties in your Folder type
                    }
                }
            });
            return newUserSavedRecipe;

        } else {
            console.log("folder 1 exists, recipe doesnt exist");
            const newUserSavedRecipe  = await prisma.userSavedRecipes.create({
                data: {
                    recipeID: recipeID,
                    userID: userID,
                    isShowing: true,
                    folders: {
                        connect: [{ id: existingFolder0.id }] // Assuming you have 'id' properties in your Folder type
                    }
                }
            });
            return newUserSavedRecipe;
        }

    } else {
        try {
            if (!existingFolder0) { //if it doesnt exist then create it, ahhh?
                const newFolder0  = await prisma.folder.create({
                    data: {
                        userID: userID,
                        folderName: 'All',
                    }
                });
                console.log("folder 1 doesn't exist, recipe exists");
                const newUserSavedRecipeAgain = await prisma.userSavedRecipes.update({
                    where: {
                        userID_recipeID: {
                            userID: userID,
                            recipeID: recipeID
                        }
                    },
                    data: {
                        isShowing: true,
                        folders: {
                            connect: [{ id: newFolder0.id }] // Assuming you have 'id' properties in your Folder type
                        }
                    }
                });
                return newUserSavedRecipeAgain;
            }
            else {
                console.log("folder 1 exists, recipe exists");
                const newUserSavedRecipeAgain = await prisma.userSavedRecipes.update({
                    where: {
                        userID_recipeID: {
                            userID: userID,
                            recipeID: recipeID
                        }
                    },
                    data: {
                        isShowing: true,
                        folders: {
                            connect: [{ id: existingFolder0.id }] // Assuming you have 'id' properties in your Folder type
                        }
                    }
                });
                return newUserSavedRecipeAgain;
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle the error as needed
        }
    }
}

export async function rejectRecipe(recipeID: number, userID: number){
    //Check if existing
    const existingRecord = await prisma.userRejectedRecipes.findUnique({
        where: {
            userID_recipeID: {
                userID: userID,
                recipeID: recipeID
            }
        }
    });
    // Add rejected recipe
    if(!existingRecord){
        return await prisma.userRejectedRecipes.create({
            data: {
                recipeID: recipeID,
                userID: userID,
            }
        });
    }
}

export async function deleteSavedRecipe(recipeID: any, userID: any) {
    const userSavedRecipe = await prisma.userSavedRecipes.findUnique({
        where: {
            userID_recipeID: {
                userID: userID,
                recipeID: recipeID
            }
        },
        include: {
            folders: true, // Include the folder information
        },
    });

    if (!userSavedRecipe) {
        // Handle case where userSavedRecipe is not found
        return;
    }

    const foldersToDisconnect = userSavedRecipe.folders.map((folder: any) => ({
        id: folder.id,
    }));

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
            folders: {
                disconnect: foldersToDisconnect,
            },
        },
    });
}

export async function getSavedRecipes(userId: any) {
    const user = await prisma.user.findFirst({
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

export async function getSavedRecipeIDs(userID: number){
    const savedRecipeIDs = await prisma.userSavedRecipes.findMany({
        where: {
            userID: userID
        },
        select:{
            recipeID: true,
        }
    })
    return savedRecipeIDs;
}

export async function getRejectedRecipeIDs(userID:number){
    return await prisma.userRejectedRecipes.findMany({
        where: {
            userID: userID
        },
        select:{
            recipeID: true,
        }
    })
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
