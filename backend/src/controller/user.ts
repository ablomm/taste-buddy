import express, {Response, Request} from 'express';
import { PrismaClient } from '@prisma/client';
import {createUser} from '../service/user';
const prisma = new PrismaClient();
const router = express.Router();

export interface addUserRequest extends express.Request {
  body: {    
    email: string,
    username: string,
    password: string
  }
}

router.post("/", async (req: addUserRequest, res: express.Response) => {
  const {email, username, password} = req.body;
  await createUser(email, username, password);
  res.sendStatus(200);
});


export default router;