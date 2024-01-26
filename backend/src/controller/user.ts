import express, {Response, Request} from 'express';
import { PrismaClient } from '@prisma/client';
import {createUser, getModeratorStatus, addDietaryPref, saveRecipe} from '../service/user';
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

router.post("/add-dietary-preference/:username", async (req: updateUserRequest, res: express.Response) => {
  const username: string = req.params["username"]
  const dietaryPref: string = req.body.dietaryPref;
  await addDietaryPref(username, dietaryPref);
  res.sendStatus(200);
});

router.post("/save-recipe/:username", async (req: saveRecipe, res: express.Response) => {
  const username: string = req.params["username"]
  const recipeID: number = req.body.recipeID;
  await saveRecipe(username, recipeID);
  res.sendStatus(200);
});

// Retrieve moderator status of a user 
router.get("/get-mod-status/:username", async (req: express.Request, res: express.Response) => {
  const username: string = req.params["username"]
  return res.send(await getModeratorStatus(username));
});


export default router;