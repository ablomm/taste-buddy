import express, { Response, Request } from 'express';
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
                res.json({"id" : user.id, "username" : user.username})
                res.sendStatus(200);
            }
        } 
    } 
    res.sendStatus(401);

});

export default router;