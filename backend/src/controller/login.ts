import express, { Response, Request } from 'express';
const router = express.Router();
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../service/user";
import bcrypt from "bcrypt";



router.post("/", async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body;

  const user = await getUserByEmail(username);
  if (user == null) {
    return res.sendStatus(401);
  }
  const result = await bcrypt.compare(password, user.password)

  if (result) {
    
    const token = jwt.sign(user as any, process.env.JWTSHARED as any, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
    })

    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }

});

export default router;