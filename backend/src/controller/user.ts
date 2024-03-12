import express, {Response, Request} from 'express';
import { PrismaClient } from '@prisma/client';
import {createUser, setProfilePicOfUser, getModeratorStatus, addDietaryPref, getUserById, saveRecipe, getSavedRecipes, getUserByUsername, deleteSavedRecipe, createFolder, getUserFolders, deleteFolder, getRecipesInFolder, saveRecipeToFolder} from '../service/user';
import { generateUploadURL } from '../service/s3';
const prisma = new PrismaClient();
const router = express.Router();

export interface addUserRequest extends express.Request {
  body: {
    email: string,
    username: string,
    password: string
  }
}

export interface updateUserRequest extends express.Request {
  body: {
    username: string,
    dietaryPref: string
  }
}

export interface saveRecipe extends express.Request {
  body: {
    username: string,
    recipeID: number
  }
}

router.post("/", async (req: addUserRequest, res: express.Response) => {
  const {email, username, password} = req.body;
  await createUser(email, username, password);
  res.sendStatus(200);
});

//publicly available, so don't include any private info such as password, emails, etc.
router.get("/id/:id", async (req: express.Request, res: express.Response) => {
  let user = await getUserById(Number(req.params['id']))

  return res.send({
    username: user?.username,
    porfilePic: user?.profilePic
  })
})

router.post("/add-dietary-preference/:username", async (req: updateUserRequest, res: express.Response) => {
  const username: string = req.params["username"]
  const dietaryPref: string = req.body.dietaryPref;
  await addDietaryPref(username, dietaryPref);
  res.sendStatus(200);
});

router.post("/save-recipe/:username", async (req: saveRecipe, res: express.Response) => {
  const username: string = req.params["username"]
  const recipeID: number = req.body.recipeID;
  const resultString: string = username.endsWith('}') ? username.slice(0, -1) : username; //remove the curly brackets thats at the end for some reason

  const user = await getUserByUsername(resultString);
  const userID = user?.id;

  await saveRecipe(recipeID, userID);
  res.sendStatus(200);
});

router.post("/update-profile/profilePic", async (req: express.Request, res: express.Response) => {
  try {
    const { username,
      profilePic
    } = req.body;

    console.log("update profile pic userid : " + username);

    await setProfilePicOfUser(username, profilePic)

    res.sendStatus(200);
  } catch(error) {
    console.error(error);
  }
});

router.get("/s3Url", async (req: express.Request, res: express.Response) => {
  const imageURL = await generateUploadURL()
  return res.send({ imageURL });
});

router.post("/save-recipe-to-folder/:username", async (req: express.Request, res: express.Response) => {
  const username: string = req.params["username"]
  const recipeID: number = req.body.recipeID;
  const folderID: number = req.body.folderID;
  const resultString: string = username.endsWith('}') ? username.slice(0, -1) : username; //remove the curly brackets thats at the end for some reason

  const user = await getUserByUsername(resultString);
  const userID = user?.id;

  await saveRecipeToFolder(recipeID, userID, folderID);
  res.sendStatus(200);
});

router.post("/create-folder/:username", async (req: express.Request, res: express.Response) => {
  const username: string = req.params["username"]
  const folderName: string = req.body.folderName;
  const resultString: string = username.endsWith('}') ? username.slice(0, -1) : username; //remove the curly brackets thats at the end for some reason

  const user = await getUserByUsername(resultString);
  const userID = user?.id;

  await createFolder(userID, folderName);
  res.sendStatus(200);
});

router.get("/get-folders/:username", async (req: express.Request, res: express.Response) => {
  const username: string = req.params["username"]
  const user = await getUserByUsername(username);
  const userId = user?.id;
  return res.send(await getUserFolders(userId));
});

router.delete("/delete-folder/:username", async (req: express.Request, res: express.Response) => {

  const folderID: string = req.body.folderId;

  return res.send(await deleteFolder(folderID));
});

router.post("/delete-saved-recipe/:username", async (req: express.Request, res: express.Response) => {
  const username: string = req.params["username"]
  const recipeID: number = req.body.recipeID;
  const resultString: string = username.endsWith('}') ? username.slice(0, -1) : username; //remove the curly brackets thats at the end for some reason

  const user = await getUserByUsername(resultString);
  const userID = user?.id;

  await deleteSavedRecipe(recipeID, userID);
  res.sendStatus(200);
});

router.get("/get-saved-recipes/:username", async (req: express.Request, res: express.Response) => {
  const username: string = req.params["username"]
  const user = await getUserByUsername(username);
  const userId = user?.id;
  return res.send(await getSavedRecipes(userId));
});

// Retrieve moderator status of a user
router.get("/get-mod-status/:username", async (req: express.Request, res: express.Response) => {
  const username: string = req.params["username"];
  return res.send(await getModeratorStatus(username));
});

// get recipes from a folder
router.get("/get-recipes-in-folder/:username", async (req: express.Request, res: express.Response) => {
  const username: string = req.params["username"]
  const folderName: string = req.params.folderName;
  const resultString: string = username.endsWith('}') ? username.slice(0, -1) : username; //remove the curly brackets thats at the end for some reason

  const user = await getUserByUsername(resultString);
  const userID = user?.id;

  return res.send(await getRecipesInFolder(userID, folderName));
});

export default router;
