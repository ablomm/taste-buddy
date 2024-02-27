import express from "express";
import '../service/search';
import {search} from "../service/search";

const router = express.Router();

router.get("/all-content/:searchTerm", async (req: express.Request, res: express.Response) => {
    let results = null;

    try {
        const searchTerm = req.params['searchTerm'];
        results = await search(searchTerm); // Attempt to retrieve relevant posts/recipes
    } catch(error) {
        console.error(error);
        return res.status(500).send("Something went wrong. We are currently investigating the issue, please try again later.");
    }

    return res.status(200).json(results);
});

export default router;
