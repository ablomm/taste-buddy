import express, { Response, Request } from 'express';
const router = express.Router();
import jwt from "jsonwebtoken";



router.post("/", async (req: express.Request, res: express.Response) => {
    const { token } = req.cookies;
    const verify = jwt.verify(token, process.env.JWTSHARED as any);

    if (verify) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }

});

export default router;