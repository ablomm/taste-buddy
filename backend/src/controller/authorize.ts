import express from 'express';
const router = express.Router();
import jwt, { JwtPayload } from "jsonwebtoken";
import {getUserById} from "../service/user"


router.post("/", async (req: express.Request, res: express.Response) => {
    const { token } = req.cookies;
    let verify;
    if (token) {
        verify  = jwt.verify(token, process.env.JWTSHARED as any) as JwtPayload;
        if  (verify) {
            const user = await getUserById(verify.id as any);
            if (user) {
                res.json({"id" : user.id, "username" : user.username});
            }
        }
    } else {
        res.sendStatus(401);
    }
});

router.get("/logout", async (req: express.Request, res: express.Response) => {
    try {
        res.clearCookie("token");
        res.sendStatus(200);
    } catch(error) {
        console.error(error);
        res.status(500).send(error);
    }
});

export default router;
