import express, { Response, Request } from 'express';
const router = express.Router();
import jwt from "jsonwebtoken";
import {getUserByUsername } from "../service/user";
import bcrypt from "bcrypt";



router.post("/", async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;
  
  const user = await getUserByUsername(username);
  if (user == null) {
    console.log("username incorrect");
    return res.sendStatus(401);
  }
  const result = await bcrypt.compare(password, user.password)

  if (result) {
    
    const token = jwt.sign({"id" : user.id}, process.env.JWTSHARED as any, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
    })
    res.status(200).json({"username": user.username, "id" : user.id})
  } else {
    res.sendStatus(401);
  }

});

export default router;