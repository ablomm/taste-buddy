import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import'express-async-errors';

//import routes
import userController from "./controller/user"

const app = express(); 

app.use(helmet()); 
app.use(cors()); 
app.use(express.json());

//routes
app.use('/user', userController);

//error handler; must be last
app.use((err: Error, req: express.Request, res: express.Response, next: express.RequestHandler) => {
    console.error(err.stack);
    res.status(500).json(err)
});


const PORT = process.env.PORT || 8080

app.listen(PORT, async () => {
   console.log(`listening on port ${PORT}`)
});